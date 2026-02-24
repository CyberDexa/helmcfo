import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  role: z.string().optional(),
});

// In production: write to a database table and trigger welcome email
const waitlistStore: Array<{ email: string; company?: string; role?: string; joinedAt: string }> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = schema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const { email, company, role } = validated.data;

    // Deduplication
    const already = waitlistStore.find((e) => e.email === email);
    if (already) {
      return NextResponse.json({ ok: true, message: "Already on the list", alreadyExists: true });
    }

    waitlistStore.push({ email, company, role, joinedAt: new Date().toISOString() });

    console.log(`[waitlist] New signup: ${email} (${company ?? "unknown"}) — total: ${waitlistStore.length}`);

    return NextResponse.json({
      ok: true,
      message: "You're on the list! We'll reach out within 24 hours.",
      position: waitlistStore.length,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  // Internal endpoint — in production, require admin auth
  const apiKey = process.env.INTERNAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ count: waitlistStore.length });
  }
  return NextResponse.json({ count: waitlistStore.length, entries: waitlistStore });
}
