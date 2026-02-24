"use client";

import { useState } from "react";
import {
  Target, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight,
  AlertTriangle, CheckCircle, Info,
} from "lucide-react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface BudgetLine {
  id: string;
  label: string;
  budget: number;
  actual: number;
  prior: number; // same period last year
  children?: BudgetLine[];
}

type ViewMode = "month" | "ytd";
type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

// ── MOCK DATA ─────────────────────────────────────────────────────────────────

const MONTHS: Month[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Monthly budget vs actual for sparkline (revenue)
const MONTHLY_SERIES: Record<Month, { budget: number; actual: number }> = {
  Jan: { budget: 280_000, actual: 295_000 },
  Feb: { budget: 310_000, actual: 318_000 },
  Mar: { budget: 340_000, actual: 322_000 },
  Apr: { budget: 370_000, actual: 381_000 },
  May: { budget: 400_000, actual: 412_000 },
  Jun: { budget: 430_000, actual: 428_000 },
  Jul: { budget: 460_000, actual: 471_000 },
  Aug: { budget: 490_000, actual: 503_000 },
  Sep: { budget: 520_000, actual: 518_000 },
  Oct: { budget: 550_000, actual: 0 },   // future
  Nov: { budget: 590_000, actual: 0 },
  Dec: { budget: 630_000, actual: 0 },
};

const INCOME_LINES: BudgetLine[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    budget: 3_980_000,
    actual: 3_648_000,
    prior: 2_810_000,
    children: [
      { id: "subscription", label: "Subscription Revenue", budget: 3_520_000, actual: 3_290_000, prior: 2_420_000 },
      { id: "services", label: "Professional Services", budget: 320_000, actual: 278_000, prior: 290_000 },
      { id: "other-rev", label: "Other Revenue", budget: 140_000, actual: 80_000, prior: 100_000 },
    ],
  },
];

const EXPENSE_LINES: BudgetLine[] = [
  {
    id: "cogs",
    label: "Cost of Revenue",
    budget: 940_000,
    actual: 1_022_000,
    prior: 740_000,
    children: [
      { id: "hosting", label: "Cloud Hosting", budget: 480_000, actual: 561_000, prior: 380_000 },
      { id: "support-cogs", label: "Customer Support", budget: 320_000, actual: 308_000, prior: 248_000 },
      { id: "third-party", label: "Third-party APIs", budget: 140_000, actual: 153_000, prior: 112_000 },
    ],
  },
  {
    id: "opex",
    label: "Operating Expenses",
    budget: 2_680_000,
    actual: 2_590_000,
    prior: 2_100_000,
    children: [
      {
        id: "personnel",
        label: "Personnel & Payroll",
        budget: 1_840_000,
        actual: 1_780_000,
        prior: 1_440_000,
        children: [
          { id: "engineering", label: "Engineering", budget: 980_000, actual: 960_000, prior: 740_000 },
          { id: "sales-pay", label: "Sales & Marketing", budget: 520_000, actual: 498_000, prior: 420_000 },
          { id: "ga-pay", label: "G&A", budget: 340_000, actual: 322_000, prior: 280_000 },
        ],
      },
      { id: "marketing", label: "Marketing Programs", budget: 380_000, actual: 412_000, prior: 280_000 },
      { id: "saas-tools", label: "SaaS & Tools", budget: 186_000, actual: 201_000, prior: 168_000 },
      { id: "travel", label: "T&E", budget: 120_000, actual: 88_000, prior: 104_000 },
      { id: "facilities", label: "Facilities", budget: 154_000, actual: 109_000, prior: 108_000 },
    ],
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function variance(budget: number, actual: number, isExpense = false) {
  const diff = actual - budget;
  const pct = budget !== 0 ? (diff / Math.abs(budget)) * 100 : 0;
  // For expenses: over budget = bad (negative); for revenue: under budget = bad
  const favorable = isExpense ? diff <= 0 : diff >= 0;
  return { diff, pct, favorable };
}

function VarianceBadge({ v }: { v: ReturnType<typeof variance> }) {
  const color = v.favorable ? "var(--green)" : "var(--red)";
  const bg = v.favorable ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)";
  const Icon = v.favorable ? TrendingUp : TrendingDown;
  if (v.diff === 0) return <span style={{ fontSize: 11, color: "var(--text-3)" }}>—</span>;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, padding: "2px 7px", borderRadius: 6, background: bg, color, fontFamily: "JetBrains Mono, monospace" }}>
      <Icon size={10} />
      {v.diff > 0 ? "+" : ""}{fmt(v.diff)} ({v.pct > 0 ? "+" : ""}{v.pct.toFixed(1)}%)
    </span>
  );
}

// ── BUDGET ROW ────────────────────────────────────────────────────────────────

function BudgetRow({ line, depth = 0, isExpense = false }: { line: BudgetLine; depth?: number; isExpense?: boolean }) {
  const [open, setOpen] = useState(depth === 0);
  const v = variance(line.budget, line.actual, isExpense);
  const hasChildren = !!line.children?.length;

  return (
    <>
      <tr
        onClick={() => hasChildren && setOpen((o) => !o)}
        style={{
          cursor: hasChildren ? "pointer" : "default",
          background: depth === 0 ? "var(--surface-2)" : "transparent",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <td style={{ padding: "11px 16px", paddingLeft: depth === 0 ? 16 : depth === 1 ? 36 : 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {hasChildren ? (
              open ? <ChevronDown size={13} color="var(--text-3)" /> : <ChevronRight size={13} color="var(--text-3)" />
            ) : (
              <span style={{ width: 13 }} />
            )}
            <span style={{ fontSize: depth === 0 ? 13 : 12, fontWeight: depth === 0 ? 600 : 400, color: depth === 0 ? "var(--text)" : "var(--text-2)" }}>
              {line.label}
            </span>
          </div>
        </td>
        <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--text)" }}>{fmt(line.budget)}</td>
        <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: line.actual === 0 ? "var(--text-3)" : "var(--text)" }}>
          {line.actual === 0 ? "—" : fmt(line.actual)}
        </td>
        <td style={{ padding: "11px 16px", textAlign: "right" }}>
          {line.actual > 0 && <VarianceBadge v={v} />}
        </td>
        <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--text-3)" }}>{fmt(line.prior)}</td>
        <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 11, color: "var(--text-3)", fontFamily: "JetBrains Mono, monospace" }}>
          {line.prior > 0 ? `${(((line.actual || line.budget) - line.prior) / line.prior * 100).toFixed(0)}%` : "—"}
        </td>
      </tr>
      {open && line.children?.map((child) => (
        <BudgetRow key={child.id} line={child} depth={depth + 1} isExpense={isExpense} />
      ))}
    </>
  );
}

// ── MINI SPARKLINE (SVG) ──────────────────────────────────────────────────────

function Sparkline() {
  const entries = MONTHS.slice(0, 9).map((m) => MONTHLY_SERIES[m]);
  const maxVal = Math.max(...entries.map((e) => Math.max(e.budget, e.actual)));
  const w = 320; const h = 60; const pad = 4;
  const x = (i: number) => pad + (i / (entries.length - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v / maxVal) * (h - pad * 2));

  const budgetPath = entries.map((e, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(e.budget)}`).join(" ");
  const actualPath = entries.map((e, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(e.actual)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 60 }}>
      <path d={budgetPath} fill="none" stroke="rgba(59,130,246,0.4)" strokeWidth={1.5} strokeDasharray="4 3" />
      <path d={actualPath} fill="none" stroke="var(--accent)" strokeWidth={2} />
      {entries.map((e, i) => (
        <circle key={i} cx={x(i)} cy={y(e.actual)} r={3} fill="var(--accent)" />
      ))}
    </svg>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

const CURRENT_MONTH = 9; // Sep (0-indexed)

export default function BudgetPage() {
  const [view, setView] = useState<ViewMode>("ytd");

  const ytdBudgetRev = Object.values(MONTHLY_SERIES).slice(0, CURRENT_MONTH).reduce((s, m) => s + m.budget, 0);
  const ytdActualRev = Object.values(MONTHLY_SERIES).slice(0, CURRENT_MONTH).reduce((s, m) => s + m.actual, 0);
  const revVar = variance(ytdBudgetRev, ytdActualRev, false);

  const alerts = [
    { type: "warn" as const, msg: "Cloud hosting $81K over budget YTD (+17%). Run-rate implies $108K overage by year-end." },
    { type: "warn" as const, msg: "Marketing programs exceeded budget by $32K. Last 3 months consistently over." },
    { type: "ok" as const,   msg: "T&E is $32K under budget — $35K can be reallocated to Q4 growth initiatives." },
    { type: "ok" as const,   msg: "Facilities $45K under budget due to lease renegotiation savings." },
    { type: "info" as const, msg: "Professional Services revenue tracking $42K below budget. Two late-stage deals at risk." },
  ];

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Target size={20} color="var(--accent)" />
            <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, fontWeight: 400 }}>
              Budget vs. Actuals
            </h1>
          </div>
          <p style={{ color: "var(--text-2)", fontSize: 14 }}>
            FY 2026 · January – September (9 months YTD) · AI-explained variances
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["month", "ytd"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "7px 16px", borderRadius: 9, border: "1px solid",
                borderColor: view === v ? "var(--accent)" : "var(--border)",
                background: view === v ? "rgba(59,130,246,0.12)" : "transparent",
                color: view === v ? "var(--accent)" : "var(--text-2)",
                fontSize: 13, cursor: "pointer",
              }}
            >
              {v === "month" ? "This Month" : "YTD"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Revenue (YTD)", budget: ytdBudgetRev, actual: ytdActualRev, isExpense: false },
          { label: "Total OpEx (YTD)", budget: 2_680_000 * (9 / 12), actual: 2_590_000 * (9 / 12), isExpense: true },
          { label: "Gross Profit (YTD)", budget: ytdBudgetRev - 940_000 * (9 / 12), actual: ytdActualRev - 1_022_000 * (9 / 12), isExpense: false },
          { label: "EBITDA (YTD)", budget: -(340_000 * (9 / 12)), actual: -(290_000 * (9 / 12)), isExpense: false },
        ].map((k) => {
          const v = variance(k.budget, k.actual, k.isExpense);
          return (
            <div key={k.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 24, color: "var(--text)", lineHeight: 1 }}>{fmt(k.actual)}</div>
              <div style={{ marginTop: 6 }}><VarianceBadge v={v} /></div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 4 }}>Budget: {fmt(k.budget)}</div>
            </div>
          );
        })}
      </div>

      {/* Revenue Sparkline */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Revenue: Budget vs. Actual (Jan–Sep)</div>
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--text-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 16, height: 2, background: "var(--accent)", display: "inline-block", borderRadius: 99 }} /> Actual
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 16, height: 2, background: "rgba(59,130,246,0.4)", display: "inline-block", borderRadius: 99, borderTop: "1px dashed rgba(59,130,246,0.4)" }} /> Budget
            </span>
          </div>
        </div>
        <Sparkline />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0 0", fontSize: 10, color: "var(--text-3)", fontFamily: "JetBrains Mono, monospace" }}>
          {MONTHS.slice(0, 9).map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>

      {/* AI Alerts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {alerts.map((a, i) => {
          const Icon = a.type === "ok" ? CheckCircle : a.type === "warn" ? AlertTriangle : Info;
          const color = a.type === "ok" ? "var(--green)" : a.type === "warn" ? "var(--amber)" : "var(--accent)";
          const bg = a.type === "ok" ? "rgba(16,185,129,0.06)" : a.type === "warn" ? "rgba(245,158,11,0.06)" : "rgba(59,130,246,0.06)";
          const border = a.type === "ok" ? "rgba(16,185,129,0.2)" : a.type === "warn" ? "rgba(245,158,11,0.2)" : "rgba(59,130,246,0.2)";
          return (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 16px", borderRadius: 10, background: bg, border: `1px solid ${border}` }}>
              <Icon size={14} color={color} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{a.msg}</span>
            </div>
          );
        })}
      </div>

      {/* P&L Table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Account", "Budget", "Actual", "Variance", "Prior Year", "YoY Δ"].map((h, i) => (
                <th key={h} style={{
                  padding: "10px 16px", textAlign: i === 0 ? "left" : "right",
                  fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              <td colSpan={6} style={{ padding: "8px 16px", fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "1px", background: "var(--bg)", fontFamily: "JetBrains Mono, monospace" }}>
                Revenue
              </td>
            </tr>
            {INCOME_LINES.map((line) => <BudgetRow key={line.id} line={line} isExpense={false} />)}
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              <td colSpan={6} style={{ padding: "8px 16px", fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "1px", background: "var(--bg)", fontFamily: "JetBrains Mono, monospace" }}>
                Expenses
              </td>
            </tr>
            {EXPENSE_LINES.map((line) => <BudgetRow key={line.id} line={line} isExpense={true} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
