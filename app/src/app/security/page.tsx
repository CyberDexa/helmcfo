import Link from "next/link";
import { Shield, Lock, Eye, Server, FileCheck, AlertCircle, Check } from "lucide-react";
import { controls, getControlsSummary, type ControlStatus } from "@/lib/security/soc2/controls";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Trust",
  description: "HelmCFO's security architecture, SOC 2 Type II status, compliance controls, and data handling practices.",
};

const pillars = [
  { icon: Lock, color: "var(--accent)", title: "AES-256-GCM Encryption", desc: "All customer financial data encrypted at rest with AES-256-GCM. Integration tokens encrypted before storage." },
  { icon: Eye, color: "var(--purple)", title: "Per-Tenant Data Isolation", desc: "Architecturally impossible for one customer to see another's data. Enforced at the database, API, and AI layer." },
  { icon: Server, color: "var(--green)", title: "Audit Logging", desc: "Every API call logged with event type, user, tenant, and timestamp. Retained 90 days. Exportable on request." },
  { icon: Shield, color: "var(--amber)", title: "TLS 1.3 in Transit", desc: "All data in transit encrypted. HSTS enforced. Certificate Transparency monitoring enabled." },
  { icon: FileCheck, color: "var(--accent)", title: "SOC 2 Type II", desc: "Currently in compliance audit window (Feb 2026 – Feb 2027). Available to customers on request post-certification." },
  { icon: AlertCircle, color: "var(--red)", title: "Incident Response", desc: "Documented IR plan. Breach notification SLA: 72 hours (GDPR-aligned). Designated incident commander." },
];

const statusColors: Record<ControlStatus, string> = {
  "implemented": "var(--green)",
  "in-progress": "var(--amber)",
  "planned": "var(--text-3)",
  "not-applicable": "var(--text-3)",
};

const statusLabels: Record<ControlStatus, string> = {
  "implemented": "Implemented",
  "in-progress": "In Progress",
  "planned": "Planned",
  "not-applicable": "N/A",
};

export default function SecurityPage() {
  const summary = getControlsSummary();
  const implementedCount = summary.byStatus.implemented;

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Outfit',sans-serif", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-[15px]">Helm<span style={{ color: "var(--accent)" }}>CFO</span></Link>
          <Link href="/onboarding" className="px-4 py-2 rounded-xl text-[13px] font-semibold" style={{ background: "var(--accent)", color: "white" }}>Start free</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--accent)" }}>Security & Trust</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "'DM Serif Display',serif" }}>
            Bank-grade security.<br />Built from day one.
          </h1>
          <p className="text-[15px] max-w-2xl leading-relaxed" style={{ color: "var(--text-2)" }}>
            Your financial data is the most sensitive data your company generates. We treat it that way — with AES-256 encryption, complete tenant isolation, full audit logging, and SOC 2 Type II compliance in progress.
          </p>
        </div>

        {/* SOC 2 Progress */}
        <div className="rounded-2xl p-6 mb-10" style={{ background: "var(--surface)", border: "1px solid var(--border-hi)" }}>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--amber)" }} />
                <span className="text-[13px] font-semibold" style={{ color: "var(--amber)" }}>SOC 2 Type II — Audit In Progress</span>
              </div>
              <p className="text-[13px]" style={{ color: "var(--text-2)" }}>Audit window: Feb 2026 – Feb 2027. Expected certification: Q1 2027.</p>
              <p className="text-[12px] mt-1" style={{ color: "var(--text-3)" }}>SOC 2 Type I achieved January 2026. Type II report available upon certification.</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold font-mono" style={{ color: "var(--text)" }}>{summary.completionPct}%</p>
              <p className="text-[12px]" style={{ color: "var(--text-3)" }}>controls implemented</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>{implementedCount} of {summary.total} controls</p>
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full" style={{ background: "var(--surface-3)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${summary.completionPct}%`, background: "linear-gradient(90deg,var(--accent),var(--green))" }} />
          </div>
        </div>

        {/* Security pillars */}
        <div className="mb-14">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Security architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: `color-mix(in srgb, ${p.color} 15%, transparent)` }}>
                    <Icon size={16} style={{ color: p.color }} />
                  </div>
                  <h3 className="font-semibold text-[14px] mb-1.5" style={{ color: "var(--text)" }}>{p.title}</h3>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-2)" }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls table */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>SOC 2 Controls Framework</h2>
            <div className="flex items-center gap-4 text-[12px]">
              {(Object.entries(statusLabels) as [ControlStatus, string][]).map(([status, label]) => (
                <span key={status} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: statusColors[status] }} />
                  <span style={{ color: "var(--text-3)" }}>{label} ({summary.byStatus[status] || 0})</span>
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                  {["Control ID", "Category", "Title", "Owner", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {controls.map((control) => (
                  <tr key={control.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="px-4 py-3 font-mono text-[12px]" style={{ color: "var(--accent)" }}>{control.id}</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: "var(--text-3)" }}>{control.category}</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: "var(--text)" }}>{control.title}</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: "var(--text-3)" }}>{control.owner}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                        {control.status === "implemented" && <Check size={11} style={{ color: statusColors[control.status] }} />}
                        <span style={{ color: statusColors[control.status] }}>{statusLabels[control.status]}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data handling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="font-bold text-[15px] mb-4" style={{ color: "var(--text)" }}>What data we store</h3>
            <ul className="space-y-2">
              {["Bank transaction data (via Plaid read-only)", "General ledger data (via QuickBooks / Xero)", "Revenue and billing data (via Stripe)", "Payroll aggregate data (via Finch)", "AI-generated analysis and recommendations"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px]" style={{ color: "var(--text-2)" }}>
                  <Check size={11} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="font-bold text-[15px] mb-4" style={{ color: "var(--text)" }}>What we never do</h3>
            <ul className="space-y-2">
              {["Move, transfer, or initiate transactions on your behalf", "Share your data between customers (ever)", "Train AI models on your specific financial data", "Sell or share data with third parties for marketing", "Store raw credentials — only encrypted OAuth tokens"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px]" style={{ color: "var(--text-2)" }}>
                  <span className="text-[10px] font-bold mt-0.5" style={{ color: "var(--red)", flexShrink: 0 }}>✗</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Responsible disclosure */}
        <div className="rounded-2xl p-6 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h3 className="font-bold text-[15px] mb-2" style={{ color: "var(--text)" }}>Report a security issue</h3>
          <p className="text-[13px] mb-4" style={{ color: "var(--text-2)" }}>We run a responsible disclosure program. Qualifying reports receive $500–$5,000 in bounties.</p>
          <a href="mailto:security@helmcfo.com" className="text-[13px] font-semibold" style={{ color: "var(--accent)" }}>security@helmcfo.com →</a>
        </div>
      </main>
    </div>
  );
}
