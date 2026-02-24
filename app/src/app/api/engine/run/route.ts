import { NextRequest, NextResponse } from "next/server";
import { runEngine } from "@/lib/engine";
import type { FinancialPosition } from "@/lib/engine/types";

const DEFAULT_POSITION: FinancialPosition = {
  cashBalance: 574_000,
  monthlyBurn: 287_000,
  monthlyRevenue: 271_000,
  headcount: 34,
  avgFullyLoadedSalary: 160_000,
  overdueAR: 94_000,
};

/** GET /api/engine/run — returns full engine result using current financial position */
export async function GET() {
  const result = runEngine(DEFAULT_POSITION);
  return NextResponse.json(result);
}

/** POST /api/engine/run — accepts a FinancialPosition body for custom projections */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<FinancialPosition>;
    const position: FinancialPosition = { ...DEFAULT_POSITION, ...body };
    const result = runEngine(position);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[engine/run]", err);
    return NextResponse.json({ error: "Engine run failed" }, { status: 500 });
  }
}
