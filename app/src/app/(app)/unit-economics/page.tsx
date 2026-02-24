"use client";

import { useState } from "react";
import { BarChart2, TrendingUp, Users, ShoppingCart, ArrowRight, Info } from "lucide-react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface Cohort {
  label: string;      // e.g. "Q1 2025"
  customers: number;
  cac: number;        // total acquisition cost
  ltv: number;        // lifetime value (projected)
  grossMarginPct: number;
  paybackMonths: number;
  nrr: number;        // net revenue retention %
  churnPct: number;
  arpu: number;       // avg revenue per user/mo
  channel: "organic" | "paid" | "partner" | "referral";
}

// ── MOCK DATA ─────────────────────────────────────────────────────────────────

const COHORTS: Cohort[] = [
  { label: "Q1 2025", customers: 18, cac: 8_400,  ltv: 52_000, grossMarginPct: 71, paybackMonths: 14, nrr: 112, churnPct: 2.1, arpu: 820,  channel: "partner" },
  { label: "Q2 2025", customers: 24, cac: 7_200,  ltv: 58_000, grossMarginPct: 73, paybackMonths: 12, nrr: 118, churnPct: 1.8, arpu: 890,  channel: "paid" },
  { label: "Q3 2025", customers: 31, cac: 6_800,  ltv: 61_000, grossMarginPct: 74, paybackMonths: 11, nrr: 121, churnPct: 1.5, arpu: 940,  channel: "organic" },
  { label: "Q4 2025", customers: 42, cac: 6_100,  ltv: 67_000, grossMarginPct: 76, paybackMonths: 10, nrr: 126, churnPct: 1.2, arpu: 980,  channel: "referral" },
  { label: "Q1 2026", customers: 55, cac: 5_600,  ltv: 71_000, grossMarginPct: 77, paybackMonths: 9,  nrr: 128, churnPct: 1.1, arpu: 1020, channel: "organic" },
  { label: "Q2 2026", customers: 68, cac: 5_200,  ltv: 74_000, grossMarginPct: 78, paybackMonths: 9,  nrr: 131, churnPct: 0.9, arpu: 1050, channel: "paid" },
];

const CHANNEL_COLOR: Record<Cohort["channel"], string> = {
  organic:  "#10b981",
  paid:     "#3b82f6",
  partner:  "#8b5cf6",
  referral: "#f59e0b",
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

function pct(n: number, decimals = 1) { return `${n.toFixed(decimals)}%`; }

function ltvCacRatio(ltv: number, cac: number) {
  const ratio = ltv / cac;
  const color = ratio >= 3 ? "var(--green)" : ratio >= 2 ? "var(--amber)" : "var(--red)";
  return { ratio, color };
}

// ── MINI BAR CHART ────────────────────────────────────────────────────────────

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
      <div style={{ flex: 1, height: 6, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 99 }} />
      </div>
    </div>
  );
}

// ── LTV/CAC CHART (SVG) ───────────────────────────────────────────────────────

function LtvCacChart() {
  const maxLtv = Math.max(...COHORTS.map((c) => c.ltv));
  const barW = 36; const gap = 16; const h = 120; const pad = 8;
  const totalW = COHORTS.length * (barW + gap) - gap;

  return (
    <svg viewBox={`0 0 ${totalW + pad * 2} ${h + 24}`} style={{ width: "100%", height: 160 }}>
      {COHORTS.map((c, i) => {
        const lx = pad + i * (barW + gap);
        const cacH = (c.cac / maxLtv) * h;
        const ltvH = (c.ltv / maxLtv) * h;
        return (
          <g key={c.label}>
            {/* LTV bar (background) */}
            <rect x={lx} y={h - ltvH + pad} width={barW} height={ltvH} rx={3} fill="rgba(59,130,246,0.15)" />
            {/* CAC bar (overlay) */}
            <rect x={lx} y={h - cacH + pad} width={barW} height={cacH} rx={3} fill="var(--accent)" />
            {/* Label */}
            <text x={lx + barW / 2} y={h + pad + 14} textAnchor="middle" fontSize={9} fill="var(--text-3)" fontFamily="JetBrains Mono, monospace">{c.label.replace(" ", "\n")}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

type MetricView = "ltv-cac" | "payback" | "nrr" | "channel";

export default function UnitEconomicsPage() {
  const [metricView, setMetricView] = useState<MetricView>("ltv-cac");
  const latest = COHORTS[COHORTS.length - 1];
  const { ratio: ltvCac, color: ltvColor } = ltvCacRatio(latest.ltv, latest.cac);

  const blendedCac = COHORTS.reduce((s, c) => s + c.cac * c.customers, 0) / COHORTS.reduce((s, c) => s + c.customers, 0);
  const blendedLtv = COHORTS.reduce((s, c) => s + c.ltv * c.customers, 0) / COHORTS.reduce((s, c) => s + c.customers, 0);

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <BarChart2 size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, fontWeight: 400 }}>Unit Economics</h1>
        </div>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>
          CAC, LTV, payback period, NRR · by cohort, quarter, and acquisition channel
        </p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "LTV:CAC Ratio", value: `${ltvCac.toFixed(1)}x`, sub: "Latest cohort · target >3x", color: ltvColor },
          { label: "CAC (Latest)", value: fmt(latest.cac), sub: `${pct(((latest.cac - COHORTS[0].cac) / COHORTS[0].cac) * 100)} vs Q1'25`, color: "var(--green)" },
          { label: "Payback Period", value: `${latest.paybackMonths}mo`, sub: "Latest cohort · down from 14mo", color: "var(--accent)" },
          { label: "Blended NRR", value: pct(COHORTS.slice(-2).reduce((s, c) => s + c.nrr, 0) / 2), sub: ">100% = net expansion", color: "var(--green)" },
          { label: "Avg Gross Margin", value: pct(latest.grossMarginPct), sub: "Product margin, excl. S&M", color: "var(--purple)" },
        ].map((k) => (
          <div key={k.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 26, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* LTV vs CAC Bar Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>LTV vs. CAC by Cohort</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 16 }}>Blue = LTV (full bar) · Accent = CAC</div>
          <LtvCacChart />
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--text-2)", marginTop: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: "rgba(59,130,246,0.2)", borderRadius: 2, display: "inline-block" }} /> LTV</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, background: "var(--accent)", borderRadius: 2, display: "inline-block" }} /> CAC</span>
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>CAC by Channel</div>
          {(["organic", "paid", "partner", "referral"] as const).map((ch) => {
            const cohorts = COHORTS.filter((c) => c.channel === ch);
            if (!cohorts.length) return null;
            const avgCac = cohorts.reduce((s, c) => s + c.cac, 0) / cohorts.length;
            const avgLtv = cohorts.reduce((s, c) => s + c.ltv, 0) / cohorts.length;
            return (
              <div key={ch} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: CHANNEL_COLOR[ch], display: "inline-block" }} />
                    <span style={{ fontSize: 12, textTransform: "capitalize", color: "var(--text)" }}>{ch}</span>
                  </div>
                  <div style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--text-2)" }}>
                    CAC {fmt(avgCac)} · LTV {fmt(avgLtv)} · {(avgLtv / avgCac).toFixed(1)}x
                  </div>
                </div>
                <MiniBar value={avgCac} max={10_000} color={CHANNEL_COLOR[ch]} />
              </div>
            );
          })}
          <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", fontSize: 12, color: "var(--text-2)" }}>
            <strong style={{ color: "var(--green)" }}>Organic</strong> delivers the best LTV:CAC at 11.2x with lowest payback (avg 10mo). Increase content budget by $20K/mo — projected additional 8 leads/mo.
          </div>
        </div>
      </div>

      {/* Cohort Table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 600 }}>
          Cohort Performance Table
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Cohort", "Customers", "CAC", "LTV", "LTV:CAC", "Payback", "NRR", "Churn", "ARPU", "Channel"].map((h, i) => (
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
            {COHORTS.map((c) => {
              const { ratio, color } = ltvCacRatio(c.ltv, c.cac);
              return (
                <tr key={c.label} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{c.label}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--text-2)" }}>{c.customers}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{fmt(c.cac)}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{fmt(c.ltv)}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color, fontWeight: 600 }}>{ratio.toFixed(1)}x</span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: c.paybackMonths <= 12 ? "var(--green)" : "var(--amber)" }}>{c.paybackMonths}mo</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: c.nrr >= 110 ? "var(--green)" : "var(--accent)" }}>{c.nrr}%</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: c.churnPct < 2 ? "var(--green)" : "var(--amber)" }}>{c.churnPct}%</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{fmt(c.arpu)}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: `${CHANNEL_COLOR[c.channel]}20`, color: CHANNEL_COLOR[c.channel], textTransform: "capitalize" }}>
                      {c.channel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
