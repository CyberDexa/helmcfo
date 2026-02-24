import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { FinancialSnapshot } from "@/lib/financials";
import { ANALYSIS_SYSTEM } from "./prompts";

// ── SCHEMAS ────────────────────────────────────────────────────────────────────

const RiskSchema = z.object({
  title: z.string(),
  description: z.string(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  estimatedImpact: z.string(),
});

const AnalysisOutputSchema = z.object({
  risks: z.array(RiskSchema),
  opportunities: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      estimatedImpact: z.string(),
      timeToImplement: z.string(),
    })
  ),
  anomalies: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});

export type FinancialAnalysis = z.infer<typeof AnalysisOutputSchema>;

// ── AGENT ──────────────────────────────────────────────────────────────────────

export async function runAnalysisAgent(
  snapshot: FinancialSnapshot
): Promise<FinancialAnalysis> {
  const userMessage = `
Analyse this financial snapshot and return structured findings:

CASH: $${(snapshot.cashBalance / 1000).toFixed(0)}K
BURN: $${(snapshot.monthlyBurn / 1000).toFixed(0)}K/mo
MRR: $${(snapshot.mrr / 1000).toFixed(0)}K (ARR: $${(snapshot.arr / 1000).toFixed(0)}K)
RUNWAY: ${snapshot.runway.toFixed(1)} months
HEADCOUNT: ${snapshot.headcount}
OVERDUE AR: $${(snapshot.overdueAR / 1000).toFixed(0)}K
SOURCES: ${Object.entries(snapshot.sources).filter(([,v]) => v).map(([k]) => k).join(', ') || 'mock data'}

Identify the 3 most critical risks, top 3 opportunities, and any anomalies.
`.trim();

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    system: ANALYSIS_SYSTEM,
    prompt: userMessage,
    schema: AnalysisOutputSchema,
  });

  return object;
}
