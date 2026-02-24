import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { FinancialAnalysis } from "./analysis-agent";
import type { RunwayAnalysis } from "@/lib/engine/types";
import { RECOMMENDATION_SYSTEM } from "./prompts";

// ── SCHEMAS ────────────────────────────────────────────────────────────────────

const RecommendationOutputSchema = z.object({
  thisWeek: z.array(z.string()),
  thisMonth: z.array(z.string()),
  thisQuarter: z.array(z.string()),
  seriesAReadiness: z.object({
    score: z.number().min(0).max(100),
    gaps: z.array(z.string()),
  }),
});

export type Recommendations = z.infer<typeof RecommendationOutputSchema>;

// ── AGENT ──────────────────────────────────────────────────────────────────────

export async function runRecommendationAgent(
  analysis: FinancialAnalysis,
  runway: RunwayAnalysis
): Promise<Recommendations> {
  const userMessage = `
Given this financial analysis, produce a prioritised action plan:

RUNWAY: ${runway.baseRunwayMonths.toFixed(1)} months (cash out: ${runway.baseRunoutDate})
ZONE: ${runway.baseRunwayMonths < 3 ? 'CRITICAL' : runway.baseRunwayMonths < 6 ? 'WARNING' : runway.baseRunwayMonths < 12 ? 'COMFORTABLE' : 'HEALTHY'}

TOP RISKS:
${analysis.risks
  .slice(0, 3)
  .map((r) => `- [${r.severity.toUpperCase()}] ${r.title}: ${r.description}`)
  .join("\n")}

TOP OPPORTUNITIES:
${analysis.opportunities
  .slice(0, 3)
  .map((o) => `- ${o.title}: ${o.description} (impact: ${o.estimatedImpact})`)
  .join("\n")}

ANOMALIES:
${analysis.anomalies.map((a) => `- ${a.title}: ${a.description}`).join("\n") || "None detected"}

Generate specific, actionable items grouped by time horizon.
`.trim();

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    system: RECOMMENDATION_SYSTEM,
    prompt: userMessage,
    schema: RecommendationOutputSchema,
  });

  return object;
}
