import { NextRequest, NextResponse } from "next/server";
import { buildFinancialSnapshot, type IntegrationCredentials } from "@/lib/financials";

/**
 * POST /api/financials/snapshot
 * Body: IntegrationCredentials (in production, credentials come from encrypted DB — not client)
 * Returns: FinancialSnapshot
 */
export async function POST(req: NextRequest) {
  try {
    // In production, resolve credentials from the authenticated session/DB, not the request body.
    // The body approach here is for local dev / demo only.
    const body = await req.json() as IntegrationCredentials;
    const snapshot = await buildFinancialSnapshot(body);
    return NextResponse.json(snapshot);
  } catch (err) {
    console.error("[financials/snapshot]", err);
    return NextResponse.json({ error: "Failed to build financial snapshot" }, { status: 500 });
  }
}

/** GET — returns snapshot using credentials stored in the server session (future auth integration) */
export async function GET() {
  // When no credentials are configured, return mock snapshot for demo
  const snapshot = await buildFinancialSnapshot({});
  return NextResponse.json(snapshot);
}
