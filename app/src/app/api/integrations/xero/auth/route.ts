import { NextRequest, NextResponse } from "next/server";

const XERO_CLIENT_ID = process.env.XERO_CLIENT_ID ?? "";
const XERO_CLIENT_SECRET = process.env.XERO_CLIENT_SECRET ?? "";
const XERO_REDIRECT_URI = process.env.XERO_REDIRECT_URI ?? "http://localhost:3001/api/integrations/xero/callback";

const XERO_SCOPES = [
  "openid",
  "profile",
  "email",
  "accounting.transactions.read",
  "accounting.reports.read",
  "accounting.journals.read",
  "accounting.settings.read",
  "accounting.contacts.read",
  "offline_access",
].join(" ");

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!XERO_CLIENT_ID) {
    return NextResponse.json({ ok: false, error: "Xero integration not configured" }, { status: 503 });
  }

  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: XERO_CLIENT_ID,
    redirect_uri: XERO_REDIRECT_URI,
    scope: XERO_SCOPES,
    state,
  });

  const authUrl = `https://login.xero.com/identity/connect/authorize?${params.toString()}`;

  // In production: store state in session/DB to validate on callback
  return NextResponse.redirect(authUrl);
}
