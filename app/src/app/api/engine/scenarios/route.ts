import { NextRequest, NextResponse } from "next/server";
import { buildFinancialSnapshot } from "@/lib/financials";
import { runAllScenarios } from "@/lib/engine/forecast";
import { auditLog, auditFromRequest } from "@/lib/security/audit-log";

export async function GET(req: NextRequest) {
  try {
    const snapshot = await buildFinancialSnapshot({});

    const position = {
      cashBalance: snapshot.cashBalance,
      monthlyBurn: snapshot.monthlyBurn,
      monthlyRevenue: snapshot.mrr,
      headcount: snapshot.headcount,
      avgFullyLoadedSalary: 160_000,
      overdueAR: snapshot.overdueAR,
    };

    const scenarios = runAllScenarios(position, 12);

    auditLog({ event: "engine.run", ...auditFromRequest(req), metadata: { type: "scenarios" } });

    return NextResponse.json({
      scenarios,
      snapshot: {
        cashBalance: snapshot.cashBalance,
        monthlyBurn: snapshot.monthlyBurn,
        mrr: snapshot.mrr,
        syncedAt: snapshot.syncedAt,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
