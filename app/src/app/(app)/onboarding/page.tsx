"use client";

import { useState } from "react";
import { CheckCircle, Circle, ArrowRight, Building2, CreditCard, Briefcase, Cpu } from "lucide-react";

const STEPS = [
  {
    id: "company",
    icon: Building2,
    title: "Your company",
    desc: "Tell us the basics so HelmCFO can calibrate its analysis.",
  },
  {
    id: "banking",
    icon: CreditCard,
    title: "Connect bank",
    desc: "Read-only bank connection via Plaid. See cash & burn in seconds.",
  },
  {
    id: "accounting",
    icon: Briefcase,
    title: "Connect accounting",
    desc: "QuickBooks or Xero. Pulls P&L, balance sheet, and AR.",
  },
  {
    id: "ai",
    icon: Cpu,
    title: "AI first run",
    desc: "HelmCFO analyses your data and surfaces your first insights.",
  },
];

interface CompanyForm {
  name: string;
  stage: string;
  headcount: string;
  mrr: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [company, setCompany] = useState<CompanyForm>({ name: "", stage: "seed", headcount: "", mrr: "" });
  const [bankConnected, setBankConnected] = useState(false);
  const [accountingConnected, setAccountingConnected] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [aiRunning, setAiRunning] = useState(false);

  const markDone = (i: number) => {
    setCompleted((prev) => new Set([...prev, i]));
    if (i < STEPS.length - 1) setStep(i + 1);
  };

  const runAI = async () => {
    setAiRunning(true);
    await new Promise((r) => setTimeout(r, 2000));
    setAiDone(true);
    setAiRunning(false);
    markDone(3);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Get started with HelmCFO</h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--text-2)" }}>Connect your data sources in under 5 minutes.</p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <button
              onClick={() => setStep(i)}
              className="flex flex-col items-center gap-1.5 flex-1 text-center"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: completed.has(i) ? "var(--green)" : i === step ? "var(--accent)" : "var(--surface-3)",
                  border: i === step && !completed.has(i) ? "1px solid rgba(59,130,246,0.3)" : "none",
                }}>
                {completed.has(i)
                  ? <CheckCircle size={16} color="#fff" />
                  : <Circle size={16} color={i === step ? "#fff" : "#4f5b72"} />
                }
              </div>
              <span className="text-[10px] font-medium leading-tight" style={{ color: i === step ? "var(--text)" : "var(--text-3)" }}>
                {s.title}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className="h-px flex-1 mx-1 mb-5" style={{ background: completed.has(i) ? "var(--green)" : "var(--border)" }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {/* Step 0 — Company info */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-[15px] font-semibold mb-0.5" style={{ color: "var(--text)" }}>Tell us about your company</h2>
              <p className="text-[12px]" style={{ color: "var(--text-3)" }}>This helps calibrate benchmarks and scenario defaults.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-2)" }}>Company name</label>
                <input
                  type="text"
                  value={company.name}
                  onChange={(e) => setCompany((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Acme Corp"
                  className="w-full px-3 py-2 rounded-xl text-[13px] outline-none"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-2)" }}>Stage</label>
                  <select
                    value={company.stage}
                    onChange={(e) => setCompany((p) => ({ ...p, stage: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-[13px] outline-none"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                  >
                    <option value="pre-seed">Pre-seed</option>
                    <option value="seed">Seed</option>
                    <option value="series-a">Series A</option>
                    <option value="series-b">Series B+</option>
                    <option value="profitable">Profitable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-2)" }}>Headcount</label>
                  <input
                    type="number"
                    value={company.headcount}
                    onChange={(e) => setCompany((p) => ({ ...p, headcount: e.target.value }))}
                    placeholder="25"
                    className="w-full px-3 py-2 rounded-xl text-[13px] outline-none"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-2)" }}>Monthly Recurring Revenue (MRR)</label>
                <input
                  type="number"
                  value={company.mrr}
                  onChange={(e) => setCompany((p) => ({ ...p, mrr: e.target.value }))}
                  placeholder="50000"
                  className="w-full px-3 py-2 rounded-xl text-[13px] outline-none"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </div>
            </div>
            <button
              onClick={() => markDone(0)}
              disabled={!company.name || !company.headcount}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Continue <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Step 1 — Connect bank */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-[15px] font-semibold mb-0.5" style={{ color: "var(--text)" }}>Connect your bank account</h2>
              <p className="text-[12px]" style={{ color: "var(--text-3)" }}>Read-only via Plaid. Supports 12,000+ financial institutions. Disconnect anytime.</p>
            </div>
            {bankConnected ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
                <CheckCircle size={16} style={{ color: "var(--green)" }} />
                <span className="text-[13px] font-medium" style={{ color: "var(--green)" }}>Bank connected successfully</span>
              </div>
            ) : (
              <button
                onClick={() => { setBankConnected(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Connect with Plaid <ArrowRight size={14} />
              </button>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => markDone(1)}
                disabled={!bankConnected}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Continue <ArrowRight size={14} />
              </button>
              <button
                onClick={() => markDone(1)}
                className="px-5 py-2.5 rounded-xl text-[13px] font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--text-3)" }}
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Connect accounting */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-[15px] font-semibold mb-0.5" style={{ color: "var(--text)" }}>Connect your accounting software</h2>
              <p className="text-[12px]" style={{ color: "var(--text-3)" }}>Pulls P&L, balance sheet, and AR for richer analysis.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["QuickBooks Online", "Xero (coming soon)"].map((name) => (
                <button
                  key={name}
                  onClick={() => { if (!name.includes("coming")) setAccountingConnected(true); }}
                  disabled={name.includes("coming") || accountingConnected}
                  className="p-4 rounded-xl text-left transition-opacity hover:opacity-80 disabled:opacity-40"
                  style={{ background: "var(--surface-2)", border: `1px solid ${accountingConnected && !name.includes("coming") ? "var(--green)" : "var(--border)"}` }}
                >
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>
                    {name.includes("coming") ? "Coming soon" : "OAuth 2.0 · Read-only"}
                  </p>
                </button>
              ))}
            </div>
            {accountingConnected && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
                <CheckCircle size={16} style={{ color: "var(--green)" }} />
                <span className="text-[13px] font-medium" style={{ color: "var(--green)" }}>QuickBooks connected</span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => markDone(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {accountingConnected ? "Continue" : "Skip for now"} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — AI first run */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-[15px] font-semibold mb-0.5" style={{ color: "var(--text)" }}>AI first analysis</h2>
              <p className="text-[12px]" style={{ color: "var(--text-3)" }}>HelmCFO will analyse your data and surface the most important insights.</p>
            </div>
            {aiDone ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
                  <CheckCircle size={16} style={{ color: "var(--green)" }} />
                  <span className="text-[13px] font-medium" style={{ color: "var(--green)" }}>Analysis complete — your dashboard is ready</span>
                </div>
                <a
                  href="/"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80 w-fit"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  Go to dashboard <ArrowRight size={14} />
                </a>
              </div>
            ) : (
              <button
                onClick={() => void runAI()}
                disabled={aiRunning}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80 disabled:opacity-60"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {aiRunning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analysing…
                  </>
                ) : (
                  <> Run first analysis <ArrowRight size={14} /></>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Skip all */}
      {!completed.has(3) && (
        <div className="text-center">
          <a href="/" className="text-[12px] transition-opacity hover:opacity-70" style={{ color: "var(--text-3)" }}>
            Skip setup and explore with demo data →
          </a>
        </div>
      )}
    </div>
  );
}
