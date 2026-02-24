import { NextRequest, NextResponse } from "next/server";
import { createLinkToken } from "@/lib/integrations/plaid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { userId?: string };
    const userId = body.userId ?? "demo-user";
    const linkToken = await createLinkToken(userId);
    return NextResponse.json({ link_token: linkToken });
  } catch (err) {
    console.error("[plaid/link-token]", err);
    return NextResponse.json({ error: "Failed to create link token" }, { status: 500 });
  }
}
