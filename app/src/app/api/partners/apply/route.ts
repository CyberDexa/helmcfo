import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, RATE_LIMITS, getRateLimitKey, rateLimitHeaders } from "@/lib/security/rate-limiter";

const schema = z.object({
  type: z.enum(["vc", "accounting"]),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().min(2).max(100),
  website: z.string().url().optional().or(z.literal("")),
  /** For VC firms: number of portfolio companies */
  portfolioSize: z.coerce.number().int().min(1).max(10_000).optional(),
  /** For accounting firms: number of SMB clients */
  clientCount: z.coerce.number().int().min(1).max(10_000).optional(),
  message: z.string().max(1000).optional(),
});

type PartnerApplication = z.infer<typeof schema> & {
  id: string;
  receivedAt: string;
  status: "pending" | "approved" | "rejected";
};

// In-memory store — replace with Postgres/Supabase in production
const applications: PartnerApplication[] = [];

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Rate-limit by IP — max 3 applications per hour
  const key = `partner:${getRateLimitKey(req)}`;
  const rateResult = checkRateLimit(key, RATE_LIMITS.form);
  if (!rateResult.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429, headers: rateLimitHeaders(rateResult, RATE_LIMITS.form.limit) }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Reject duplicate email applications
  const existing = applications.find(
    (a) => a.email === data.email && a.type === data.type
  );
  if (existing) {
    return NextResponse.json({
      ok: true,
      message: "We already have your application on file. Our team will be in touch soon.",
      applicationId: existing.id,
    });
  }

  const application: PartnerApplication = {
    ...data,
    id: `partner_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    receivedAt: new Date().toISOString(),
    status: "pending",
  };
  applications.push(application);

  // TODO: send email notification to partnerships@helmcfo.com
  // TODO: create CRM entry in HubSpot/Attio
  // TODO: send confirmation email to applicant

  console.info("[partner-apply] New application:", {
    id: application.id,
    type: application.type,
    email: application.email,
    company: application.company,
  });

  const message =
    data.type === "vc"
      ? "Thanks for applying to the HelmCFO VC Portfolio Program! We'll reach out within 1 business day to schedule an onboarding call."
      : "Thanks for applying to the HelmCFO Accounting Partner Program! A member of our partnerships team will contact you within 1 business day.";

  return NextResponse.json(
    { ok: true, message, applicationId: application.id },
    { status: 201 }
  );
}

/** Internal: list all applications — protect with auth middleware in production */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get("authorization");
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    count: applications.length,
    applications: applications.map(({ ...a }) => a),
  });
}
