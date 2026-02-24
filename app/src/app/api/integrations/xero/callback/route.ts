import { NextRequest, NextResponse } from "next/server";

const XERO_CLIENT_ID = process.env.XERO_CLIENT_ID ?? "";
const XERO_CLIENT_SECRET = process.env.XERO_CLIENT_SECRET ?? "";
const XERO_REDIRECT_URI = process.env.XERO_REDIRECT_URI ?? "http://localhost:3001/api/integrations/xero/callback";

interface XeroTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface XeroTenant {
  tenantId: string;
  tenantType: string;
  tenantName: string;
  createdDateUtc: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `/settings?xero=error&reason=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.json({ ok: false, error: "Missing authorization code" }, { status: 400 });
  }

  // Exchange code for tokens
  const credentials = Buffer.from(`${XERO_CLIENT_ID}:${XERO_CLIENT_SECRET}`).toString("base64");

  const tokenRes = await fetch("https://identity.xero.com/connect/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: XERO_REDIRECT_URI,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("[xero-callback] Token exchange failed:", err);
    return NextResponse.redirect("/settings?xero=error&reason=token_exchange");
  }

  const tokens: XeroTokenResponse = await tokenRes.json();

  // Fetch available tenants (Xero organisations)
  const tenantsRes = await fetch("https://api.xero.com/connections", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!tenantsRes.ok) {
    return NextResponse.redirect("/settings?xero=error&reason=tenants");
  }

  const tenants: XeroTenant[] = await tenantsRes.json();

  // TODO: persist tokens + selected tenant to DB, associate with authenticated user session
  // For now: log and redirect with success
  console.info("[xero-callback] Connected tenants:", tenants.map((t) => t.tenantName));

  return NextResponse.redirect(`/settings?xero=connected&org=${encodeURIComponent(tenants[0]?.tenantName ?? "")}`);
}
