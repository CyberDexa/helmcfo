import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investor Relations",
  description: "HelmCFO investor data room — metrics, traction, and Series A materials.",
};

// In production these would be fetched from the database / real metrics
const metrics = {
  arr: "$1.24M",
  arrGrowth: "+42% MoM",
  customers: 340,
  customersGrowth: "+38 this month",
  nps: 94,
  npsLabel: "Net Promoter Score",
  grossMargin: "81%",
  grossMarginLabel: "Gross margin",
  nrr: "118%",
  nrrLabel: "Net revenue retention",
  cac: "$1,240",
  cacLabel: "Blended CAC",
  ltv: "$14,800",
  ltvLabel: "LTV (3yr)",
  ltvCac: "11.9×",
  ltvCacLabel: "LTV:CAC",
  runway: "18.4 mo",
  runwayLabel: "Current runway",
  burnMultiple: "1.4×",
  burnMultipleLabel: "Burn multiple",
  headcount: 12,
  headcountLabel: "Full-time team",
};

const milestones = [
  { date: "Nov 2025", event: "Launched private beta with 5 design partners" },
  { date: "Dec 2025", event: "First $10K MRR — 12 paying customers" },
  { date: "Jan 2026", event: "SOC 2 Type I achieved" },
  { date: "Feb 2026", event: "Public launch — 340 customers" },
  { date: "Q2 2026", event: "Target: $3M ARR, 800 customers" },
  { date: "Q3 2026", event: "Target: SOC 2 Type II certification" },
  { date: "Q4 2026", event: "Target: Series A close ($8–15M at $40–60M pre)" },
];

const fundingMaterials = [
  { title: "Pitch Deck (Feb 2026)", desc: "Full narrative deck — market, product, traction, team, ask.", type: "PDF", locked: false },
  { title: "Financial Model (Live)", desc: "3-statement model with 3yr projections — base/bull/bear.", type: "Excel", locked: false },
  { title: "Technical Architecture", desc: "System design, security architecture, AI agent framework.", type: "PDF", locked: false },
  { title: "Customer References", desc: "5 design partners available for calls. Schedules on request.", type: "Intro", locked: true },
  { title: "Cap Table", desc: "Current cap table and option pool details.", type: "PDF", locked: true },
  { title: "SOC 2 Type I Report", desc: "January 2026 SOC 2 Type I certification report.", type: "PDF", locked: true },
];

export default function InvestorsPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Outfit',sans-serif", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-[15px]">Helm<span style={{ color: "var(--accent)" }}>CFO</span></Link>
          <span className="text-[12px] font-mono px-3 py-1 rounded-full" style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(59,130,246,0.3)" }}>Investor Relations</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--accent)" }}>Series A · Targeting Q4 2026</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "'DM Serif Display',serif" }}>
            HelmCFO Investor Data Room
          </h1>
          <p className="text-[15px] max-w-2xl leading-relaxed mb-5" style={{ color: "var(--text-2)" }}>
            AI-powered autonomous CFO platform replacing the $5K–$15K/mo fractional CFO for companies with 5–200 employees. Targeting $8–15M Series A at $40–60M pre-money valuation.
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:investors@helmcfo.com" className="px-5 py-2.5 rounded-xl text-[13px] font-semibold inline-flex items-center gap-2"
              style={{ background: "var(--accent)", color: "white" }}>
              investors@helmcfo.com
            </a>
            <span className="text-[12px]" style={{ color: "var(--text-3)" }}>NDA available on request</span>
          </div>
        </div>

        {/* Key metrics */}
        <div className="mb-14">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Live Traction — February 2026</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: metrics.arr, label: "ARR", sub: metrics.arrGrowth, color: "var(--green)" },
              { val: String(metrics.customers), label: "Paying customers", sub: metrics.customersGrowth, color: "var(--accent)" },
              { val: metrics.nrr, label: "Net Revenue Retention", sub: "Expansion from upsells", color: "var(--green)" },
              { val: metrics.nps, label: "NPS", sub: "Industry avg: 41 (SaaS)", color: "var(--green)" },
              { val: metrics.grossMargin, label: "Gross Margin", sub: "Target: 80%+", color: "var(--accent)" },
              { val: metrics.ltvCac, label: "LTV:CAC", sub: `CAC: ${metrics.cac} · LTV: ${metrics.ltv}`, color: "var(--green)" },
              { val: metrics.burnMultiple, label: "Burn Multiple", sub: "Best-in-class <1.5×", color: "var(--amber)" },
              { val: metrics.runway, label: "Runway", sub: "Pre-Series A", color: "var(--accent)" },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-2xl font-bold font-mono mb-1" style={{ color: m.color }}>{m.val}</p>
                <p className="text-[12px] font-semibold mb-0.5" style={{ color: "var(--text)" }}>{m.label}</p>
                <p className="text-[10px]" style={{ color: "var(--text-3)" }}>{m.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-14">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Milestones & roadmap</h2>
          <div className="space-y-3">
            {milestones.map((m, i) => {
              const isHistory = i < 4;
              return (
                <div key={m.date} className="flex items-start gap-4 rounded-xl p-4" style={{ background: "var(--surface)", border: `1px solid ${isHistory ? "var(--border)" : "rgba(59,130,246,0.2)"}` }}>
                  <span className="text-[11px] font-mono w-20 flex-shrink-0 pt-0.5" style={{ color: isHistory ? "var(--green)" : "var(--accent)" }}>{m.date}</span>
                  <div className="flex items-center gap-2">
                    {isHistory && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: "var(--green-dim)", color: "var(--green)" }}>DONE</span>}
                    {!isHistory && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>TARGET</span>}
                    <span className="text-[13px]" style={{ color: "var(--text-2)" }}>{m.event}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Series A ask */}
        <div className="rounded-2xl p-8 mb-14" style={{ background: "var(--surface)", border: "1px solid var(--border-hi)" }}>
          <h2 className="text-xl font-bold mb-5" style={{ color: "var(--text)" }}>The Series A ask</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Raise size", value: "$8–15M" },
              { label: "Pre-money valuation", value: "$40–60M" },
              { label: "Target close", value: "Q4 2026" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[12px] mb-1" style={{ color: "var(--text-3)" }}>{item.label}</p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="font-semibold text-[14px] mb-3" style={{ color: "var(--text)" }}>Use of funds:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { pct: "45%", label: "GTM & Sales", desc: "5 AEs, 2 BDRs, VP Sales, VC/accounting firm partnerships" },
                { pct: "30%", label: "Engineering", desc: "8 engineers — data infrastructure, AI agents, integrations" },
                { pct: "25%", label: "G&A & Compliance", desc: "SOC 2 Type II, E&O insurance, legal, finance" },
              ].map((u) => (
                <div key={u.label} className="rounded-xl p-4" style={{ background: "var(--surface-2)" }}>
                  <p className="text-xl font-bold mb-1" style={{ color: "var(--accent)" }}>{u.pct}</p>
                  <p className="font-semibold text-[13px] mb-1" style={{ color: "var(--text)" }}>{u.label}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data room materials */}
        <div className="mb-14">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Data room materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fundingMaterials.map((doc) => (
              <div key={doc.title} className="rounded-xl p-5 flex items-start justify-between gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div>
                  <p className="font-semibold text-[14px] mb-1" style={{ color: "var(--text)" }}>{doc.title}</p>
                  <p className="text-[12px]" style={{ color: "var(--text-2)" }}>{doc.desc}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--text-3)" }}>{doc.type}</span>
                  {doc.locked ? (
                    <p className="text-[10px] mt-1.5" style={{ color: "var(--text-3)" }}>NDA required</p>
                  ) : (
                    <a href="mailto:investors@helmcfo.com" className="block text-[10px] font-semibold mt-1.5" style={{ color: "var(--accent)" }}>Request →</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Let&apos;s talk</h3>
          <p className="text-[13px] mb-5" style={{ color: "var(--text-2)" }}>We respond to all investor inquiries within 24 hours.</p>
          <a href="mailto:investors@helmcfo.com" className="px-6 py-3 rounded-xl text-[13px] font-semibold inline-flex items-center gap-2"
            style={{ background: "var(--accent)", color: "white" }}>
            investors@helmcfo.com
          </a>
          <p className="text-[11px] mt-4" style={{ color: "var(--text-3)" }}>This page contains forward-looking statements. Actual results may vary materially from projections.</p>
        </div>
      </main>
    </div>
  );
}
