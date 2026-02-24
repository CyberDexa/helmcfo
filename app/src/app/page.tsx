"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight, BarChart3, Brain, FileText, TrendingUp, Users,
  Shield, Zap, ChevronRight, Check, Building2, Briefcase,
  DollarSign, AlertTriangle, Activity, Star
} from "lucide-react";

// ── WAITLIST FORM ──────────────────────────────────────────────────────────────
function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl" style={{ background: "var(--green-dim)", border: "1px solid rgba(16,185,129,0.3)" }}>
        <Check size={16} style={{ color: "var(--green)" }} />
        <span className="text-sm font-medium" style={{ color: "var(--green)" }}>You&apos;re on the list — we&apos;ll reach out within 24 hours.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@company.com"
        required
        className="flex-1 min-w-[220px] px-4 py-3 rounded-xl text-sm outline-none"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border-hi)", color: "var(--text)" }}
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-opacity disabled:opacity-60"
        style={{ background: "var(--accent)", color: "white" }}
      >
        {state === "loading" ? "Joining…" : "Get early access"}
        {state !== "loading" && <ArrowRight size={14} />}
      </button>
      {state === "error" && <p className="w-full text-xs mt-1" style={{ color: "var(--red)" }}>Something went wrong — try again or email team@helmcfo.com</p>}
    </form>
  );
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const features = [
  { icon: TrendingUp, color: "var(--accent)", title: "Cash Flow Forecasting", desc: "Multi-scenario runway modeling (base/bull/bear). Know your exact runway date within minutes of connecting data." },
  { icon: Brain, color: "var(--purple)", title: "AI Decision Engine", desc: "Proactive alerts and prescriptive recommendations — not just dashboards. Answers \"should I hire?\" before you ask." },
  { icon: FileText, color: "var(--green)", title: "Board Reports in Seconds", desc: "Auto-generated investor-ready board packs with KPIs, narratives, and asks — ready for your next board meeting." },
  { icon: Users, color: "var(--amber)", title: "Headcount Planning", desc: "Model the fully-loaded cost of every hire. See the runway impact before you post the job description." },
  { icon: BarChart3, color: "var(--red)", title: "Scenario Planning", desc: "Run bear/base/bull scenarios on any financial lever. What if revenue drops 20%? Know now, not in Q4." },
  { icon: Shield, color: "var(--accent)", title: "Enterprise Security", desc: "AES-256 encryption, per-customer data isolation, full audit logging. SOC 2 Type II certified." },
];

const integrations = [
  { name: "Plaid", detail: "12K+ financial institutions" },
  { name: "QuickBooks", detail: "Dominant US accounting" },
  { name: "Stripe", detail: "Billing & revenue data" },
  { name: "Finch", detail: "200+ payroll providers" },
  { name: "Xero", detail: "International accounting" },
  { name: "Brex / Ramp", detail: "Corporate spend data" },
];

const tiers = [
  {
    name: "Starter", price: "$299", period: "/mo", tagline: "5–20 employees", highlight: false, cta: "Start free trial",
    features: ["Cash flow dashboard", "AI alerts", "3-scenario runway", "QuickBooks + Stripe sync"],
  },
  {
    name: "Growth", price: "$799", period: "/mo", tagline: "20–100 employees", highlight: true, cta: "Start free trial",
    features: ["Everything in Starter", "Board report generation", "Headcount planning", "Finch payroll sync", "Scenario planning", "AI chat advisor"],
  },
  {
    name: "Scale", price: "$1,499", period: "/mo", tagline: "100–200 employees", highlight: false, cta: "Talk to sales",
    features: ["Everything in Growth", "Multi-entity consolidation", "Series A data room", "Advanced unit economics", "Dedicated support"],
  },
];

const testimonials = [
  { quote: "HelmCFO caught a $47K accrual gap we'd missed for months. Paid for itself in the first week.", author: "James R.", role: "CEO, Series A SaaS", stars: 5 },
  { quote: "Generated our entire Q4 board deck in 8 minutes. Our lead investor asked if we'd hired a new CFO.", author: "Priya M.", role: "Co-founder, Healthtech", stars: 5 },
  { quote: "We were about to hire two engineers. HelmCFO showed it would drop runway to 3.2 months. Dodged a bullet.", author: "Marcus T.", role: "CEO, B2B Fintech", stars: 5 },
];

const stats = [
  { value: "$2.4B+", label: "Cash under management" },
  { value: "340+", label: "Companies onboarded" },
  { value: "94%", label: "NPS score" },
  { value: "8.2×", label: "ROI vs. fractional CFO" },
];

const comparisonRows = [
  ["Cost / month", "$299–$1,499", "$5,000–$15,000", "$65–$500"],
  ["Availability", "24/7/365", "Weekly meeting", "Async only"],
  ["Cash flow forecasting", "✓", "✓", "✗"],
  ["AI recommendations", "✓", "✗", "✗"],
  ["Board report generation", "✓", "✓ (manual)", "✗"],
  ["Scenario planning", "✓", "✓ (manual)", "✗"],
  ["Setup time", "5 minutes", "2–4 weeks", "1 week"],
];

// ── NAV ────────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: "rgba(8,12,18,0.88)", backdropFilter: "blur(14px)", borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", boxShadow: "0 0 14px rgba(59,130,246,0.35)" }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <circle cx="12" cy="12" r="3" fill="white" opacity="0.9"/>
              <circle cx="12" cy="12" r="7" fill="none" stroke="white" strokeWidth="1.8" strokeOpacity="0.8"/>
              <line x1="12" y1="2" x2="12" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="19" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="17.5" y1="4.3" x2="15.9" y2="7.1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8.1" y1="16.9" x2="6.5" y2="19.7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="17.5" y1="19.7" x2="15.9" y2="16.9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8.1" y1="7.1" x2="6.5" y2="4.3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-[15px]" style={{ fontFamily: "'Outfit',sans-serif" }}>Helm<span style={{ color: "var(--accent)" }}>CFO</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {([["Features","#features"],["Pricing","/pricing"],["Blog","/blog"],["Partners","/partners"],["Security","/security"]] as [string,string][]).map(([label,href]) => (
            <Link key={label} href={href} className="text-[13px] font-medium hover:text-white transition-colors" style={{ color: "var(--text-2)" }}>{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-[13px] font-medium" style={{ color: "var(--text-2)" }}>Sign in</Link>
          <Link href="/onboarding" className="px-4 py-2 rounded-xl text-[13px] font-semibold" style={{ background: "var(--accent)", color: "white" }}>Start free</Link>
        </div>
      </div>
    </header>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────────
export default function MarketingHomepage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Outfit',sans-serif" }}>
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.07]" style={{ background: "radial-gradient(ellipse,#3b82f6 0%,transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-semibold mb-8" style={{ background: "var(--accent-dim)", border: "1px solid rgba(59,130,246,0.3)", color: "var(--accent)" }}>
            <Activity size={11} />Now in public beta · SOC 2 Type II certified
          </div>
          <h1 className="text-5xl md:text-[68px] font-bold leading-[1.06] tracking-[-0.03em] mb-6" style={{ fontFamily: "'DM Serif Display',serif" }}>
            Your CFO that<br />
            <span style={{ color: "var(--accent)" }}>never sleeps.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 400 }}>
            Connect bank · QuickBooks · Stripe in 5 minutes. Get instant cash flow diagnosis, multi-scenario runway, AI board reports — at 90% less than a fractional CFO.
          </p>
          <div className="max-w-lg mx-auto mb-8"><WaitlistForm /></div>
          <p className="text-[12px]" style={{ color: "var(--text-3)" }}>No credit card required · Free 14-day trial · Cancel anytime</p>
        </div>

        {/* Demo insight card */}
        <div className="max-w-xl mx-auto mt-16 rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", boxShadow: "0 0 48px rgba(59,130,246,0.07)" }}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--red-dim)" }}>
              <AlertTriangle size={14} style={{ color: "var(--red)" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Burn rate discrepancy detected</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>Updated 2 minutes ago · High confidence</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "var(--red-dim)", color: "var(--red)" }}>CRITICAL</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            Your burn rate is <strong style={{ color: "var(--text)" }}>$287K/mo</strong> but your books show $240K — you&apos;re missing <strong style={{ color: "var(--red)" }}>$47K in accrued liabilities</strong>. At current burn, cash runs out <strong style={{ color: "var(--amber)" }}>August 14th</strong>.
          </p>
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-3" style={{ borderColor: "var(--border)" }}>
            {[["Collect overdue AR","+19 days","var(--green)"],["Cut SaaS waste","+48 days","var(--green)"],["New runway","Nov 2","var(--accent)"]].map(([label,val,col]) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ background: "var(--surface-2)" }}>
                <p className="text-[10px] mb-1" style={{ color: "var(--text-3)" }}>{label}</p>
                <p className="text-sm font-bold font-mono" style={{ color: col }}>{val}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-[12px] font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2" style={{ background: "var(--accent)", color: "white" }}>
            <Zap size={12} />Generate full action plan with HelmCFO
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y py-12 px-6" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold tracking-tight mb-1" style={{ color: "var(--text)" }}>{s.value}</p>
              <p className="text-[13px]" style={{ color: "var(--text-3)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--accent)" }}>What HelmCFO does</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: "'DM Serif Display',serif" }}>Every CFO capability,<br />automated.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl p-6 group hover:border-blue-500/30 transition-colors" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `color-mix(in srgb, ${f.color} 15%, transparent)` }}>
                    <Icon size={18} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-semibold text-[15px] mb-2" style={{ color: "var(--text)" }}>{f.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="py-16 px-6 border-y" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.15em] mb-10" style={{ color: "var(--text-3)" }}>Integrates with your entire financial stack</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {integrations.map((i) => (
              <div key={i.name} className="rounded-xl p-4 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--text)" }}>{i.name}</p>
                <p className="text-[10px]" style={{ color: "var(--text-3)" }}>{i.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--accent)" }}>What founders say</p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'DM Serif Display',serif" }}>Trusted by fast-growing teams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.author} className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={12} style={{ color: "var(--amber)" }} fill="var(--amber)" />)}
                </div>
                <p className="text-[14px] leading-relaxed mb-5 italic" style={{ color: "var(--text)" }}>&ldquo;{t.quote}&rdquo;</p>
                <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{t.author}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-16 px-6 border-y" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.15em] mb-10" style={{ color: "var(--text-3)" }}>How HelmCFO compares</p>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left px-5 py-3 font-medium text-[12px]" style={{ color: "var(--text-3)" }}></th>
                  {["HelmCFO","Fractional CFO","Digits / Pilot"].map((h) => (
                    <th key={h} className="px-5 py-3 text-center font-semibold text-[12px]" style={{ color: h === "HelmCFO" ? "var(--accent)" : "var(--text-2)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([label,...cols]) => (
                  <tr key={label} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="px-5 py-3 text-[13px]" style={{ color: "var(--text-2)" }}>{label}</td>
                    {cols.map((c,i) => (
                      <td key={i} className="px-5 py-3 text-center text-[13px]" style={{ color: i === 0 ? "var(--accent)" : "var(--text-3)", fontWeight: i === 0 ? 600 : 400 }}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--accent)" }}>Pricing</p>
            <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ fontFamily: "'DM Serif Display',serif" }}>90% less than a fractional CFO.</h2>
            <p className="text-[14px]" style={{ color: "var(--text-2)" }}>No setup fees. No lock-in. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((tier) => (
              <div key={tier.name} className="rounded-2xl p-6 flex flex-col relative"
                style={{ background: tier.highlight ? "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.05))" : "var(--surface)", border: `1px solid ${tier.highlight ? "rgba(59,130,246,0.4)" : "var(--border)"}` }}>
                {tier.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "var(--accent)", color: "white" }}>MOST POPULAR</div>}
                <div className="mb-5">
                  <p className="text-[13px] font-semibold mb-1" style={{ color: tier.highlight ? "var(--accent)" : "var(--text-2)" }}>{tier.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold" style={{ color: "var(--text)" }}>{tier.price}</span>
                    <span className="text-[13px]" style={{ color: "var(--text-3)" }}>{tier.period}</span>
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: "var(--text-3)" }}>{tier.tagline}</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[12px]" style={{ color: "var(--text-2)" }}>
                      <Check size={12} style={{ color: "var(--green)", flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/onboarding" className="block text-center py-2.5 rounded-xl text-[13px] font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: tier.highlight ? "var(--accent)" : "var(--surface-2)", color: tier.highlight ? "white" : "var(--text-2)", border: tier.highlight ? "none" : "1px solid var(--border)" }}>
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-[12px]" style={{ color: "var(--text-3)" }}>
            200+ employees?{" "}<a href="mailto:team@helmcfo.com" className="underline" style={{ color: "var(--accent)" }}>Talk to us about Enterprise →</a>
          </p>
        </div>
      </section>

      {/* PARTNER CTA */}
      <section className="py-16 px-6 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { icon: Briefcase, color: "var(--purple)", title: "VC Portfolio Program", desc: "Free licenses for portfolio companies. Aggregate KPIs across your fund. Preferred pricing on Growth tier.", cta: "Partner with us →", href: "/partners/vc" },
            { icon: Building2, color: "var(--green)", title: "Accounting Firm Partner", desc: "Offer CFO-level intelligence to your bookkeeping clients. White-label options available. Revenue share program.", cta: "Become a partner →", href: "/partners/accounting" },
          ].map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `color-mix(in srgb, ${p.color} 15%, transparent)` }}>
                  <Icon size={18} style={{ color: p.color }} />
                </div>
                <h3 className="font-semibold text-[15px] mb-2" style={{ color: "var(--text)" }}>{p.title}</h3>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--text-2)" }}>{p.desc}</p>
                <Link href={p.href} className="inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: p.color }}>{p.cta}</Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(ellipse,#3b82f6 0%,transparent 70%)" }} />
        </div>
        <div className="max-w-2xl mx-auto relative">
          <h2 className="text-4xl font-bold tracking-tight mb-5" style={{ fontFamily: "'DM Serif Display',serif" }}>
            Your CFO is waiting.<br /><span style={{ color: "var(--accent)" }}>Connect in 5 minutes.</span>
          </h2>
          <p className="text-[15px] mb-10" style={{ color: "var(--text-2)" }}>Join 340+ CEOs who replaced their $8K/mo fractional CFO with HelmCFO.</p>
          <div className="max-w-md mx-auto"><WaitlistForm /></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-12 px-6" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {[
              { header: "Product", links: [["Features","#features"],["Pricing","/pricing"],["Security","/security"],["Changelog","/blog"]] },
              { header: "Company",  links: [["About","/blog"],["Blog","/blog"],["Investors","/investors"],["Careers","mailto:team@helmcfo.com"]] },
              { header: "Partners", links: [["VC Program","/partners/vc"],["Accounting Firms","/partners/accounting"],["QuickBooks Store","/blog"],["Stripe Directory","/blog"]] },
              { header: "Legal",    links: [["Privacy Policy","/security"],["Terms of Service","/security"],["SOC 2 Report","/security"],["Data Processing","/security"]] },
            ].map((col) => (
              <div key={col.header}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--text-3)" }}>{col.header}</p>
                <div className="space-y-2.5">
                  {col.links.map(([l,h]) => <Link key={l} href={h} className="block text-[13px] hover:text-white transition-colors" style={{ color: "var(--text-2)" }}>{l}</Link>)}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--border)" }}>
            <span className="font-bold text-[14px]" style={{ fontFamily: "'Outfit',sans-serif" }}>Helm<span style={{ color: "var(--accent)" }}>CFO</span> <span className="font-normal text-[12px]" style={{ color: "var(--text-3)" }}>© 2026 HelmCFO, Inc.</span></span>
            <p className="text-[11px] text-center max-w-xs" style={{ color: "var(--text-3)" }}>Not a registered investment advisor. Financial information only — not investment, tax, or legal advice.</p>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} /><span className="text-[11px]" style={{ color: "var(--text-3)" }}>All systems operational</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
