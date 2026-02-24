"use client";

import { Check, Zap } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: 299,
    target: "5–20 employees",
    tagline: "Competes with Digits",
    color: "#60a5fa",
    features: [
      "Real-time cash flow dashboard",
      "Burn rate & runway tracking",
      "Connect bank account (Plaid)",
      "Basic AI alerts",
      "Board-ready KPI snapshot",
      "1 integration (Plaid or Stripe)",
    ],
    cta: "Start free trial",
    popular: false,
  },
  {
    name: "Growth",
    price: 799,
    target: "20–100 employees",
    tagline: "Replaces $5–10K/mo fractional CFO",
    color: "#3b82f6",
    features: [
      "Everything in Starter",
      "AI Advisor — unlimited questions",
      "Multi-scenario planning (bear/base/bull)",
      "AI board report generation",
      "Headcount planning & cost modelling",
      "Connect Stripe, QuickBooks, Gusto",
      "AR/AP optimisation recommendations",
      "Expense audit & SaaS spend tracker",
      "Fundraising data room export",
      "Weekly CFO digest email",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Scale",
    price: 1499,
    target: "100–200 employees",
    tagline: "Replaces $10–15K/mo fractional CFO",
    color: "#8b5cf6",
    features: [
      "Everything in Growth",
      "Multi-entity consolidation",
      "Advanced Monte Carlo forecasting",
      "Custom financial models",
      "SOC 2 audit trail & access controls",
      "Priority support + onboarding call",
      "API access for BI tools",
      "Dedicated Slack channel",
    ],
    cta: "Talk to us",
    popular: false,
  },
];

const faqs = [
  {
    q: "Do I need to give HelmCFO access to my bank?",
    a: "We use Plaid — the same technology used by Coinbase, Venmo, and thousands of fintechs. Read-only access. You can disconnect at any time.",
  },
  {
    q: "How is this different from Digits or Pilot?",
    a: "Digits does your books. Pilot uses expensive humans. HelmCFO makes strategic decisions: when do you run out of cash, should you hire, what do you tell your board? 24/7, no waiting for a monthly meeting.",
  },
  {
    q: "Is my financial data safe?",
    a: "All data is encrypted at rest (AES-256-GCM) and in transit (TLS 1.3). Your data never trains any AI model. We're pursuing SOC 2 Type II certification.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — monthly billing, cancel anytime and keep full data export. No lock-in.",
  },
  {
    q: "What if I need human CFO help?",
    a: "For high-stakes decisions (M&A, board negotiations, fundraising strategy), we'll soon offer on-demand escalation to a network of fractional CFOs at hourly rates.",
  },
];

export default function PricingPage() {
  return (
    <div className="p-6 space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold" style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(59,130,246,0.25)" }}>
          <Zap size={11} />
          Same intelligence as a $10K/mo CFO. 90% less cost.
        </div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Simple, transparent pricing</h1>
        <p className="text-[15px]" style={{ color: "var(--text-2)" }}>
          Start free for 14 days. No credit card required.
        </p>
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-3 gap-5">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="rounded-2xl p-6 flex flex-col relative"
            style={{
              background: tier.popular ? "var(--surface-2)" : "var(--surface)",
              border: tier.popular ? `1px solid ${tier.color}50` : "1px solid var(--border)",
              boxShadow: tier.popular ? `0 0 40px ${tier.color}10` : undefined,
            }}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: tier.color, color: "#fff" }}>
                Most Popular
              </div>
            )}
            <div className="mb-5">
              <h2 className="text-lg font-bold mb-0.5" style={{ color: tier.color }}>{tier.name}</h2>
              <p className="text-[11px] mb-4" style={{ color: "var(--text-3)" }}>{tier.target}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>${tier.price.toLocaleString()}</span>
                <span className="text-[13px]" style={{ color: "var(--text-3)" }}>/mo</span>
              </div>
              <p className="text-[12px] mt-1.5" style={{ color: "var(--text-2)" }}>{tier.tagline}</p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-6">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[12px]" style={{ color: "var(--text-2)" }}>
                  <Check size={13} className="mt-0.5 shrink-0" style={{ color: tier.color }} />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/onboarding"
              className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-center transition-opacity hover:opacity-80 block"
              style={{
                background: tier.popular ? tier.color : "var(--surface-3)",
                color: tier.popular ? "#fff" : "var(--text)",
                border: tier.popular ? "none" : "1px solid var(--border)",
              }}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Enterprise row */}
      <div className="rounded-2xl p-6 flex items-center justify-between" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div>
          <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--text)" }}>Enterprise</h3>
          <p className="text-[13px]" style={{ color: "var(--text-2)" }}>200+ employees · Multi-entity · AI + human CFO hybrid · Custom integrations</p>
        </div>
        <a href="mailto:team@helmcfo.com" className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80" style={{ background: "var(--accent)", color: "#fff" }}>
          Contact sales
        </a>
      </div>

      {/* Comparison callout */}
      <div className="rounded-2xl p-6 text-center" style={{ background: "var(--accent-dim)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <p className="text-[13px] font-medium" style={{ color: "var(--text-2)" }}>
          A fractional CFO typically costs <strong style={{ color: "var(--text)" }}>$5,000–$15,000/month</strong>.
          HelmCFO Growth is <strong style={{ color: "var(--accent)" }}>$799/month</strong> — and never misses a number.
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--text)" }}>{faq.q}</p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
