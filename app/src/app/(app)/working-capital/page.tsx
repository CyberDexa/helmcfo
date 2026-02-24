"use client";

import { useState } from "react";
import { Banknote, TrendingUp, TrendingDown, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface CashBridgeItem {
  label: string;
  amount: number;
  type: "opening" | "operating" | "investing" | "financing" | "closing";
  sublabel?: string;
}

interface LiquidityMetric {
  label: string;
  value: number | string;
  formula: string;
  status: "good" | "warn" | "bad";
  benchmark: string;
}

interface WorkingCapitalTrend {
  month: string;
  currentAssets: number;
  currentLiabilities: number;
  nwc: number;           // net working capital
  ccc: number;           // cash conversion cycle (days)
}

// ── MOCK DATA ─────────────────────────────────────────────────────────────────

const MONTHLY_TREND: WorkingCapitalTrend[] = [
  { month: "Jan", currentAssets: 2_840_000, currentLiabilities: 1_120_000, nwc: 1_720_000, ccc: 42 },
  { month: "Feb", currentAssets: 2_960_000, currentLiabilities: 1_190_000, nwc: 1_770_000, ccc: 39 },
  { month: "Mar", currentAssets: 3_180_000, currentLiabilities: 1_240_000, nwc: 1_940_000, ccc: 37 },
  { month: "Apr", currentAssets: 3_310_000, currentLiabilities: 1_300_000, nwc: 2_010_000, ccc: 35 },
  { month: "May", currentAssets: 3_520_000, currentLiabilities: 1_350_000, nwc: 2_170_000, ccc: 33 },
  { month: "Jun", currentAssets: 3_740_000, currentLiabilities: 1_410_000, nwc: 2_330_000, ccc: 31 },
];

const CASH_BRIDGE: CashBridgeItem[] = [
  { label: "Opening Cash (Jun 1)",          amount: 3_120_000, type: "opening" },
  // Operating
  { label: "Collections from customers",    amount: 1_284_000, type: "operating", sublabel: "Cash received" },
  { label: "Payroll & benefits",            amount: -628_000,  type: "operating", sublabel: "Largest outflow" },
  { label: "Vendor & COGS payments",        amount: -198_000,  type: "operating", sublabel: "" },
  { label: "SaaS & infrastructure",         amount: -52_000,   type: "operating", sublabel: "" },
  { label: "Office & facilities",           amount: -18_000,   type: "operating", sublabel: "" },
  // Investing
  { label: "Equipment purchase",            amount: -24_000,   type: "investing", sublabel: "" },
  // Financing
  { label: "Loan repayment (Brex)",         amount: -15_000,   type: "financing", sublabel: "Monthly principal" },
  { label: "Closing Cash (Jun 30)",         amount: 3_469_000, type: "closing" },
];

const METRICS: LiquidityMetric[] = [
  {
    label: "Current Ratio",
    value: "2.65x",
    formula: "Current Assets / Current Liabilities",
    status: "good",
    benchmark: ">2x healthy · >1.5x acceptable",
  },
  {
    label: "Quick Ratio",
    value: "2.31x",
    formula: "(Cash + AR) / Current Liabilities",
    status: "good",
    benchmark: ">1x minimum · >1.5x strong",
  },
  {
    label: "Cash Conversion Cycle",
    value: "31 days",
    formula: "DSO + DIO − DPO",
    status: "good",
    benchmark: "<45 days excellent for B2B SaaS",
  },
  {
    label: "Net Working Capital",
    value: fmt(2_330_000),
    formula: "Current Assets − Current Liabilities",
    status: "good",
    benchmark: ">1.5× monthly burn is healthy",
  },
  {
    label: "Operating Cash Flow",
    value: fmt(388_000),
    formula: "Net income + non-cash adj + WC changes",
    status: "good",
    benchmark: "+ve OCF = cash generative operations",
  },
  {
    label: "Cash Runway",
    value: "14.2 mo",
    formula: "Cash balance / monthly net burn",
    status: "warn",
    benchmark: "Target >18 months before fundraise",
  },
];

function fmt(n: number) {
  if (n < 0) return `-$${(Math.abs(n) / 1_000).toFixed(0)}K`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

// ── NWC SPARKLINE ─────────────────────────────────────────────────────────────

function NwcLine() {
  const max = Math.max(...MONTHLY_TREND.map((m) => m.nwc));
  const min = Math.min(...MONTHLY_TREND.map((m) => m.nwc));
  const pts = MONTHLY_TREND.map((m, i) => {
    const x = 10 + (i / (MONTHLY_TREND.length - 1)) * 280;
    const y = 55 - ((m.nwc - min) / (max - min)) * 45;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 300 70" style={{ width: "100%", height: 80 }}>
      <polyline points={pts} fill="none" stroke="var(--green)" strokeWidth={2} strokeLinejoin="round" />
      {MONTHLY_TREND.map((m, i) => {
        const x = 10 + (i / (MONTHLY_TREND.length - 1)) * 280;
        const y = 55 - ((m.nwc - min) / (max - min)) * 45;
        return (
          <g key={m.month}>
            <circle cx={x} cy={y} r={3} fill="var(--green)" />
            <text x={x} y={67} textAnchor="middle" fontSize={8} fill="var(--text-3)" fontFamily="JetBrains Mono,monospace">{m.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── CCC SPARKLINE ─────────────────────────────────────────────────────────────

function CccLine() {
  const max = Math.max(...MONTHLY_TREND.map((m) => m.ccc));
  const min = Math.min(...MONTHLY_TREND.map((m) => m.ccc));
  const pts = MONTHLY_TREND.map((m, i) => {
    const x = 10 + (i / (MONTHLY_TREND.length - 1)) * 280;
    const y = 55 - ((m.ccc - min) / (max - min || 1)) * 45;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 300 70" style={{ width: "100%", height: 80 }}>
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" strokeDasharray="4 2" />
      {MONTHLY_TREND.map((m, i) => {
        const x = 10 + (i / (MONTHLY_TREND.length - 1)) * 280;
        const y = 55 - ((m.ccc - min) / (max - min || 1)) * 45;
        return (
          <g key={m.month}>
            <circle cx={x} cy={y} r={3} fill="var(--accent)" />
            <text x={x} y={67} textAnchor="middle" fontSize={8} fill="var(--text-3)" fontFamily="JetBrains Mono,monospace">{m.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

type Tab = "overview" | "cash-flow" | "optimization";

export default function WorkingCapitalPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const latest = MONTHLY_TREND[MONTHLY_TREND.length - 1];

  const operatingCash = CASH_BRIDGE
    .filter((b) => b.type === "operating")
    .reduce((s, b) => s + b.amount, 0);

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Banknote size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, fontWeight: 400 }}>Working Capital & Cash Management</h1>
        </div>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>
          Liquidity ratios, cash conversion cycle, operating cash flow bridge, and optimization playbook
        </p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Net Working Capital", value: fmt(latest.nwc), sub: `+${fmt(latest.nwc - MONTHLY_TREND[0].nwc)} since Jan`, color: "var(--green)" },
          { label: "Current Ratio", value: `${(latest.currentAssets / latest.currentLiabilities).toFixed(2)}x`, sub: ">2x — healthy liquidity", color: "var(--green)" },
          { label: "Cash Conv. Cycle", value: `${latest.ccc} days`, sub: "Down 11 days since Jan", color: "var(--accent)" },
          { label: "OCF (Jun)", value: fmt(operatingCash), sub: "Operating cash flow", color: operatingCash > 0 ? "var(--green)" : "var(--red)" },
          { label: "Cash Runway", value: "14.2 mo", sub: "At current burn rate", color: "var(--amber)" },
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
        {([["overview", "Liquidity Overview"], ["cash-flow", "Cash Flow Bridge"], ["optimization", "Optimization"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "7px 20px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
            background: tab === key ? "var(--surface-3)" : "transparent",
            color: tab === key ? "var(--text)" : "var(--text-3)",
          }}>{label}</button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <>
          {/* Charts row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Net Working Capital Trend</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 16 }}>Jan–Jun 2026 · improving +35%</div>
              <NwcLine />
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Cash Conversion Cycle (Days)</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 16 }}>Improving — target &lt;30 days by Q4</div>
              <CccLine />
            </div>
          </div>

          {/* Metrics grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {METRICS.map((m) => (
              <div key={m.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 6 }}>{m.label}</div>
                <div style={{
                  fontFamily: "DM Serif Display, serif", fontSize: 28, lineHeight: 1, marginBottom: 4,
                  color: m.status === "good" ? "var(--green)" : m.status === "warn" ? "var(--amber)" : "var(--red)",
                }}>{m.value}</div>
                <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "var(--text-3)", marginBottom: 8 }}>{m.formula}</div>
                <div style={{ fontSize: 11, color: "var(--text-2)", padding: "6px 10px", background: "var(--surface-3)", borderRadius: 7 }}>{m.benchmark}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CASH FLOW BRIDGE TAB */}
      {tab === "cash-flow" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 600 }}>
            June 2026 Cash Flow Bridge
          </div>
          <div style={{ padding: "8px 0" }}>
            {CASH_BRIDGE.map((item, i) => {
              const isSpecial = item.type === "opening" || item.type === "closing";
              const sectionHeaders: Record<string, string> = {
                operating: "Operating Activities",
                investing:  "Investing Activities",
                financing:  "Financing Activities",
              };
              const prevType = i > 0 ? CASH_BRIDGE[i - 1].type : null;
              const showHeader = !isSpecial && item.type !== prevType && sectionHeaders[item.type];

              return (
                <div key={item.label}>
                  {showHeader && (
                    <div style={{ padding: "10px 24px 4px", fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700, marginTop: 8 }}>
                      {sectionHeaders[item.type]}
                    </div>
                  )}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "11px 24px",
                    background: isSpecial ? "var(--surface-2)" : "transparent",
                    borderTop: isSpecial ? "1px solid var(--border)" : "none",
                    borderBottom: item.type === "closing" ? "none" : "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <div>
                      <span style={{ fontSize: isSpecial ? 13 : 12, fontWeight: isSpecial ? 600 : 400 }}>{item.label}</span>
                      {item.sublabel && <span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: 8 }}>{item.sublabel}</span>}
                    </div>
                    <span style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: isSpecial ? 14 : 12,
                      fontWeight: isSpecial ? 700 : 400,
                      color: item.amount < 0 ? "var(--red)" : item.type === "opening" ? "var(--text)" : item.type === "closing" ? "var(--accent)" : "var(--green)",
                    }}>
                      {item.amount < 0 ? `($${(Math.abs(item.amount) / 1_000).toFixed(0)}K)` : `$${(item.amount / 1_000).toFixed(0)}K`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-2)", background: "rgba(16,185,129,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={14} color="var(--green)" />
            Cash increased <strong style={{ color: "var(--green)" }}>+$349K</strong> in June. Payroll is 62% of operating outflows — headcount costs are the primary lever for cash management.
          </div>
        </div>
      )}

      {/* OPTIMIZATION TAB */}
      {tab === "optimization" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            {
              icon: <RefreshCw size={16} />,
              color: "var(--accent)",
              title: "Accelerate collections — close the CCC gap",
              priority: "High",
              impact: "+$180K freed from AR",
              actions: [
                "Send automated reminder invoices at T-5 days before due date",
                "Offer 1.5% early-pay discount on invoices >$10K",
                "Switch Nexus Corp and Orbital Labs to milestone-based billing for multi-year contracts",
                "Enable ACH auto-pay for all Growth/Enterprise customers",
              ],
            },
            {
              icon: <TrendingUp size={16} />,
              color: "var(--green)",
              title: "Extend DPO on non-penalty vendors (free float)",
              priority: "High",
              impact: "+$95K working capital",
              actions: [
                "Renegotiate AWS from Net-30 to Net-60 — AWS routinely grants this to growth-stage SaaS",
                "Request 45-day terms from Snowflake at renewal",
                "Pre-pay Stripe and Brex only when required (no early payment benefit)",
                "Set up automated payment on due-date, not receipt-date",
              ],
            },
            {
              icon: <Banknote size={16} />,
              color: "var(--purple)",
              title: "Sweep idle cash to yield-bearing accounts",
              priority: "Medium",
              impact: "+$12–18K/yr passive yield",
              actions: [
                "Move $2M of operating reserve to Mercury Treasury (currently ~4.9% APY)",
                "Keep 3-month burn ($870K) in operating checking — earmark remainder",
                "Set up automated sweep: balance over $1.5M moves to yield account weekly",
              ],
            },
            {
              icon: <AlertCircle size={16} />,
              color: "var(--amber)",
              title: "Runway extension — 14mo is below target threshold",
              priority: "Medium",
              impact: "+4–6 months runway",
              actions: [
                "Reduce discretionary spend (T&E, events, recruiting ads) by 20% until runway exceeds 18mo",
                "Push 2 contractor renewals to Q4 — saves $38K/mo",
                "Collect $98K in outstanding AR (INV-1052, INV-1074, INV-1081) this week",
                "Consider $500K revenue-based credit line with Arc or Pipe as runway buffer — does not dilute equity",
              ],
            },
          ].map((item) => (
            <div key={item.title} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: `${item.color}15`, color: item.color }}>{item.priority}</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: "rgba(16,185,129,0.08)", color: "var(--green)" }}>{item.impact}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {item.actions.map((action, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--text-2)" }}>
                    <ArrowRight size={12} style={{ color: item.color, marginTop: 3, flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.5 }}>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
