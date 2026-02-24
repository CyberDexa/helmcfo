import { streamText, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { buildFinancialSnapshot, type FinancialSnapshot } from "@/lib/financials";
import { runEngine } from "@/lib/engine";
import { buildSystemPrompt, INTENT_CLASSIFIER_SYSTEM } from "./prompts";
import { runAnalysisAgent } from "./analysis-agent";
import { runRecommendationAgent } from "./recommendation-agent";
import type { RunwayAnalysis, BurnBreakdown, ScenarioProjection } from "@/lib/engine/types";

// ── TYPES ──────────────────────────────────────────────────────────────────────

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface OrchestratorContext {
  snapshot: FinancialSnapshot;
  runway: RunwayAnalysis;
  burn: BurnBreakdown;
  scenarios: Record<string, ScenarioProjection>;
}

// ── CONTEXT BUILDER ────────────────────────────────────────────────────────────

let cachedCtx: { ctx: OrchestratorContext; ts: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function buildOrchestratorContext(): Promise<OrchestratorContext> {
  if (cachedCtx && Date.now() - cachedCtx.ts < CACHE_TTL_MS) {
    return cachedCtx.ctx;
  }

  // Build snapshot (falls back to mock data if no real credentials)
  const snapshot = await buildFinancialSnapshot({} as never);

  // Run deterministic engine
  const { scenarios, burnBreakdown, runwayAnalysis } = runEngine({
    cashBalance: snapshot.cashBalance,
    monthlyBurn: snapshot.monthlyBurn,
    monthlyRevenue: snapshot.mrr,
    headcount: snapshot.headcount,
    avgFullyLoadedSalary: 160_000,
    overdueAR: snapshot.overdueAR,
  });

  const ctx: OrchestratorContext = {
    snapshot,
    runway: runwayAnalysis,
    burn: burnBreakdown,
    scenarios,
  };
  cachedCtx = { ctx, ts: Date.now() };
  return ctx;
}

// ── INTENT CLASSIFIER ──────────────────────────────────────────────────────────

async function classifyIntent(userMessage: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: INTENT_CLASSIFIER_SYSTEM,
    prompt: userMessage,
    maxOutputTokens: 20,
  });
  return text.trim().toLowerCase();
}

// ── MAIN ORCHESTRATOR: STREAMING CHAT ─────────────────────────────────────────

export async function orchestrateChat(
  messages: Message[],
  context?: OrchestratorContext
): Promise<ReturnType<typeof streamText>> {
  const ctx = context ?? (await buildOrchestratorContext());
  const systemPrompt = buildSystemPrompt(ctx.snapshot, ctx.runway, ctx.burn, ctx.scenarios);

  return streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
    maxOutputTokens: 1024,
    temperature: 0.3, // Lower temperature for financial precision
  });
}

// ── DEEP ANALYSIS (non-streaming, used for AI Insights panel) ─────────────────

export async function runDeepAnalysis(context?: OrchestratorContext) {
  const ctx = context ?? (await buildOrchestratorContext());
  const [analysis] = await Promise.all([runAnalysisAgent(ctx.snapshot)]);
  const recommendations = await runRecommendationAgent(analysis, ctx.runway);
  return { analysis, recommendations, context: ctx };
}

// ── INTENT-AWARE SINGLE QUESTION (non-streaming) ─────────────────────────────

export async function askQuestion(
  question: string,
  context?: OrchestratorContext
): Promise<string> {
  const ctx = context ?? (await buildOrchestratorContext());
  const intent = await classifyIntent(question);
  const systemPrompt = buildSystemPrompt(ctx.snapshot, ctx.runway, ctx.burn, ctx.scenarios);

  // Intent-specific context injection
  let additionalContext = "";
  if (intent === "scenario") {
    const scenarioLines = Object.entries(ctx.scenarios)
      .map(([k, s]) => `${k}: ${s.runwayMonths.toFixed(1)} mo, end cash $${(((s.months[s.months.length - 1]?.closingCash) ?? 0) / 1000).toFixed(0)}K`)
      .join("\n");
    additionalContext = `\n\nScenario details:\n${scenarioLines}`;
  } else if (intent === "runway") {
    additionalContext = `\n\nTop sensitivity levers:\n${ctx.runway.sensitivityTable
      .slice(0, 5)
      .map((l) => `• ${l.lever}: +${l.deltaRunwayMonths.toFixed(1)} months`)
      .join("\n")}`;
  } else if (intent === "expense_cut") {
    additionalContext = `\n\nTop burn categories:\n${ctx.burn.categories
      .slice(0, 5)
      .map((c: { label: string; monthlyAmount: number; trend: string }) => `• ${c.label}: $${(c.monthlyAmount / 1000).toFixed(0)}K/mo (${c.trend})`)
      .join("\n")}`;
  }

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: systemPrompt + additionalContext,
    prompt: question,
    maxOutputTokens: 800,
    temperature: 0.3,
  });

  return text;
}
