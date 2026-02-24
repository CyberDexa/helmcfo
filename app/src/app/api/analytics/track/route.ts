import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getRateLimitKey } from "@/lib/security/rate-limiter";

const schema = z.object({
  event: z.string().min(1).max(100),
  properties: z.record(z.string(), z.unknown()).optional(),
  userId: z.string().max(256).optional(),
  anonymousId: z.string().max(256).optional(),
  timestamp: z.string().datetime().optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Rate limit analytics ingestion — generous but bounded
  const key = `analytics:${getRateLimitKey(req)}`;
  const rateResult = checkRateLimit(key, { limit: 120, windowMs: 60_000 });
  if (!rateResult.allowed) {
    // Don't block the client for analytics — just silently drop
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const { event, properties, userId, anonymousId, timestamp } = parsed.data;

  // Log for now — swap this for PostHog / Mixpanel / Segment in production:
  // await posthog.capture({ distinctId: userId ?? anonymousId, event, properties });
  console.info("[analytics]", {
    event,
    userId,
    anonymousId,
    timestamp: timestamp ?? new Date().toISOString(),
    properties,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
