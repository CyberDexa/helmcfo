"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, ChevronRight, ExternalLink, CheckCircle, Star, Zap, Shield, Clock } from "lucide-react";

interface LendingPartner {
  id: string;
  name: string;
  logo: string;
  type: "revenue-based" | "term-loan" | "line-of-credit" | "venture-debt";
  range: string;
  rateRange: string;
  term: string;
  bestFor: string;
  minRevenue: number; // monthly
  requiresProfitability: boolean;
  fundingSpeed: string;
  highlights: string[];
  url: string;
  tag?: string;
}

const PARTNERS: LendingPartner[] = [
  {
    id: "arc",
    name: "Arc",
    logo: "A",
    type: "revenue-based",
    range: "$250K – $4M",
    rateRange: "1.5% – 3.5% flat fee",
    term: "6 – 24 months",
    bestFor: "SaaS companies with predictable ARR",
    minRevenue: 30_000,
    requiresProfitability: false,
    fundingSpeed: "72 hours",
    highlights: ["No dilution", "No board seats", "Connects to your bank for automated repayment", "Same-day decisions for <$500K"],
    url: "https://arc.dev",
    tag: "Best for SaaS",
  },
  {
    id: "clearco",
    name: "Clearco",
    logo: "C",
    type: "revenue-based",
    range: "$10K – $10M",
    rateRange: "6% – 12% flat fee",
    term: "Repay as % of revenue",
    bestFor: "E-commerce and marketplace businesses",
    minRevenue: 10_000,
    requiresProfitability: false,
    fundingSpeed: "2–5 business days",
    highlights: ["Revenue-based repayment", "No fixed monthly payments", "Marketing + inventory capital", "Integrated with Stripe/Shopify"],
    url: "https://clearco.com",
  },
  {
    id: "pipe",
    name: "Pipe",
    logo: "P",
    type: "revenue-based",
    range: "$50K – $5M",
    rateRange: "Advance rate on ARR",
    term: "Tied to subscription duration",
    bestFor: "Subscription-first businesses wanting to advance annual contracts",
    minRevenue: 15_000,
    requiresProfitability: false,
    fundingSpeed: "48 hours",
    highlights: ["Advance on annual subscriptions", "Maintain full equity", "No personal guarantees", "Recurring capital as ARR grows"],
    url: "https://pipe.com",
  },
  {
    id: "stripe-capital",
    name: "Stripe Capital",
    logo: "S",
    type: "revenue-based",
    range: "$5K – $2M",
    rateRange: "10% – 17% one-time fee",
    term: "Automatic repayment from Stripe revenue",
    bestFor: "Businesses processing $50K+/yr on Stripe",
    minRevenue: 5_000,
    requiresProfitability: false,
    fundingSpeed: "1 business day",
    highlights: ["Pre-approved based on Stripe history", "No application needed", "Repays automatically as % of daily sales", "No credit check"],
    url: "https://stripe.com/capital",
    tag: "Instant for Stripe users",
  },
  {
    id: "brex",
    name: "Brex Venture Debt",
    logo: "B",
    type: "venture-debt",
    range: "$1M – $50M",
    rateRange: "Prime + 3–5%",
    term: "24–36 months",
    bestFor: "VC-backed startups extending runway",
    minRevenue: 100_000,
    requiresProfitability: false,
    fundingSpeed: "2–4 weeks",
    highlights: ["Paired with Brex card for max limit", "Runway extension without priced round", "Warrant coverage 0.5–1%", "Non-dilutive to cap table"],
    url: "https://brex.com",
  },
  {
    id: "mercury-venture-debt",
    name: "Mercury Venture Debt",
    logo: "M",
    type: "venture-debt",
    range: "$250K – $5M",
    rateRange: "Prime + 3.5%",
    term: "12–24 months",
    bestFor: "Startups with Mercury banking relationship",
    minRevenue: 50_000,
    requiresProfitability: false,
    fundingSpeed: "1–2 weeks",
    highlights: ["Tight integration with Mercury treasury", "No warrant coverage under $1M", "Flexible draw schedule", "Works with existing investors"],
    url: "https://mercury.com",
  },
];

const TYPE_LABELS: Record<LendingPartner["type"], string> = {
  "revenue-based": "Revenue-Based",
  "term-loan": "Term Loan",
  "line-of-credit": "Line of Credit",
  "venture-debt": "Venture Debt",
};

const TYPE_COLORS: Record<LendingPartner["type"], string> = {
  "revenue-based": "#10b981",
  "term-loan": "#3b82f6",
  "line-of-credit": "#8b5cf6",
  "venture-debt": "#f59e0b",
};

function fmt(n: number) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : `$${(n / 1_000).toFixed(0)}K`;
}

export default function LendingPage() {
  const [typeFilter, setTypeFilter] = useState<LendingPartner["type"] | "all">("all");

  // Simulated company profile
  const profile = { monthlyRevenue: 185_000, mrr: 185_000, hasStripe: true, hasVC: true };
  const eligible = PARTNERS.filter((p) => profile.monthlyRevenue >= p.minRevenue);

  const filtered = typeFilter === "all" ? eligible : eligible.filter((p) => p.type === typeFilter);
  const maxBorrowing = eligible[0] ? profile.mrr * 12 * 0.25 : 0;

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <DollarSign size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, fontWeight: 400 }}>
            Capital & Lending
          </h1>
        </div>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>
          Non-dilutive financing matched to your financial profile · no equity given up
        </p>
      </div>

      {/* Profile Match Banner */}
      <div style={{
        background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: 14, padding: "20px 24px", marginBottom: 32,
        display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle size={16} color="var(--green)" />
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--green)" }}>
            {eligible.length} lenders match your profile
          </span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "MRR", value: `$${(profile.mrr / 1000).toFixed(0)}K` },
            { label: "Est. borrowing capacity", value: fmt(maxBorrowing) },
            { label: "Stripe connected", value: profile.hasStripe ? "Yes ✓" : "No" },
            { label: "VC-backed", value: profile.hasVC ? "Yes ✓" : "No" },
          ].map((m) => (
            <div key={m.label}>
              <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{m.label}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {(["all", "revenue-based", "venture-debt", "line-of-credit", "term-loan"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            style={{
              padding: "6px 14px", borderRadius: 8, border: "1px solid",
              borderColor: typeFilter === f ? "var(--accent)" : "var(--border)",
              background: typeFilter === f ? "rgba(59,130,246,0.12)" : "transparent",
              color: typeFilter === f ? "var(--accent)" : "var(--text-2)",
              fontSize: 12, cursor: "pointer",
            }}
          >
            {f === "all" ? "All Types" : TYPE_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Partner Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20, marginBottom: 40 }}>
        {filtered.map((p) => (
          <div
            key={p.id}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 14, padding: 24, position: "relative", overflow: "hidden",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hi)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            {/* Top accent bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${TYPE_COLORS[p.type]}, transparent)` }} />

            {/* Logo + Name */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: "var(--surface-2)",
                  border: "1px solid var(--border)", display: "grid", placeItems: "center",
                  fontFamily: "DM Serif Display, serif", fontSize: 18, color: "var(--accent)",
                }}>
                  {p.logo}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div>
                  <div style={{ fontSize: 11, padding: "2px 7px", borderRadius: 5, background: `${TYPE_COLORS[p.type]}20`, color: TYPE_COLORS[p.type], display: "inline-block", marginTop: 2 }}>
                    {TYPE_LABELS[p.type]}
                  </div>
                </div>
              </div>
              {p.tag && (
                <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(245,158,11,0.12)", color: "var(--amber)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <Star size={9} style={{ marginRight: 3 }} />
                  {p.tag}
                </div>
              )}
            </div>

            {/* Key Numbers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Amount", value: p.range },
                { label: "Cost", value: p.rateRange },
                { label: "Term", value: p.term },
                { label: "Speed", value: p.fundingSpeed },
              ].map((m) => (
                <div key={m.label} style={{ background: "var(--surface-2)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.6px" }}>{m.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text)", marginTop: 2, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Best For */}
            <p style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 16, lineHeight: 1.5 }}>
              <span style={{ color: "var(--text-3)" }}>Best for: </span>{p.bestFor}
            </p>

            {/* Highlights */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
              {p.highlights.slice(0, 3).map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                  <CheckCircle size={12} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: "var(--text-2)" }}>{h}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "10px 0", borderRadius: 10, border: "1px solid var(--accent)",
                background: "rgba(59,130,246,0.08)", color: "var(--accent)",
                fontSize: 13, fontWeight: 500, textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.08)")}
            >
              Apply on {p.name}
              <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
        padding: "16px 20px", fontSize: 12, color: "var(--text-3)", lineHeight: 1.7,
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Shield size={14} style={{ flexShrink: 0, marginTop: 1 }} color="var(--text-3)" />
          <span>
            HelmCFO is not a lender. Partner listings are for informational purposes only. We may receive a referral fee when you apply through our links. Always review terms with your legal and financial advisors. Eligibility and rates depend on your specific financial profile.
          </span>
        </div>
      </div>
    </div>
  );
}
