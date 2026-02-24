import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Accounting Firm Partner Program",
  description: "Offer AI-powered CFO services to your clients without hiring a CFO. Revenue share, white-label, and dedicated support.",
};

const benefits = [
  "White-label branding — your logo, your colors, your clients",
  "20% revenue share on all referred and managed customers",
  "Dedicated partner portal with multi-client management",
  "Automated client onboarding flows",
  "CPE credit resources and training materials",
  "QuickBooks ProAdvisor integration bridge",
  "Priority support queue for partner firms",
  "Co-marketing — feature in our partner directory",
];

const how_it_works = [
  { step: "01", title: "Apply & get approved", desc: "Submit your firm details. We approve most accounting and bookkeeping firms within 48 hours." },
  { step: "02", title: "Set up your partner portal", desc: "Get a white-labeled dashboard to manage all your client accounts in one place." },
  { step: "03", title: "Invite your clients", desc: "Send co-branded invites. Clients connect their financial data in under 10 minutes." },
  { step: "04", title: "Earn revenue share", desc: "Receive 20% monthly revenue share for every active client you bring on. Paid on Net-30." },
];

const faqs = [
  { q: "What kind of firms can partner?", a: "CPA firms, bookkeeping practices, fractional CFO firms, and financial advisory firms. We also partner with QuickBooks ProAdvisors and Xero Certified Advisors." },
  { q: "Is white-labeling included by default?", a: "White-label branding is available on our Firm Pro plan ($499/mo). The base partner tier gives you a co-branded experience at no cost." },
  { q: "How does the revenue share work?", a: "You earn 20% of the monthly subscription fee for every client you refer and manage. Minimum 12-month revenue share commitment. No cap." },
  { q: "Do clients see HelmCFO branding?", a: "On white-label plans: no, your brand is primary. On standard partner plans: both brands appear. Your choice." },
];

export default function AccountingPartnerPage() {
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
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--green)" }}>Accounting Firm Partner Program</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-[-0.02em] mb-5" style={{ fontFamily: "'DM Serif Display',serif" }}>
            Your clients need a CFO.<br />
            <span style={{ color: "var(--green)" }}>You don&apos;t have to hire one.</span>
          </h1>
          <p className="text-[16px] max-w-2xl leading-relaxed mb-8" style={{ color: "var(--text-2)" }}>
            White-label HelmCFO for your bookkeeping clients. Earn revenue share. Offer strategic financial intelligence without changing your model.
          </p>
          <a href="mailto:partners@helmcfo.com?subject=Accounting Firm Partner Application"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold"
            style={{ background: "var(--green)", color: "white" }}>
            Apply for partnership <ArrowRight size={15} />
          </a>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {how_it_works.map((s) => (
              <div key={s.step} className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-[11px] font-mono font-bold mb-2" style={{ color: "var(--green)" }}>{s.step}</p>
                <p className="font-semibold text-[14px] mb-1.5" style={{ color: "var(--text)" }}>{s.title}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="rounded-2xl p-8 mb-12" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>What partners receive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-2.5 text-[13px]" style={{ color: "var(--text-2)" }}>
                <Check size={13} style={{ color: "var(--green)", flexShrink: 0, marginTop: 2 }} />{b}
              </div>
            ))}
          </div>
        </div>

        {/* Revenue share math */}
        <div className="rounded-2xl p-6 mb-12" style={{ background: "var(--green-dim)", border: "1px solid rgba(16,185,129,0.25)" }}>
          <h3 className="font-bold text-[15px] mb-3" style={{ color: "var(--text)" }}>Revenue share example</h3>
          <p className="text-[13px] mb-4" style={{ color: "var(--text-2)" }}>A firm with 15 Growth-tier clients earns:</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[["15 clients","Growth tier","$799/mo"],["× 20%","Revenue share","$160/client/mo"],["= $2,400/mo","Passive income","$28,800/yr"]].map(([val, label, sub]) => (
              <div key={label}>
                <p className="text-xl font-bold font-mono mb-0.5" style={{ color: "var(--green)" }}>{val}</p>
                <p className="text-[12px] font-medium" style={{ color: "var(--text)" }}>{label}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>FAQs</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="font-semibold text-[14px] mb-2" style={{ color: "var(--text)" }}>{faq.q}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Apply */}
        <div className="text-center py-10 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Start the application</h3>
          <p className="text-[13px] mb-6" style={{ color: "var(--text-2)" }}>Applications reviewed within 48 hours. Most firms go live within a week.</p>
          <a href="mailto:partners@helmcfo.com?subject=Accounting Firm Partner Application"
            className="px-6 py-3 rounded-xl text-[13px] font-semibold inline-flex items-center gap-2"
            style={{ background: "var(--green)", color: "white" }}>
            Apply — partners@helmcfo.com <ArrowRight size={14} />
          </a>
        </div>
      </main>
    </div>
  );
}
