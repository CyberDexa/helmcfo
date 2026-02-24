import Link from "next/link";
import { Briefcase, Building2, ChevronRight, Check } from "lucide-react";

export const metadata = {
  title: "Partner Programs",
  description: "Partner with HelmCFO — VC portfolio programs and accounting firm partnerships.",
};

const programs = [
  {
    icon: Briefcase,
    color: "var(--purple)",
    title: "VC Portfolio Program",
    tagline: "Free CFO intelligence for every portfolio company.",
    desc: "Partner with HelmCFO to give every company in your portfolio access to autonomous financial intelligence. Aggregate KPIs across your entire fund, spot at-risk companies early, and help your portfolio grow faster.",
    benefits: [
      "Free Growth-tier licenses for all portfolio companies",
      "Aggregate fund-level KPI dashboard",
      "Early warning alerts for at-risk companies",
      "Portfolio benchmark reports",
      "Priority support and dedicated CSM",
      "Co-marketing + LP newsletter features",
    ],
    cta: "Apply for VC program",
    href: "/partners/vc",
  },
  {
    icon: Building2,
    color: "var(--green)",
    title: "Accounting Firm Partner",
    tagline: "Upsell CFO services without hiring a CFO.",
    desc: "Accounting firms and bookkeeping practices can offer AI-powered financial strategy to clients — without the overhead. White-label the platform under your brand, earn revenue share, and deepen client relationships.",
    benefits: [
      "White-label branding options",
      "20% revenue share on referred customers",
      "Dedicated partner portal",
      "Client onboarding automation",
      "CPE credit resources",
      "QuickBooks ProAdvisor partnership bridge",
    ],
    cta: "Apply for firm partnership",
    href: "/partners/accounting",
  },
];

export default function PartnersPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Outfit',sans-serif", minHeight: "100vh" }}>
      {/* Nav */}
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-[15px]" style={{ fontFamily: "'Outfit',sans-serif" }}>
            Helm<span style={{ color: "var(--accent)" }}>CFO</span>
          </Link>
          <Link href="/onboarding" className="px-4 py-2 rounded-xl text-[13px] font-semibold" style={{ background: "var(--accent)", color: "white" }}>Start free</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--accent)" }}>Partner Programs</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "'DM Serif Display',serif" }}>
            Grow with HelmCFO.
          </h1>
          <p className="text-[15px] max-w-xl mx-auto" style={{ color: "var(--text-2)" }}>
            Two partnership tracks — for VC funds and for accounting/bookkeeping firms. Both designed for mutual growth and shared success.
          </p>
        </div>

        {/* Program cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-2xl p-8 flex flex-col" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `color-mix(in srgb, ${p.color} 15%, transparent)` }}>
                  <Icon size={22} style={{ color: p.color }} />
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>{p.title}</h2>
                <p className="text-[13px] font-medium mb-4" style={{ color: p.color }}>{p.tagline}</p>
                <p className="text-[13px] leading-relaxed mb-6" style={{ color: "var(--text-2)" }}>{p.desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--text-2)" }}>
                      <Check size={13} style={{ color: p.color, flexShrink: 0, marginTop: 2 }} />{b}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className="flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold"
                  style={{ background: `color-mix(in srgb, ${p.color} 20%, transparent)`, color: p.color, border: `1px solid color-mix(in srgb, ${p.color} 30%, transparent)` }}>
                  {p.cta} <ChevronRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Questions CTA */}
        <div className="mt-12 text-center py-10 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-[15px] font-semibold mb-2" style={{ color: "var(--text)" }}>Not sure which track fits?</p>
          <p className="text-[13px] mb-5" style={{ color: "var(--text-2)" }}>Our team will help you find the right structure.</p>
          <a href="mailto:partners@helmcfo.com" className="px-6 py-2.5 rounded-xl text-[13px] font-semibold inline-flex items-center gap-2"
            style={{ background: "var(--accent)", color: "white" }}>
            Email partners@helmcfo.com
          </a>
        </div>
      </main>
    </div>
  );
}
