import { NextRequest } from "next/server";
import { runDeepAnalysis, buildOrchestratorContext } from "@/lib/ai/orchestrator";

export async function GET(req: NextRequest) {
  // Only allow server-side or trusted callers; add auth check later
  const authHeader = req.headers.get("authorization");
  const apiKey = process.env.INTERNAL_API_KEY;
  if (apiKey && authHeader !== `Bearer ${apiKey}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const ctx = await buildOrchestratorContext();
    const result = await runDeepAnalysis(ctx);
    return Response.json({
      analysis: result.analysis,
      recommendations: result.recommendations,
      snapshot: {
        cashBalance: result.context.snapshot.cashBalance,
        monthlyBurn: result.context.snapshot.monthlyBurn,
        mrr: result.context.snapshot.mrr,
        runway: result.context.runway.baseRunwayMonths,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    const isApiKeyError = msg.includes("API key") || msg.includes("401");
    return Response.json(
      {
        error: isApiKeyError
          ? "OpenAI API key not configured. Set OPENAI_API_KEY in .env.local"
          : msg,
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
