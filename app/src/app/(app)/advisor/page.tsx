"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot, AlertTriangle } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  "When do I run out of cash?",
  "Can I afford 5 more engineers?",
  "What should I tell my board?",
  "How do I improve NRR to 130%?",
  "What's my CAC payback period?",
  "Should I raise now or extend runway?",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "seed-1",
    role: "user",
    content: "When do I run out of cash?",
  },
  {
    id: "seed-2",
    role: "assistant",
    content:
      "At your current burn of **$287K/month** and **$574K in the bank**, you have **5.8 months of runway** — landing around **August 14, 2026** in the base case.\n\nHere is the breakdown by scenario:\n\n• **Bear** (revenue stalls, over-hiring): **4.0 months** to June 22\n• **Base** (5% MoM growth, 2 hires/mo): **5.8 months** to Aug 14\n• **Bull** (Series A closes June, 8% MoM growth): **8.4+ months** to Nov 2+\n\n**Immediate unlocks to extend runway:**\n1. Collect $94K in overdue AR — +10 days cash\n2. Cut $2,800/mo in identified SaaS spend — +0.5 months\n3. Defer 1 planned hire from Q1 to Q2 — +0.3 months",
  },
];

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const formatted = parts.map((p, j) =>
      j % 2 === 1 ? <strong key={j} style={{ color: "var(--text)" }}>{p}</strong> : p
    );
    if (line.startsWith("•") || line.startsWith("-")) {
      return (
        <div key={i} className="flex gap-2 mt-1">
          <span style={{ color: "var(--accent)" }}>•</span>
          <span>{formatted}</span>
        </div>
      );
    }
    if (/^\d+\./.test(line)) {
      return <div key={i} className="mt-1 ml-2">{formatted}</div>;
    }
    return <div key={i} className={i > 0 ? "mt-1.5" : ""}>{formatted}</div>;
  });
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    setStreamError(null);
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);

    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const raw = decoder.decode(value, { stream: true });
        for (const line of raw.split("\n")) {
          if (line.startsWith('0:"') || line.startsWith("0:'")) {
            try { fullText += (JSON.parse(line.slice(2)) as string); } catch { /* ignore */ }
          } else if (line.startsWith("0:") && line.length > 2) {
            fullText += line.slice(2).replace(/^"|"$/g, "");
          }
        }
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
        );
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Unknown error";
      setStreamError(
        msg.includes("API key") || msg.includes("503")
          ? "OpenAI API key not configured — add OPENAI_API_KEY to .env.local to enable live AI"
          : msg
      );
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsStreaming(false);
    }
  };

  const isFirstLoad = messages.length <= INITIAL_MESSAGES.length;

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]" style={{ maxHeight: "100vh" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4 border-b flex-shrink-0"
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "var(--accent-dim)", border: "1px solid rgba(59,130,246,0.2)" }}
        >
          <Sparkles size={14} style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <h1 className="text-[15px] font-bold" style={{ color: "var(--text)" }}>
            AI Advisor
          </h1>
          <p className="text-[11px]" style={{ color: "var(--text-3)" }}>
            Powered by HelmCFO — Knows your financials
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--green)" }} />
          <span className="text-[11px]" style={{ color: "var(--text-3)" }}>
            Live — Synced 2 min ago
          </span>
        </div>
      </div>

      {/* Error banner */}
      {streamError && (
        <div
          className="mx-6 mt-3 px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-[12px]"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "var(--red)",
          }}
        >
          <AlertTriangle size={13} />
          {streamError}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5" style={{ background: "var(--bg)" }}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--accent-dim)", border: "1px solid rgba(59,130,246,0.2)" }}
              >
                <Bot size={12} style={{ color: "var(--accent)" }} />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                m.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
              }`}
              style={{
                background: m.role === "user" ? "var(--accent)" : "var(--surface)",
                color: m.role === "user" ? "#fff" : "var(--text-2)",
                border: m.role === "assistant" ? "1px solid var(--border)" : undefined,
              }}
            >
              {m.role === "assistant" ? parseMarkdown(m.content) : m.content}
            </div>
            {m.role === "user" && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
              >
                <User size={12} style={{ color: "var(--text-3)" }} />
              </div>
            )}
          </div>
        ))}
        {isStreaming && !messages.at(-1)?.content && (
          <div className="flex gap-3 justify-start">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "var(--accent-dim)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              <Bot size={12} style={{ color: "var(--accent)" }} />
            </div>
            <div
              className="rounded-2xl rounded-bl-sm px-4 py-3"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-1.5 h-5">
                {[0, 150, 300].map((d) => (
                  <div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: "var(--text-3)", animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {isFirstLoad && (
        <div className="px-6 pb-3 flex gap-2 flex-wrap flex-shrink-0" style={{ background: "var(--bg)" }}>
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => void sendMessage(p)}
              className="text-[11px] px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-2)" }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="flex items-center gap-3 px-6 py-4 border-t flex-shrink-0"
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
      >
        <input
          className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          placeholder="Ask about your finances..."
          value={input}
          disabled={isStreaming}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void sendMessage(input);
            }
          }}
        />
        <button
          onClick={() => void sendMessage(input)}
          disabled={!input.trim() || isStreaming}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{ background: "var(--accent)" }}
        >
          <Send size={14} style={{ color: "#fff" }} />
        </button>
      </div>
    </div>
  );
}
