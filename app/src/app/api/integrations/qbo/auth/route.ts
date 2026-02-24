import { NextRequest, NextResponse } from "next/server";
import { getAuthUri } from "@/lib/integrations/quickbooks";

/** GET /api/integrations/qbo/auth — redirect user to Intuit OAuth consent screen */
export async function GET(req: NextRequest) {
  const state = crypto.randomUUID();
  const authUri = getAuthUri(state);
  // Store state in a short-lived cookie for CSRF protection
  const response = NextResponse.redirect(authUri);
  response.cookies.set("qbo_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });
  return response;
}
