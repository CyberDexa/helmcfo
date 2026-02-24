import { NextRequest, NextResponse } from "next/server";
import { generateBoardPack } from "@/lib/ai/board-report-agent";
import { buildFinancialSnapshot } from "@/lib/financials";
import { runEngine } from "@/lib/engine";
import { auditLog, auditFromRequest } from "@/lib/security/audit-log";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 503 }
      );
    }

    const snapshot = await buildFinancialSnapshot({});
    const position = {
      cashBalance: snapshot.cashBalance,
      monthlyBurn: snapshot.monthlyBurn,
      monthlyRevenue: snapshot.mrr,
      headcount: snapshot.headcount,
      avgFullyLoadedSalary: 160_000,
      overdueAR: snapshot.overdueAR,
    };
    const { runwayAnalysis: runway, burnBreakdown: burn } = runEngine(position);

    const boardPack = await generateBoardPack(snapshot, runway, burn);

    auditLog({
      event: "ai.analysis",
      ...auditFromRequest(req),
      metadata: { type: "board_report", confidence: boardPack.confidenceScore },
    });

    return NextResponse.json(boardPack);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
