"use client";

import { useState } from "react";
import { BookOpen, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight } from "lucide-react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface MrrEvent {
  label: string;
  type: "new" | "expansion" | "contraction" | "churn" | "reactivation";
  amount: number;
}

interface MonthData {
  month: string;
  mrr: number;
  newMrr: number;
  expansionMrr: number;
  contractionMrr: number;
  churnMrr: number;
  reactivation: number;
  deferredRevenue: number;
  recognized: number;
}

interface DeferredSchedule {
  customer: string;
  contract: number;       // total contract value
  term: string;           // e.g. "12-month"
  startDate: string;
  endDate: string;
  recognized: number;     // recognized to date
  remaining: number;      // still deferred
  monthlyAmount: number;  // per month
}

// ── MOCK DATA ─────────────────────────────────────────────────────────────────

const MONTHS: MonthData[] = [
  { month: "Jan",  mrr: 482_000, newMrr: 48_000, expansionMrr: 18_000, contractionMrr: -6_000, churnMrr: -12_000, reactivation: 2_000,  deferredRevenue: 64_000,  recognized: 418_000 },
  { month: "Feb",  mrr: 508_000, newMrr: 42_000, expansionMrr: 22_000, contractionMrr: -5_000, churnMrr: -8_000,  reactivation: 1_500,  deferredRevenue: 61_000,  recognized: 447_000 },
  { month: "Mar",  mrr: 539_000, newMrr: 55_000, expansionMrr: 19_000, contractionMrr: -4_000, churnMrr: -7_000,  reactivation: 3_000,  deferredRevenue: 58_000,  recognized: 481_000 },
  { month: "Apr",  mrr: 571_000, newMrr: 49_000, expansionMrr: 24_000, contractionMrr: -5_000, churnMrr: -11_000, reactivation: 2_500,  deferredRevenue: 72_000,  recognized: 499_000 },
  { month: "May",  mrr: 608_000, newMrr: 61_000, expansionMrr: 28_000, contractionMrr: -3_000, churnMrr: -9_000,  reactivation: 4_000,  deferredRevenue: 68_000,  recognized: 540_000 },
  { month: "Jun",  mrr: 647_000, newMrr: 68_000, expansionMrr: 31_000, contractionMrr: -6_000, churnMrr: -12_000, reactivation: 3_500,  deferredRevenue: 75_000,  recognized: 572_000 },
];

const DEFERRED: DeferredSchedule[] = [
  { customer: "Nexus Corp",       contract: 216_000, term: "12-month",  startDate: "2025-10-01", endDate: "2026-09-30", recognized: 144_000, remaining: 72_000,  monthlyAmount: 18_000 },
  { customer: "Vantage Health",   contract: 132_000, term: "12-month",  startDate: "2026-01-01", endDate: "2026-12-31", recognized: 66_000,  remaining: 66_000,  monthlyAmount: 11_000 },
  { customer: "Orbital Labs",     contract: 288_000, term: "24-month",  startDate: "2025-07-01", endDate: "2027-06-30", recognized: 132_000, remaining: 156_000, monthlyAmount: 12_000 },
  { customer: "Stratum Finance",  contract: 79_200,  term: "12-month",  startDate: "2026-03-01", endDate: "2027-02-28", recognized: 26_400,  remaining: 52_800,  monthlyAmount: 6_600  },
  { customer: "Meridian Studios", contract: 141_600, term: "12-month",  startDate: "2026-02-01", endDate: "2027-01-31", recognized: 58_800,  remaining: 82_800,  monthlyAmount: 11_800 },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function fmt(n: number, abs = false) {
  const v = abs ? Math.abs(n) : n;
  const sign = n < 0 ? "-" : "";
  if (Math.abs(v) >= 1_000_000) return `${sign}$${(Math.abs(v) / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000) return `${sign}$${(Math.abs(v) / 1_000).toFixed(0)}K`;
  return `${sign}$${Math.abs(v)}`;
}

// ── MRR SPARKLINE (SVG) ───────────────────────────────────────────────────────

function MrrLine() {
  const max = Math.max(...MONTHS.map((m) => m.mrr));
  const pts = MONTHS.map((m, i) => {
    const x = 10 + (i / (MONTHS.length - 1)) * 280;
    const y = 60 - (m.mrr / max) * 50;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 300 70" style={{ width: "100%", height: 90 }}>
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" />
      {MONTHS.map((m, i) => {
        const x = 10 + (i / (MONTHS.length - 1)) * 280;
        const y = 60 - (m.mrr / max) * 50;
        return (
          <g key={m.month}>
            <circle cx={x} cy={y} r={3} fill="var(--accent)" />
            <text x={x} y={68} textAnchor="middle" fontSize={8} fill="var(--text-3)" fontFamily="JetBrains Mono,monospace">{m.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── MRR WATERFALL (SVG) ───────────────────────────────────────────────────────

function MrrWaterfall({ month }: { month: MonthData }) {
  const segments = [
    { label: "Opening",            value: month.mrr - month.newMrr - month.expansionMrr - month.contractionMrr - month.churnMrr - month.reactivation, color: "var(--text-3)" },
    { label: "New",                value: month.newMrr,       color: "var(--green)" },
    { label: "Expansion",          value: month.expansionMrr, color: "#06b6d4" },
    { label: "Contraction",        value: month.contractionMrr, color: "var(--amber)" },
    { label: "Churn",              value: month.churnMrr,     color: "var(--red)" },
    { label: "Reactivation",       value: month.reactivation, color: "var(--purple)" },
    { label: "Closing", value: month.mrr, color: "var(--accent)" },
  ];
  const maxAbs = Math.max(...segments.map((s) => Math.abs(s.value)));
  const barH = 14; const gap = 8; const labelW = 90; const chartW = 180;

  return (
    <svg viewBox={`0 0 ${labelW + chartW + 100} ${segments.length * (barH + gap) + 10}`} style={{ width: "100%", height: 200 }}>
      {segments.map((s, i) => {
        const y = i * (barH + gap) + 4;
        const w = (Math.abs(s.value) / maxAbs) * chartW;
        const x = s.value < 0 ? labelW + chartW / 2 - w : labelW + chartW / 2;
        return (
          <g key={s.label}>
            <text x={labelW - 6} y={y + barH - 3} textAnchor="end" fontSize={9.5} fill="var(--text-3)" fontFamily="Outfit, sans-serif">{s.label}</text>
            <rect x={x} y={y} width={Math.max(w, 2)} height={barH} rx={3} fill={s.color} opacity={s.value === 0 ? 0.2 : 0.9} />
            <text x={x + (s.value >= 0 ? w + 4 : -4)} y={y + barH - 3} textAnchor={s.value >= 0 ? "start" : "end"} fontSize={9} fill="var(--text-2)" fontFamily="JetBrains Mono, monospace">
              {fmt(s.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

type Tab = "mrr" | "deferred" | "saas-metrics";

export default function RevenuePage() {
  const [tab, setTab] = useState<Tab>("mrr");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS.length - 1);

  const latest = MONTHS[MONTHS.length - 1];
  const prev = MONTHS[MONTHS.length - 2];
  const growth = ((latest.mrr - prev.mrr) / prev.mrr) * 100;
  const arr = latest.mrr * 12;
  const netMrr = latest.newMrr + latest.expansionMrr + latest.contractionMrr + latest.churnMrr + latest.reactivation;
  const totalDeferred = DEFERRED.reduce((s, d) => s + d.remaining, 0);

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <BookOpen size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, fontWeight: 400 }}>Revenue Recognition</h1>
        </div>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>
          MRR/ARR waterfall, deferred revenue schedule, and SaaS revenue metrics (ASC 606-ready)
        </p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "ARR", value: fmt(arr), sub: `$${(arr / 1_000_000).toFixed(2)}M run-rate`, color: "var(--accent)" },
          { label: "MRR (Jun)", value: fmt(latest.mrr), sub: `+${growth.toFixed(1)}% MoM`, color: "var(--green)" },
          { label: "Net New MRR", value: fmt(netMrr), sub: `New + exp − churn`, color: netMrr > 0 ? "var(--green)" : "var(--red)" },
          { label: "Deferred Revenue", value: fmt(totalDeferred), sub: "To be recognized", color: "var(--purple)" },
          { label: "MRR Growth Rate", value: `${growth.toFixed(1)}%`, sub: `Mo. vs Jun target: 5%`, color: growth >= 5 ? "var(--green)" : "var(--amber)" },
        ].map((k) => (
          <div key={k.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 26, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, padding: 4, background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)", width: "fit-content" }}>
        {([["mrr", "MRR Waterfall"], ["deferred", "Deferred Revenue"], ["saas-metrics", "SaaS Metrics"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "7px 20px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
            background: tab === key ? "var(--surface-3)" : "transparent",
            color: tab === key ? "var(--text)" : "var(--text-3)",
          }}>{label}</button>
        ))}
      </div>

      {/* MRR WATERFALL TAB */}
      {tab === "mrr" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>MRR Trend (Jan–Jun 2026)</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 12 }}>Monthly recurring revenue</div>
            <MrrLine />
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>MRR Waterfall</div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface-3)", color: "var(--text)", fontFamily: "inherit", cursor: "pointer" }}
              >
                {MONTHS.map((m, i) => <option key={m.month} value={i}>{m.month} 2026</option>)}
              </select>
            </div>
            <MrrWaterfall month={MONTHS[selectedMonth]} />
          </div>

          {/* Monthly breakdown table */}
          <div style={{ gridColumn: "span 2", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 600 }}>Monthly MRR Breakdown</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Month", "MRR", "+ New", "+ Expansion", "− Contraction", "− Churn", "+ Reactiv.", "Net New", "Recognized"].map((h, i) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: i === 0 ? "left" : "right", fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.7px", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTHS.map((m, i) => {
                  const netNew = m.newMrr + m.expansionMrr + m.contractionMrr + m.churnMrr + m.reactivation;
                  const prev = i > 0 ? MONTHS[i - 1] : null;
                  const growPct = prev ? ((m.mrr - prev.mrr) / prev.mrr * 100) : null;
                  return (
                    <tr key={m.month} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 500 }}>{m.month} 2026</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>
                        {fmt(m.mrr)}
                        {growPct !== null && <span style={{ fontSize: 10, color: growPct >= 0 ? "var(--green)" : "var(--red)", marginLeft: 5 }}>{growPct >= 0 ? "+" : ""}{growPct.toFixed(1)}%</span>}
                      </td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--green)" }}>+{fmt(m.newMrr)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#06b6d4" }}>+{fmt(m.expansionMrr)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--amber)" }}>{fmt(m.contractionMrr)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--red)" }}>{fmt(m.churnMrr)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--purple)" }}>+{fmt(m.reactivation)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: netNew >= 0 ? "var(--green)" : "var(--red)", fontWeight: 600 }}>{netNew >= 0 ? "+" : ""}{fmt(netNew)}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--text-2)" }}>{fmt(m.recognized)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DEFERRED REVENUE TAB */}
      {tab === "deferred" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Deferred Revenue Schedule</span>
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>Total deferred: <strong style={{ color: "var(--purple)" }}>{fmt(totalDeferred)}</strong></span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Customer", "Contract", "Term", "Start", "End", "Recognized", "Remaining", "/mo", "Progress"].map((h, i) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: i <= 2 ? "left" : "right", fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.7px", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEFERRED.map((d) => {
                const recPct = (d.recognized / d.contract) * 100;
                return (
                  <tr key={d.customer} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>{d.customer}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{fmt(d.contract)}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-2)" }}>{d.term}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, color: "var(--text-2)" }}>{d.startDate}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, color: "var(--text-2)" }}>{d.endDate}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--green)" }}>{fmt(d.recognized)}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--purple)" }}>{fmt(d.remaining)}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{fmt(d.monthlyAmount)}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                        <div style={{ width: 80, height: 6, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${recPct}%`, height: "100%", background: "var(--accent)", borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono,monospace", color: "var(--text-3)", minWidth: 36 }}>{recPct.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* SAAS METRICS TAB */}
      {tab === "saas-metrics" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "Gross Revenue Churn", value: "1.8%", sub: "Monthly · target <2%", color: "var(--green)", note: "Excellent — best-in-class SaaS is <1.5%/mo. To improve, focus on onboarding touch for months 2–4." },
            { label: "Net Revenue Retention", value: "131%", sub: "NRR — includes expansion", color: "var(--green)", note: ">120% NRR is a strong signal for investors. Driven by expansion in Q2 cohorts." },
            { label: "Quick Ratio", value: "3.8x", sub: "(new+exp) / (churn+contr)", color: "var(--accent)", note: ">3x quick ratio means you're growing faster than you're churning. Target is >4x for Series B." },
            { label: "New MRR vs Churned", value: "+$53K net", sub: "Jun 2026", color: "var(--green)", note: "Healthy. Every dollar of churn is being replaced by 5.7x new revenue." },
            { label: "Expansion MRR %", value: "4.8%", sub: "% of opening MRR", color: "var(--purple)", note: "Above benchmark of 3%. Upsell motions working well in enterprise segment." },
            { label: "Avg Contract Value (ACV)", value: "$11,760", sub: "Annual per customer", color: "var(--amber)", note: "ACV is growing +14% YoY. Consider a $25K+ enterprise tier to improve unit economics." },
          ].map((m) => (
            <div key={m.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 22 }}>
              <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 32, color: m.color, lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 12 }}>{m.sub}</div>
              <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6, padding: "10px 12px", background: "var(--surface-3)", borderRadius: 8 }}>{m.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
