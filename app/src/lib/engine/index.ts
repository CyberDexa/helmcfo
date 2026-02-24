/**
 * Public API for the deterministic computation engine.
 *
 * Usage:
 *   import { runEngine } from "@/lib/engine";
 *   const result = runEngine(snapshot);
 */
export * from "./types";
export * from "./forecast";
export * from "./burn";
export * from "./runway";

import type { FinancialPosition } from "./types";
import { runAllScenarios } from "./forecast";
import { buildBurnBreakdownFromMockData, buildBurnBreakdown, type RawExpense } from "./burn";
import { buildRunwayAnalysis } from "./runway";

// ── Full engine run ───────────────────────────────────────────────────────────

export interface EngineResult {
  scenarios: ReturnType<typeof runAllScenarios>;
  burnBreakdown: ReturnType<typeof buildBurnBreakdownFromMockData>;
  runwayAnalysis: ReturnType<typeof buildRunwayAnalysis>;
}

/**
 * Runs the complete computation engine against a financial position.
 * Call this from API routes or server components.
 */
export function runEngine(
  position: FinancialPosition,
  otherExpenses?: RawExpense[]
): EngineResult {
  const scenarios = runAllScenarios(position, 12);

  const burnBreakdown = otherExpenses
    ? buildBurnBreakdown(position.monthlyBurn, {
        headcount: position.headcount,
        avgFullyLoadedMonthly: (position.avgFullyLoadedSalary * 1.25) / 12,
      }, otherExpenses)
    : buildBurnBreakdownFromMockData(position.monthlyBurn);

  const runwayAnalysis = buildRunwayAnalysis(
    position.cashBalance,
    position.monthlyBurn,
    position.monthlyRevenue,
    position.overdueAR,
    position.headcount,
    position.avgFullyLoadedSalary
  );

  return { scenarios, burnBreakdown, runwayAnalysis };
}
