"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { FileText, Download, Sparkles, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cashflowHistory } from "@/lib/data";
import type { BoardPack } from "@/lib/ai/board-report-agent";

const kpiCards = [
  { label: "ARR", value: "$3.25M", change: "+22%", up: true, note: "vs $2.66M prior quarter" },
  { label: "MRR", value: "$271K", change: "+8.4%", up: true, note: "vs $250K last month" },
  { label: "Net Revenue Retention", value: "118%", change: "+6pp", up: true, note: "expansion > churn" },
  { label: "Gross Margin", value: "71%", change: "+2pp", up: true, note: "COGS optimised" },
  { label: "CAC", value: "$4,200", change: "-12%", up: true, note: "lower blended CPL" },
  { label: "LTV / CAC", value: "7.1×", change: "+0.4×", up: true, note: "improving unit economics" },
  { label: "Active Customers", value: "87", change: "+11", up: true, note: "net new this quarter" },
  { label: "Cash Runway", value: "5.8 mo", change: "-0.4 mo", up: false, note: "vs 6.2 mo last month" },
];

const mrrHistory = cashflowHistory.map((m) => ({
  month: m.month,
  mrr: m.revenue,
  burn: m.burn,
}));

const SECTIONS: Array<keyof Pick<BoardPack, "executiveSummary" | "financialPosition" | "growthMetrics" | "unitEconomics" | "keyRisks" | "asksAndNextSteps">> = [
  "executiveSummary",
  "financialPosition",
  "growthMetrics",
  "unitEconomics",
  "keyRisks",
  "asksAndNextSteps",
];

const SECTION_LABELS: Record<string, string> = {
  executiveSummary: "Executive Summary",
  financialPosition: "Financial Position",
  growthMetrics: "Growth Metrics",
  unitEconomics: "Unit Economics",
  keyRisks: "Key Risks & Mitigations",
  asksAndNextSteps: "Asks & Next Steps",
};

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [boardPack, setBoardPack] = useState<BoardPack | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/board-report", { method: "POST" });
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const pack = await res.json() as BoardPack;
      setBoardPack(pack);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate board pack");
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = () => {
    if (!boardPack) return;
    const lines = [
      `# Board Pack — ${boardPack.quarter}`,
      `**${boardPack.companyName}**\n`,
      ...SECTIONS.map((s) => `## ${SECTION_LABELS[s]}\n\n${boardPack[s]}\n`),
      boardPack.dataCaveats.length > 0
        ? `## Data Caveats\n${boardPack.dataCaveats.map((c) => `- ${c}`).join("\n")}`
        : "",
    ].join("\n");
    const blob = new Blob([lines], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `board-pack-${boardPack.quarter.replace(/\s/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Board Reports</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>Investor-ready pack · AI-drafted narrative · One-click export</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-60"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <Sparkles size={14} />
            {generating ? "Generating…" : "Generate Board Pack"}
          </button>
          {boardPack && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              <Download size={14} />
              Export Markdown
            </button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-3">
        {kpiCards.map((k) => (
          <div key={k.label} className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--text-3)" }}>{k.label}</p>
            <p className="text-xl font-bold font-mono" style={{ color: "var(--text)" }}>{k.value}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              {k.up ? <TrendingUp size={10} style={{ color: "var(--green)" }} /> : <TrendingDown size={10} style={{ color: "var(--red)" }} />}
              <span className="text-[11px] font-semibold" style={{ color: k.up ? "var(--green)" : "var(--red)" }}>{k.change}</span>
              <span className="text-[11px]" style={{ color: "var(--text-3)" }}>{k.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text)" }}>MRR Trend</h2>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={mrrHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,186,0.07)" />
              <XAxis dataKey="month" tick={{ fill: "#4f5b72", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => formatCurrency(v, { compact: true })} tick={{ fill: "#4f5b72", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number | undefined) => [v != null ? formatCurrency(v, { compact: true }) : "—"]} contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="mrr" name="MRR" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text)" }}>Burn Rate</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={mrrHistory} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,186,0.07)" />
              <XAxis dataKey="month" tick={{ fill: "#4f5b72", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => formatCurrency(v, { compact: true })} tick={{ fill: "#4f5b72", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number | undefined) => [v != null ? formatCurrency(v, { compact: true }) : "—"]} contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Bar dataKey="burn" name="Net burn" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Board Pack */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
          <FileText size={14} style={{ color: "var(--accent)" }} />
          <div>
            <h2 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>AI Board Narrative</h2>
            <p className="text-[11px]" style={{ color: "var(--text-3)" }}>
              {boardPack ? `${boardPack.quarter} · ${boardPack.companyName} · Confidence ${boardPack.confidenceScore}%` : "AI-generated from live financial data"}
            </p>
          </div>
          {!boardPack && !generating && (
            <div className="ml-auto flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-lg" style={{ background: "var(--surface-2)", color: "var(--text-3)" }}>
              <Sparkles size={10} style={{ color: "var(--accent)" }} />
              Click "Generate Board Pack" to draft
            </div>
          )}
        </div>

        {boardPack ? (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {SECTIONS.map((s) => (
              <div key={s} className="px-6 py-5">
                <h3 className="text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--accent)" }}>{SECTION_LABELS[s]}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>{boardPack[s]}</p>
              </div>
            ))}
            {boardPack.dataCaveats.length > 0 && (
              <div className="px-6 py-4">
                <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-3)" }}>Data Caveats</h3>
                <ul className="space-y-1">
                  {boardPack.dataCaveats.map((c, i) => (
                    <li key={i} className="text-[12px] flex items-start gap-2" style={{ color: "var(--text-3)" }}>
                      <span style={{ color: "var(--accent)" }}>›</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            {generating ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--accent)", animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--accent)", animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--accent)", animationDelay: "300ms" }} />
                </div>
                <p className="text-[13px]" style={{ color: "var(--text-3)" }}>Analysing financials and drafting narrative…</p>
              </div>
            ) : (
              <div>
                <FileText size={32} className="mx-auto mb-3 opacity-20" style={{ color: "var(--text-3)" }} />
                <p className="text-[13px]" style={{ color: "var(--text-3)" }}>Generate your board pack to see the AI-drafted narrative.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
