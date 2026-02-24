import { NextRequest, NextResponse } from "next/server";
import { exchangePublicToken } from "@/lib/integrations/plaid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { public_token?: string };
    if (!body.public_token) {
      return NextResponse.json({ error: "public_token required" }, { status: 400 });
    }
    const { accessToken, itemId } = await exchangePublicToken(body.public_token);
    // In production: encrypt accessToken and store per-tenant in your DB
    // For now return it so the client can store in session / call further APIs
    return NextResponse.json({ access_token: accessToken, item_id: itemId });
  } catch (err) {
    console.error("[plaid/exchange]", err);
    return NextResponse.json({ error: "Token exchange failed" }, { status: 500 });
  }
}
