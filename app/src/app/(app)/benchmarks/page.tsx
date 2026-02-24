"use client";

import { useState } from "react";
import { BarChart2, TrendingUp, Users, DollarSign, ChevronDown } from "lucide-react";

// ── TYPES ────────────────────────────────────────────────────────────────────

interface BenchmarkMetric {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  label: string;
  unit: string;
  description: string;
}

// ── STATIC DATA (mirrors /api/benchmarks) ────────────────────────────────────

const BENCHMARKS: Record<string, Record<string, BenchmarkMetric>> = {
  "saas-seed": {
    burnMultiple:      { p25: 1.1, p50: 1.8, p75: 2.8, p90: 4.2, label: "Burn Multiple",          unit: "x",  description: "Net burn ÷ net new ARR. <1.5x is capital-efficient." },
    grossMarginPct:    { p25: 55,  p50: 67,  p75: 76,  p90: 83,  label: "Gross Margin",            unit: "%",  description: "Revenue minus COGS as % of revenue. >65% is healthy for SaaS." },
    mrrGrowthMoM:      { p25: 4,   p50: 8,   p75: 14,  p90: 22,  label: "MRR Growth (MoM)",        unit: "%",  description: "Month-over-month MRR growth. Top decile: 22%+." },
    cacPaybackMonths:  { p25: 10,  p50: 17,  p75: 26,  p90: 38,  label: "CAC Payback Period",      unit: "mo", description: "Months to recover customer acquisition cost from gross profit." },
    nrrPct:            { p25: 88,  p50: 98,  p75: 112, p90: 125, label: "Net Revenue Retention",   unit: "%",  description: ">100% = expansion exceeds churn. Best-in-class: 120%+." },
    runwayMonths:      { p25: 6,   p50: 14,  p75: 22,  p90: 30,  label: "Cash Runway",             unit: "mo", description: "Months of runway at current burn rate." },
    revenuePerFTE:     { p25: 85,  p50: 140, p75: 210, p90: 320, label: "Revenue per Employee",    unit: "$K", description: "ARR per full-time equivalent headcount." },
    ruleOf40:          { p25: -8,  p50: 12,  p75: 28,  p90: 45,  label: "Rule of 40",              unit: "%",  description: "YoY growth % + EBITDA margin %. >40% = healthy." },
    magicNumber:       { p25: 0.4, p50: 0.7, p75: 1.1, p90: 1.6, label: "Magic Number",            unit: "x",  description: "Net new ARR ÷ prior-quarter S&M spend. >0.75 = invest more." },
    arrPerSales:       { p25: 400, p50: 700, p75: 1100,p90: 1800, label: "ARR per Sales FTE",      unit: "$K", description: "ARR per quota-carrying sales rep." },
  },
  "saas-series-a": {
    burnMultiple:      { p25: 0.9, p50: 1.4, p75: 2.2, p90: 3.5, label: "Burn Multiple",          unit: "x",  description: "Net burn ÷ net new ARR. <1.5x is capital-efficient." },
    grossMarginPct:    { p25: 62,  p50: 72,  p75: 80,  p90: 86,  label: "Gross Margin",            unit: "%",  description: ">70% preferred at Series A. >80% for best-in-class." },
    mrrGrowthMoM:      { p25: 6,   p50: 12,  p75: 18,  p90: 28,  label: "MRR Growth (MoM)",        unit: "%",  description: "Top-quartile Series A companies grow 18%+ MoM." },
    cacPaybackMonths:  { p25: 8,   p50: 14,  p75: 22,  p90: 32,  label: "CAC Payback Period",      unit: "mo", description: "<12 months payback is considered elite at Series A." },
    nrrPct:            { p25: 95,  p50: 108, p75: 120, p90: 135, label: "Net Revenue Retention",   unit: "%",  description: "Series A SaaS median: 108%. 120%+ wins premium valuation." },
    runwayMonths:      { p25: 14,  p50: 20,  p75: 28,  p90: 36,  label: "Cash Runway",             unit: "mo", description: ">18 months typically required before next raise." },
    revenuePerFTE:     { p25: 130, p50: 200, p75: 290, p90: 410, label: "Revenue per Employee",    unit: "$K", description: "$200K+ ARR per headcount is the Series A threshold." },
    ruleOf40:          { p25: 5,   p50: 22,  p75: 38,  p90: 58,  label: "Rule of 40",              unit: "%",  description: ">40% expected by Series B. Top quartile: 38%+." },
    magicNumber:       { p25: 0.6, p50: 0.9, p75: 1.4, p90: 2.0, label: "Magic Number",            unit: "x",  description: ">1.0 = ready to aggressively invest in S&M." },
    arrPerSales:       { p25: 600, p50: 900, p75: 1400,p90: 2200, label: "ARR per Sales FTE",      unit: "$K", description: "$900K ARR per rep is the Series A median." },
  },
};

// Simulated company values to show positioning on the benchmark
const MY_VALUES: Record<string, number> = {
  burnMultiple: 1.9,
  grossMarginPct: 71,
  mrrGrowthMoM: 11,
  cacPaybackMonths: 18,
  nrrPct: 107,
  runwayMonths: 16,
  revenuePerFTE: 185,
  ruleOf40: 19,
  magicNumber: 0.85,
  arrPerSales: 820,
};

type Segment = "saas-seed" | "saas-series-a";

function getPercentilePosition(value: number, metric: BenchmarkMetric) {
  if (value <= metric.p25) return { pct: ((value / metric.p25) * 25), band: "Below P25", color: "#ef4444" };
  if (value <= metric.p50) return { pct: 25 + ((value - metric.p25) / (metric.p50 - metric.p25)) * 25, band: "P25–P50", color: "#f59e0b" };
  if (value <= metric.p75) return { pct: 50 + ((value - metric.p50) / (metric.p75 - metric.p50)) * 25, band: "P50–P75", color: "#3b82f6" };
  if (value <= metric.p90) return { pct: 75 + ((value - metric.p75) / (metric.p90 - metric.p75)) * 15, band: "P75–P90", color: "#10b981" };
  return { pct: 90, band: "Top 10%", color: "#8b5cf6" };
}

export default function BenchmarksPage() {
  const [segment, setSegment] = useState<Segment>("saas-seed");
  const metrics = BENCHMARKS[segment];

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <BarChart2 size={20} color="var(--accent)" />
            <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, fontWeight: 400 }}>
              Industry Benchmarks
            </h1>
          </div>
          <p style={{ color: "var(--text-2)", fontSize: 14 }}>
            Anonymized data from {segment === "saas-seed" ? "150+" : "80+"} opt-in companies · updated monthly
          </p>
        </div>

        {/* Segment Switcher */}
        <div style={{ display: "flex", gap: 8 }}>
          {(["saas-seed", "saas-series-a"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSegment(s)}
              style={{
                padding: "8px 16px", borderRadius: 10, border: "1px solid",
                borderColor: segment === s ? "var(--accent)" : "var(--border)",
                background: segment === s ? "rgba(59,130,246,0.12)" : "transparent",
                color: segment === s ? "var(--accent)" : "var(--text-2)",
                fontSize: 13, cursor: "pointer",
              }}
            >
              {s === "saas-seed" ? "Seed SaaS" : "Series A SaaS"}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div style={{
        background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
        borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "var(--text-2)", marginBottom: 32,
      }}>
        All benchmarks use anonymized, aggregated data. No individual company data is identifiable. Minimum cohort size of 10 per cell (k-anonymity).
        Your company is shown in purple; you can opt out in Settings.
      </div>

      {/* Benchmark Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: 20 }}>
        {Object.entries(metrics).map(([key, metric]) => {
          const myVal = MY_VALUES[key];
          const position = getPercentilePosition(myVal, metric);

          return (
            <div
              key={key}
              style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 14, padding: 24,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{metric.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{metric.description}</div>
                </div>
                <div style={{
                  fontSize: 11, padding: "3px 8px", borderRadius: 6,
                  background: `${position.color}20`, color: position.color,
                  whiteSpace: "nowrap",
                }}>
                  {position.band}
                </div>
              </div>

              {/* Percentile bar */}
              <div style={{ margin: "20px 0 8px", position: "relative" }}>
                {/* Background gradient track */}
                <div style={{
                  height: 8, borderRadius: 99, position: "relative",
                  background: "linear-gradient(90deg, rgba(239,68,68,0.2) 0%, rgba(245,158,11,0.2) 25%, rgba(59,130,246,0.2) 50%, rgba(16,185,129,0.2) 75%, rgba(139,92,246,0.2) 90%)",
                }}>
                  {/* Tick marks at p25, p50, p75, p90 */}
                  {[25, 50, 75, 90].map((p) => (
                    <div key={p} style={{
                      position: "absolute", left: `${p}%`, top: -4, bottom: -4,
                      width: 1, background: "var(--border)",
                    }} />
                  ))}
                  {/* Company marker */}
                  <div style={{
                    position: "absolute",
                    left: `${Math.min(Math.max(position.pct, 2), 97)}%`,
                    top: "50%", transform: "translate(-50%, -50%)",
                    width: 14, height: 14, borderRadius: "50%",
                    background: position.color,
                    border: "2px solid var(--surface)",
                    boxShadow: `0 0 8px ${position.color}80`,
                    zIndex: 2,
                  }} />
                </div>
              </div>

              {/* Percentile labels */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-3)", fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>
                <span>P25</span>
                <span>P50</span>
                <span>P75</span>
                <span>P90</span>
              </div>

              {/* Comparison table */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {[
                  { label: "P25", val: metric.p25, color: "var(--red)" },
                  { label: "P50", val: metric.p50, color: "var(--amber)" },
                  { label: "P75", val: metric.p75, color: "var(--accent)" },
                  { label: "P90", val: metric.p90, color: "var(--green)" },
                  { label: "You", val: myVal, color: position.color, highlight: true },
                ].map(({ label, val, color, highlight }) => (
                  <div key={label} style={{
                    background: highlight ? `${position.color}15` : "var(--surface-2)",
                    borderRadius: 8, padding: "8px 0", textAlign: "center",
                    border: `1px solid ${highlight ? position.color + "40" : "transparent"}`,
                  }}>
                    <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color, fontFamily: "JetBrains Mono, monospace" }}>
                      {metric.unit === "$K" ? `$${val}K` : `${val}${metric.unit}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
