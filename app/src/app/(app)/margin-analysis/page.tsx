"use client";

import { useState } from "react";
import { Percent, TrendingUp, TrendingDown, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface ProductLine {
  id: string;
  name: string;
  tier: "starter" | "growth" | "scale" | "enterprise";
  arr: number;
  customers: number;
  cogs: number;         // per year per customer
  arpu: number;         // annual per customer
  grossMarginPct: number;
  contributionMarginPct: number; // after S&M
  churnPct: number;
  acv: number;
}

interface PricingScenario {
  label: string;
  priceChange: number;   // % delta
  volChange: number;     // % delta in demand elasticity
  netRevenueImpact: number;
  marginImpact: number;
}

// ── MOCK DATA ─────────────────────────────────────────────────────────────────

const PRODUCTS: ProductLine[] = [
  {
    id: "starter",
    name: "Starter",
    tier: "starter",
    arr: 1_080_000,
    customers: 302,
    cogs: 1_380,
    arpu: 3_576,
    grossMarginPct: 61,
    contributionMarginPct: 22,
    churnPct: 4.2,
    acv: 3_588,
  },
  {
    id: "growth",
    name: "Growth",
    tier: "growth",
    arr: 4_190_400,
    customers: 437,
    cogs: 1_980,
    arpu: 9_588,
    grossMarginPct: 79,
    contributionMarginPct: 44,
    churnPct: 1.8,
    acv: 9_588,
  },
  {
    id: "scale",
    name: "Scale",
    tier: "scale",
    arr: 2_338_200,
    customers: 130,
    cogs: 2_640,
    arpu: 17_986,
    grossMarginPct: 85,
    contributionMarginPct: 58,
    churnPct: 0.9,
    acv: 17_988,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tier: "enterprise",
    arr: 1_188_000,
    customers: 22,
    cogs: 4_200,
    arpu: 54_000,
    grossMarginPct: 92,
    contributionMarginPct: 74,
    churnPct: 0.3,
    acv: 54_000,
  },
];

const SCENARIOS: PricingScenario[] = [
  { label: "Raise Growth +$100 (→$899/mo)", priceChange: 12.5,  volChange: -4,   netRevenueImpact: 395_000,  marginImpact: 3.1 },
  { label: "Raise Starter +$50 (→$349/mo)",  priceChange: 16.7, volChange: -9,   netRevenueImpact: 87_000,   marginImpact: 1.8 },
  { label: "Add $25K Enterprise tier",        priceChange: 0,    volChange: 3,    netRevenueImpact: 660_000,  marginImpact: 4.2 },
  { label: "Introduce usage-based add-ons",   priceChange: 0,    volChange: 0,    netRevenueImpact: 280_000,  marginImpact: 2.9 },
  { label: "Discount 20% annual upfront",     priceChange: -20,  volChange: 28,   netRevenueImpact: 194_000,  marginImpact: -1.4 },
];

const SEGMENT_MARGINS = [
  { segment: "FinTech/SaaS",      margin: 84, customers: 188, arr: 2_810_000 },
  { segment: "Professional Svcs", margin: 76, customers: 224, arr: 2_020_000 },
  { segment: "E-Commerce",        margin: 71, customers: 136, arr: 1_140_000 },
  { segment: "Healthcare",        margin: 68, customers: 87,  arr: 960_000  },
  { segment: "Manufacturing",     margin: 62, customers: 56,  arr: 620_000  },
  { segment: "Other",             margin: 69, customers: 200, arr: 1_246_600 },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const TIER_COLOR: Record<ProductLine["tier"], string> = {
  starter:    "#60a5fa",
  growth:     "#3b82f6",
  scale:      "#8b5cf6",
  enterprise: "#10b981",
};

// ── STACKED BAR (SVG) ─────────────────────────────────────────────────────────

function MarginStackBar({ grossPct, contributionPct }: { grossPct: number; contributionPct: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 8, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${grossPct}%`, height: "100%", background: "var(--green)", borderRadius: 99 }} />
        </div>
        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "var(--green)", minWidth: 32 }}>{grossPct}%</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 8, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${contributionPct}%`, height: "100%", background: "var(--accent)", borderRadius: 99 }} />
        </div>
        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "var(--accent)", minWidth: 32 }}>{contributionPct}%</span>
      </div>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

type Tab = "overview" | "segments" | "scenarios";

export default function MarginAnalysisPage() {
  const [tab, setTab] = useState<Tab>("overview");

  const totalArr = PRODUCTS.reduce((s, p) => s + p.arr, 0);
  const totalCustomers = PRODUCTS.reduce((s, p) => s + p.customers, 0);
  const blendedGrossMargin = PRODUCTS.reduce((s, p) => s + p.grossMarginPct * p.arr, 0) / totalArr;
  const blendedContribution = PRODUCTS.reduce((s, p) => s + p.contributionMarginPct * p.arr, 0) / totalArr;

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Percent size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, fontWeight: 400 }}>Pricing & Margin Analysis</h1>
        </div>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>
          Gross margin and contribution margin by product tier, customer segment, and pricing scenario modeling
        </p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total ARR", value: fmt(totalArr), sub: `${totalCustomers} customers`, color: "var(--accent)" },
          { label: "Blended Gross Margin", value: `${blendedGrossMargin.toFixed(1)}%`, sub: "After direct COGS", color: "var(--green)" },
          { label: "Contribution Margin", value: `${blendedContribution.toFixed(1)}%`, sub: "After COGS + S&M", color: blendedContribution >= 40 ? "var(--green)" : "var(--amber)" },
          { label: "Highest-Margin Tier", value: "Enterprise", sub: "92% gross · 74% contribution", color: "var(--purple)" },
          { label: "Price Expansion Opp.", value: fmt(SCENARIOS[0].netRevenueImpact + SCENARIOS[2].netRevenueImpact), sub: "Top 2 scenarios", color: "var(--amber)" },
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
        {([["overview", "Tier Overview"], ["segments", "Segment Analysis"], ["scenarios", "Pricing Scenarios"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "7px 20px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
            background: tab === key ? "var(--surface-3)" : "transparent",
            color: tab === key ? "var(--text)" : "var(--text-3)",
          }}>{label}</button>
        ))}
      </div>

      {/* TIER OVERVIEW TAB */}
      {tab === "overview" && (
        <>
          {/* Margin visual cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {PRODUCTS.map((p) => (
              <div key={p.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: `${TIER_COLOR[p.tier]}15`, color: TIER_COLOR[p.tier] }}>{p.customers} customers</span>
                </div>
                <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 22, color: TIER_COLOR[p.tier], marginBottom: 4 }}>{fmt(p.arr)}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 14 }}>ARR · {fmt(p.arpu)}/yr ARPU</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>Gross margin</div>
                <MarginStackBar grossPct={p.grossMarginPct} contributionPct={p.contributionMarginPct} />
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-3)" }}>
                  <span>Churn: <span style={{ color: p.churnPct < 2 ? "var(--green)" : "var(--amber)" }}>{p.churnPct}%/mo</span></span>
                  <span>COGS: {fmt(p.cogs)}/yr/cust</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI insights */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>AI Pricing Intelligence</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: <TrendingUp size={14} />,   color: "var(--green)",  title: "Move upmarket aggressively", body: "Enterprise has 92% gross margin vs 61% for Starter. Every customer migrated from Starter→Growth adds $5.9K ARR at 18pp higher margin. Target: convert 60 Starter → Growth this quarter (+$355K ARR)." },
                { icon: <AlertCircle size={14} />,  color: "var(--amber)",  title: "Starter margin is a concern", body: "Starter's 61% gross margin compresses to only 22% contribution margin after CAC. At $299/mo, payback is 28 months — nearly 2x the target. Consider raising to $349 or restricting features." },
                { icon: <TrendingUp size={14} />,   color: "var(--accent)", title: "Usage-based upsell opportunity", body: "Top 15% of Growth customers use 3x average API calls. Introducing a $0.08/unit overage tier above 10K calls/mo would generate ~$280K ARR with zero new CAC." },
                { icon: <TrendingDown size={14} />, color: "var(--red)",    title: "Manufacturing segment is dilutive", body: "Manufacturing customers have 62% gross margin vs 84% for FinTech/SaaS. 56 customers generating $620K ARR at disproportionate support cost. De-prioritize this vertical in paid acquisition." },
              ].map((insight, i) => (
                <div key={i} style={{ padding: "14px 16px", borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6, color: insight.color }}>
                    {insight.icon}
                    <span style={{ fontSize: 12, fontWeight: 600, color: insight.color }}>{insight.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6, margin: 0 }}>{insight.body}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* SEGMENT ANALYSIS TAB */}
      {tab === "segments" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            {/* Margin by segment */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Gross Margin by Customer Segment</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 20 }}>Ranked by margin · bubble = ARR contribution</div>
              {SEGMENT_MARGINS.sort((a, b) => b.margin - a.margin).map((s) => (
                <div key={s.segment} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12 }}>{s.segment}</span>
                    <div style={{ display: "flex", gap: 12, fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}>
                      <span style={{ color: "var(--text-3)" }}>{s.customers} customers</span>
                      <span style={{ color: "var(--text-2)" }}>{fmt(s.arr)}</span>
                      <span style={{ color: s.margin >= 75 ? "var(--green)" : s.margin >= 65 ? "var(--amber)" : "var(--red)", fontWeight: 600 }}>{s.margin}%</span>
                    </div>
                  </div>
                  <div style={{ height: 7, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${s.margin}%`, height: "100%", background: s.margin >= 75 ? "var(--green)" : s.margin >= 65 ? "var(--amber)" : "var(--red)", borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* ARR by segment */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ARR Contribution by Segment</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 20 }}>Revenue mix · top segments by ARR</div>
              {SEGMENT_MARGINS.sort((a, b) => b.arr - a.arr).map((s) => {
                const pct = (s.arr / SEGMENT_MARGINS.reduce((t, x) => t + x.arr, 0)) * 100;
                return (
                  <div key={s.segment} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12 }}>{s.segment}</span>
                      <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "var(--text-2)" }}>{fmt(s.arr)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ height: 7, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent)", borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Segment x Tier matrix */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>AI Segment Recommendations</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 16 }}>Where to invest acquisition and expansion resources</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { segment: "FinTech/SaaS", priority: "Invest", color: "var(--green)",  reason: "84% margin + fastest product adoption. Increase paid spend 2x in this vertical. Target: +60 customers in 6 months." },
                { segment: "Healthcare",   priority: "Nurture", color: "var(--amber)", reason: "68% margin but long sales cycles. High ACV potential ($20K+) if you develop HIPAA compliance features. Worth investing in roadmap." },
                { segment: "Manufacturing",priority: "Deprioritize", color: "var(--red)", reason: "62% margin + high support load. Pause paid acquisition. Serve existing customers, but shift spend to FinTech/SaaS." },
              ].map((s) => (
                <div key={s.segment} style={{ padding: "14px 16px", borderRadius: 10, background: "var(--surface-2)", border: `1px solid ${s.color}30` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{s.segment}</span>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: `${s.color}18`, color: s.color }}>{s.priority}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6, margin: 0 }}>{s.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* PRICING SCENARIOS TAB */}
      {tab === "scenarios" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 24 }}>
            {SCENARIOS.map((s) => (
              <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-3)" }}>
                    {s.priceChange !== 0 && <span>Price: <span style={{ color: s.priceChange > 0 ? "var(--green)" : "var(--red)" }}>{s.priceChange > 0 ? "+" : ""}{s.priceChange}%</span></span>}
                    {s.volChange !== 0 && <span>Volume: <span style={{ color: s.volChange > 0 ? "var(--green)" : "var(--amber)" }}>{s.volChange > 0 ? "+" : ""}{s.volChange}%</span></span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 3 }}>Net Rev. Impact</div>
                    <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 22, color: s.netRevenueImpact > 0 ? "var(--green)" : "var(--red)" }}>
                      {s.netRevenueImpact > 0 ? "+" : ""}{fmt(s.netRevenueImpact)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 3 }}>Margin Δ</div>
                    <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 22, color: s.marginImpact > 0 ? "var(--green)" : "var(--red)" }}>
                      {s.marginImpact > 0 ? "+" : ""}{s.marginImpact}pp
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", fontSize: 12, color: "var(--text-2)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--accent)" }}>AI recommendation:</strong> The highest-impact action is a combination of <strong>raising Growth to $899/mo (+$395K ARR)</strong> and <strong>adding a $25K enterprise tier (+$660K ARR)</strong>. Together these add <strong>+$1.06M ARR</strong> with minimal churn risk — enterprise customers have 0.3% monthly churn and Growth cohorts have shown inelastic response to 10–15% price changes historically. Implement with a 60-day notice and grandfather existing annual contracts.
          </div>
        </>
      )}
    </div>
  );
}
