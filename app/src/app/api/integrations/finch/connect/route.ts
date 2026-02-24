import { NextRequest, NextResponse } from "next/server";
import { exchangeFinchCode, syncFinchPayroll } from "@/lib/integrations/finch";
import { encrypt } from "@/lib/security/encryption";
import { auditLog, auditFromRequest } from "@/lib/security/audit-log";

// POST /api/integrations/finch/connect  — exchange auth code + sync payroll
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { code?: string; accessToken?: string };
    const { ip } = auditFromRequest(req);

    let accessToken: string;

    if (body.code) {
      accessToken = await exchangeFinchCode(body.code);
    } else if (body.accessToken) {
      accessToken = body.accessToken;
    } else {
      return NextResponse.json({ error: "code or accessToken required" }, { status: 400 });
    }

    const summary = await syncFinchPayroll(accessToken);

    // In production: persist encrypt(accessToken) to your DB scoped to companyId
    const encryptedToken = process.env.ENCRYPTION_KEY ? encrypt(accessToken) : null;

    auditLog({
      event: "token.write",
      ip,
      integration: "finch",
      metadata: {
        headcount: summary.activeHeadcount,
        hasEncryptedToken: Boolean(encryptedToken),
      },
    });

    return NextResponse.json({ ok: true, summary, encryptedToken });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/integrations/finch/connect  — re-sync with stored token
export async function GET(req: NextRequest) {
  const token = req.headers.get("x-finch-token");
  if (!token) {
    return NextResponse.json({ error: "x-finch-token header required" }, { status: 400 });
  }

  try {
    const summary = await syncFinchPayroll(token);
    auditLog({ event: "token.read", integration: "finch", ...auditFromRequest(req) });
    return NextResponse.json(summary);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
