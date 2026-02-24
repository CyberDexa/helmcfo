import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export const metadata = {
  title: "VC Portfolio Program",
  description: "Free HelmCFO licenses for your entire portfolio. Aggregate fund KPIs. Spot at-risk companies before they call you.",
};

const tier_features = [
  "Free Growth-tier license for every portfolio company",
  "Aggregate fund-level KPI dashboard across all companies",
  "Runway & burn alerts — know before the founder panics",
  "Portfolio benchmark reports (anonymized cross-portfolio data)",
  "Priority onboarding support for portfolio companies",
  "Dedicated fund partner CSM",
  "Co-marketing and LP newsletter features",
  "API access for fund dashboards and portfolio tools",
];

const funds_we_serve = [
  { stage: "Pre-seed / Seed", size: "Up to 50 companies", price: "Free", note: "Full Growth tier" },
  { stage: "Series A / B", size: "50–200 companies", price: "$499/mo", note: "Fund dashboard + portfolio alerts" },
  { stage: "Multi-stage / Growth", size: "200+ companies", price: "Custom", note: "Enterprise SLA + API" },
];

const faqs = [
  { q: "Do portfolio companies need to opt in?", a: "Yes. We send a co-branded invite — companies choose to connect their data. We never pull data without explicit consent." },
  { q: "Is portfolio data shared across companies?", a: "Never. Each company has a fully isolated data environment. Only anonymized benchmark aggregates are available to the fund dashboard." },
  { q: "What integrations do portfolio companies need?", a: "QuickBooks or Xero for accounting, Plaid for banking, and optionally Stripe or Finch for billing/payroll. Most companies connect in under 10 minutes." },
  { q: "Can we white-label HelmCFO for our portfolio?", a: "Yes on the Growth+ fund tier. We can add your fund logo and brand colors to the portfolio company experience." },
];

export default function VCPartnerPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Outfit',sans-serif", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-[15px]">Helm<span style={{ color: "var(--accent)" }}>CFO</span></Link>
          <Link href="/partners" className="text-[13px]" style={{ color: "var(--text-2)" }}>← All Partner Programs</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="mb-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--purple)" }}>VC Portfolio Program</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-[-0.02em] mb-5" style={{ fontFamily: "'DM Serif Display',serif" }}>
            Your portfolio companies<br />deserve a CFO too.
          </h1>
          <p className="text-[16px] max-w-2xl leading-relaxed mb-8" style={{ color: "var(--text-2)" }}>
            Free HelmCFO Growth licenses for every company in your portfolio. You get a fund-level dashboard. They get AI-powered financial intelligence. Everyone wins.
          </p>
          <a href="mailto:partners@helmcfo.com?subject=VC Portfolio Program Application"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold"
            style={{ background: "var(--purple)", color: "white" }}>
            Apply for the program <ArrowRight size={15} />
          </a>
        </div>

        {/* What's included */}
        <div className="rounded-2xl p-8 mb-10" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>What your fund gets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tier_features.map((f) => (
              <div key={f} className="flex items-start gap-2.5 text-[13px]" style={{ color: "var(--text-2)" }}>
                <Check size={13} style={{ color: "var(--purple)", flexShrink: 0, marginTop: 2 }} />{f}
              </div>
            ))}
          </div>
        </div>

        {/* Fund tiers */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Fund tiers</h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                  {["Fund stage","Portfolio size","Fund price","What companies get"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[12px] font-semibold" style={{ color: "var(--text-2)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {funds_we_serve.map((row) => (
                  <tr key={row.stage} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="px-5 py-4 text-[13px] font-medium" style={{ color: "var(--text)" }}>{row.stage}</td>
                    <td className="px-5 py-4 text-[13px]" style={{ color: "var(--text-2)" }}>{row.size}</td>
                    <td className="px-5 py-4 text-[13px] font-bold" style={{ color: "var(--purple)" }}>{row.price}</td>
                    <td className="px-5 py-4 text-[13px]" style={{ color: "var(--text-3)" }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="font-semibold text-[14px] mb-2" style={{ color: "var(--text)" }}>{faq.q}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Apply CTA */}
        <div className="text-center py-10 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Ready to partner?</h3>
          <p className="text-[13px] mb-6" style={{ color: "var(--text-2)" }}>We onboard 2–3 new fund partners per month. Apply early.</p>
          <a href="mailto:partners@helmcfo.com?subject=VC Portfolio Program Application"
            className="px-6 py-3 rounded-xl text-[13px] font-semibold inline-flex items-center gap-2"
            style={{ background: "var(--purple)", color: "white" }}>
            Apply — partners@helmcfo.com <ArrowRight size={14} />
          </a>
        </div>
      </main>
    </div>
  );
}
