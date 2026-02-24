import { NextResponse } from "next/server";

export const runtime = "edge";

export function GET() {
  return NextResponse.json({
    status: "ok",
    app: "helmcfo",
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    timestamp: new Date().toISOString(),
  });
}
