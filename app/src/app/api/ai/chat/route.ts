import { NextRequest } from "next/server";
import { orchestrateChat, buildOrchestratorContext, type Message } from "@/lib/ai/orchestrator";

// Rate limit: max 20 messages per minute per IP (in-memory, resets on restart)
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  let messages: Message[];
  try {
    const body = await req.json() as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error("messages must be an array");
    // Validate shape and strip anything unexpected
    messages = (body.messages as Array<{ role?: unknown; content?: unknown }>)
      .filter((m) => typeof m.role === "string" && typeof m.content === "string")
      .map((m) => ({ role: m.role as Message["role"], content: m.content as string }))
      .filter((m) => ["user", "assistant"].includes(m.role))
      .slice(-20); // cap context window
    if (messages.length === 0) throw new Error("No valid messages");
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const ctx = await buildOrchestratorContext();
    const result = await orchestrateChat(messages, ctx);
    return result.toTextStreamResponse();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    const isApiKeyError = msg.includes("API key") || msg.includes("401");
    return new Response(
      JSON.stringify({
        error: isApiKeyError
          ? "OpenAI API key not configured. Set OPENAI_API_KEY in .env.local"
          : msg,
      }),
      { status: isApiKeyError ? 503 : 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
