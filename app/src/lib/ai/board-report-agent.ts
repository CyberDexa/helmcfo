/**
 * Board report agent — generates a structured, investor-ready board narrative
 * grounded in real financial data using generateObject with a strict Zod schema.
 */

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { FinancialSnapshot } from "@/lib/financials";
import type { RunwayAnalysis } from "@/lib/engine/types";
import type { BurnBreakdown } from "@/lib/engine/types";

const BoardPackSchema = z.object({
  quarter: z.string().describe("e.g. Q1 2026"),
  companyName: z.string(),
  executiveSummary: z.string().describe("2-3 sentence high-level summary for board members"),
  financialPosition: z.string().describe("Cash, burn, runway, and near-term liquidity narrative"),
  growthMetrics: z.string().describe("MRR, ARR, customer count, growth rate narrative"),
  unitEconomics: z.string().describe("CAC, LTV, gross margin, NRR commentary"),
  keyRisks: z.string().describe("Top 2-3 financial risks and mitigations"),
  asksAndNextSteps: z.string().describe("Specific asks from the board and action items"),
  confidenceScore: z.number().min(0).max(100).describe("AI confidence in the narrative based on data completeness"),
  dataCaveats: z.array(z.string()).describe("Caveats about data gaps or assumptions made"),
});

export type BoardPack = z.infer<typeof BoardPackSchema>;

function buildBoardPrompt(
  snapshot: FinancialSnapshot,
  runway: RunwayAnalysis,
  burn: BurnBreakdown
): string {
  const arr = snapshot.mrr * 12;
  const ltvCac = snapshot.cac > 0 ? (snapshot.ltv / snapshot.cac).toFixed(1) : "N/A";
  const connectedSources = Object.entries(snapshot.sources)
    .filter(([, v]) => v)
    .map(([k]) => k.toUpperCase())
    .join(", ") || "demo data";

  return `You are a senior CFO preparing a board pack for a Series A-stage company.
Generate a professional, data-driven board narrative. Be factual and specific — cite exact numbers.
Do NOT invent metrics not provided. If a metric is unavailable, note it in dataCaveats.

LIVE FINANCIAL DATA (as of ${snapshot.syncedAt}):
Data sources connected: ${connectedSources}

Cash & Runway:
- Cash balance: $${snapshot.cashBalance.toLocaleString()}
- Monthly burn: $${snapshot.monthlyBurn.toLocaleString()}
- Runway: ${runway.baseRunwayMonths} months (runout: ${runway.baseRunoutDate})
- Monthly burn by category: ${burn.categories.map((c) => `${c.label} $${c.monthlyAmount.toLocaleString()} (${(c.pctOfBurn * 100).toFixed(0)}%)`).join(", ")}
- Payroll as % of burn: ${(burn.payrollRatio * 100).toFixed(0)}%

Revenue:
- MRR: $${snapshot.mrr.toLocaleString()}
- ARR: $${arr.toLocaleString()}
- MoM growth: ${(snapshot.revenueGrowthMoM * 100).toFixed(1)}%
- Customers: ${snapshot.customerCount}
- NRR: ${(snapshot.nrr * 100).toFixed(0)}%

Unit Economics:
- Gross margin: ${(snapshot.grossMargin * 100).toFixed(0)}%
- CAC: $${snapshot.cac.toLocaleString()}
- LTV: $${snapshot.ltv.toLocaleString()}
- LTV/CAC: ${ltvCac}×

Headcount: ${snapshot.headcount}
Overdue AR: $${snapshot.overdueAR.toLocaleString()}

RUNWAY SENSITIVITY:
${runway.sensitivityTable.map((s) => `- ${s.lever}: ${s.deltaRunwayMonths > 0 ? "+" : ""}${s.deltaRunwayMonths} months`).join("\n")}

Use this quarter: Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}
Company name: (use "the company" if unknown)`;
}

export async function generateBoardPack(
  snapshot: FinancialSnapshot,
  runway: RunwayAnalysis,
  burn: BurnBreakdown
): Promise<BoardPack> {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: BoardPackSchema,
    prompt: buildBoardPrompt(snapshot, runway, burn),
    maxOutputTokens: 2000,
  });

  return object;
}
