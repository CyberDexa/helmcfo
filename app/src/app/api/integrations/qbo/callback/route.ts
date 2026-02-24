import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/integrations/quickbooks";

/** GET /api/integrations/qbo/callback — Intuit redirects here after user consent */
export async function GET(req: NextRequest) {
  const url = req.url;
  const { searchParams } = new URL(url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const realmId = searchParams.get("realmId");
  const error = searchParams.get("error");

  // User cancelled or error from Intuit
  if (error || !code || !realmId) {
    return NextResponse.redirect(
      new URL("/settings?error=qbo_auth_failed", req.nextUrl.origin)
    );
  }

  // CSRF check
  const cookieState = req.cookies.get("qbo_oauth_state")?.value;
  if (!cookieState || cookieState !== state) {
    return NextResponse.redirect(
      new URL("/settings?error=qbo_state_mismatch", req.nextUrl.origin)
    );
  }

  try {
    const tokens = await exchangeCode(url);
    // In production: encrypt tokens.accessToken + refreshToken and persist per-tenant
    // For now, redirect back to settings with a success flag
    const response = NextResponse.redirect(
      new URL("/settings?connected=qbo", req.nextUrl.origin)
    );
    // Clear the CSRF state cookie
    response.cookies.set("qbo_oauth_state", "", { maxAge: 0, path: "/" });
    return response;
  } catch (err) {
    console.error("[qbo/callback]", err);
    return NextResponse.redirect(
      new URL("/settings?error=qbo_token_exchange_failed", req.nextUrl.origin)
    );
  }
}
