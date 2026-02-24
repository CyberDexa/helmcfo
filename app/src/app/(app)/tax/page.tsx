"use client";

import { useState } from "react";
import { Calculator, CheckCircle, DollarSign, FileText, ExternalLink, AlertCircle, ChevronRight } from "lucide-react";

// ── R&D CREDIT CALCULATOR ────────────────────────────────────────────────────

interface RDInputs {
  wages: number;          // W-2 wages for qualified employees
  contractorCosts: number; // 65% of US contractor costs are eligible
  supplies: number;       // qualified supplies
  cloudCompute: number;   // cloud/compute costs for R&D
}

interface RDResult {
  qualifiedResearchExpenses: number;
  federalCredit: number;           // 20% of QREs above base amount; simplified: 14% of QREs
  startupCredit: number;           // 6% credit for early-stage (<5yr profitable)
  payrollOffset: number;           // startups can offset up to $500K of employer payroll taxes
  annualSavings: number;
  threeYearValue: number;
}

function calculateRDCredit(inputs: RDInputs): RDResult {
  const qre =
    inputs.wages +
    inputs.contractorCosts * 0.65 +
    inputs.supplies +
    inputs.cloudCompute * 0.65;

  // Simplified method: 14% of QREs above 50% of 3-yr average (we approximate as 14% flat for MVP)
  const federalCredit = Math.round(qre * 0.14);

  // Startup credit (Section 41(h)): 6% of QREs for companies <5 years profitable
  const startupCredit = Math.round(qre * 0.06);

  // Payroll offset: up to $500K/yr of employer FICA taxes offset by R&D credit
  const payrollOffset = Math.min(startupCredit, 500_000);

  const annualSavings = payrollOffset;
  const threeYearValue = annualSavings * 3;

  return { qualifiedResearchExpenses: Math.round(qre), federalCredit, startupCredit, payrollOffset, annualSavings, threeYearValue };
}

// ── TAX STRATEGIES ────────────────────────────────────────────────────────────

interface TaxStrategy {
  id: string;
  title: string;
  description: string;
  potentialSavings: string;
  complexity: "low" | "medium" | "high";
  actionItems: string[];
  eligibility: string;
}

const STRATEGIES: TaxStrategy[] = [
  {
    id: "rd-credits",
    title: "R&D Tax Credits (Section 41)",
    description: "Claim federal and state R&D credits for software development, product R&D, and qualified research activities.",
    potentialSavings: "$50K – $500K/yr",
    complexity: "medium",
    eligibility: "Companies with US-based tech employees or contractors doing product development.",
    actionItems: [
      "Document qualified research activities for each engineer/PM",
      "Track time allocation across projects",
      "Engage R&D credit specialist CPA (typically contingency fee)",
      "File Form 6765 with corporate return",
    ],
  },
  {
    id: "section-179",
    title: "Section 179 Equipment Deduction",
    description: "Deduct the full cost of qualifying equipment and software in the year purchased, rather than depreciating over time.",
    potentialSavings: "$10K – $1M/yr",
    complexity: "low",
    eligibility: "Businesses purchasing equipment, software, or leasehold improvements.",
    actionItems: [
      "Identify all capital purchases in the current tax year",
      "Elect Section 179 on Form 4562",
      "Limit: $1.16M deduction (2024), phases out above $2.89M",
    ],
  },
  {
    id: "qbi-deduction",
    title: "Qualified Business Income (QBI) Deduction",
    description: "Pass-through entities (S-corps, LLCs) may deduct up to 20% of qualified business income.",
    potentialSavings: "Up to 20% reduction in taxable income",
    complexity: "medium",
    eligibility: "S-corps and single-member/multi-member LLCs with net income <$315K (2024 phase-out).",
    actionItems: [
      "Confirm entity structure qualifies",
      "Calculate QBI using Form 8995",
      "Review W-2 wage limitations if income >$315K",
    ],
  },
  {
    id: "hiring-credits",
    title: "Work Opportunity Tax Credit (WOTC)",
    description: "Federal tax credit for hiring employees from certain targeted groups (veterans, long-term unemployed, etc.)",
    potentialSavings: "$2,400 – $9,600 per eligible hire",
    complexity: "low",
    eligibility: "Any US company hiring from WOTC target groups.",
    actionItems: [
      "Screen new hires using IRS Form 8850 pre-screening",
      "Submit to state workforce agency within 28 days of hire",
      "Claim credit on Form 5884",
    ],
  },
  {
    id: "cost-segregation",
    title: "Cost Segregation Study",
    description: "Accelerate depreciation on leasehold improvements and commercial property by reclassifying components.",
    potentialSavings: "$50K – $500K in deferred taxes",
    complexity: "high",
    eligibility: "Companies with $500K+ in leasehold improvements or recently built/acquired property.",
    actionItems: [
      "Commission a cost segregation study (~$5K–$15K)",
      "Engineer identifies 5–7 year vs 39-year property",
      "Use bonus depreciation (80% in 2023, phasing down)",
    ],
  },
  {
    id: "retirement",
    title: "Solo 401(k) / SEP-IRA Maximization",
    description: "Maximize contributions to owner/executive retirement plans to reduce taxable business income.",
    potentialSavings: "$15K – $100K+ in tax deferral",
    complexity: "low",
    eligibility: "Owner-operators and executives of any entity type.",
    actionItems: [
      "Set up Solo 401(k) or SEP-IRA before year end",
      "Contribute up to $66K/yr (2023) via Solo 401(k)",
      "Contributions deduct directly from business income",
    ],
  },
];

const COMPLEXITY_COLOR = { low: "var(--green)", medium: "var(--amber)", high: "var(--red)" };
const COMPLEXITY_BG = { low: "rgba(16,185,129,0.12)", medium: "rgba(245,158,11,0.12)", high: "rgba(239,68,68,0.12)" };

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function TaxPage() {
  const [inputs, setInputs] = useState<RDInputs>({
    wages: 1_200_000,
    contractorCosts: 300_000,
    supplies: 50_000,
    cloudCompute: 180_000,
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const result = calculateRDCredit(inputs);

  const setInput = (key: keyof RDInputs, val: string) => {
    const num = parseInt(val.replace(/\D/g, ""), 10) || 0;
    setInputs((prev) => ({ ...prev, [key]: num }));
  };

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Calculator size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, fontWeight: 400 }}>
            Tax Optimization
          </h1>
        </div>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>
          R&D tax credit calculator · tax strategy playbook · CPA referrals
        </p>
      </div>

      {/* R&D Calculator */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
        {/* Inputs */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>R&D Credit Calculator</h2>

          {[
            { key: "wages" as const, label: "Qualified Employee Wages", help: "W-2 wages for engineers, PMs, designers doing qualified R&D" },
            { key: "contractorCosts" as const, label: "US Contractor Costs", help: "65% eligible — only domestic contractors qualify" },
            { key: "supplies" as const, label: "Qualified Supplies", help: "Physical supplies consumed in R&D (not capital expenditures)" },
            { key: "cloudCompute" as const, label: "Cloud / Compute Costs", help: "65% eligible — AWS/GCP/Azure for product development" },
          ].map(({ key, label, help }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>
                {label}
              </label>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 6 }}>{help}</div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 13 }}>$</span>
                <input
                  type="text"
                  value={inputs[key].toLocaleString()}
                  onChange={(e) => setInput(key, e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px 10px 24px",
                    background: "var(--surface-2)", border: "1px solid var(--border)",
                    borderRadius: 8, color: "var(--text)", fontSize: 13,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Estimated Credit</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Qualified Research Expenses (QREs)", value: fmt(result.qualifiedResearchExpenses), sub: "Eligible expense base" },
              { label: "Federal R&D Credit (14% of QREs)", value: fmt(result.federalCredit), sub: "Standard method estimate" },
              { label: "Startup Payroll Offset Credit", value: fmt(result.payrollOffset), sub: "Up to $500K/yr against employer FICA" },
              { label: "3-Year Credit Value", value: fmt(result.threeYearValue), sub: "Cumulative if R&D spending maintained", highlight: true },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  padding: "14px 16px", borderRadius: 10,
                  background: row.highlight ? "rgba(16,185,129,0.08)" : "var(--surface-2)",
                  border: `1px solid ${row.highlight ? "rgba(16,185,129,0.2)" : "transparent"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-2)" }}>{row.label}</div>
                    <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{row.sub}</div>
                  </div>
                  <div style={{
                    fontFamily: "JetBrains Mono, monospace", fontSize: 16, fontWeight: 600,
                    color: row.highlight ? "var(--green)" : "var(--text)",
                  }}>
                    {row.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: "12px 14px", borderRadius: 10, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", fontSize: 12, color: "var(--text-2)", lineHeight: 1.7 }}>
            <AlertCircle size={11} style={{ marginRight: 6 }} color="var(--accent)" />
            These are estimates using the Simplified Alternative Computation method. Actual credits depend on your 3-year average QRE history, documentation, and filing methodology. Engage a qualified R&D credit specialist before claiming.
          </div>

          <a
            href="mailto:tax@helmcfo.com?subject=R&D Tax Credit Introduction"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginTop: 16, padding: "11px 0", borderRadius: 10,
              background: "var(--accent)", color: "white",
              fontSize: 13, fontWeight: 500, textDecoration: "none",
            }}
          >
            Connect with an R&D Credit Specialist
            <ChevronRight size={14} />
          </a>
        </div>
      </div>

      {/* Tax Strategy Playbook */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Tax Strategy Playbook</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {STRATEGIES.map((s) => (
          <div
            key={s.id}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}
          >
            <div
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 24px", cursor: "pointer",
                background: expanded === s.id ? "var(--surface-2)" : "transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1 }}>
                <CheckCircle size={16} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>{s.description}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, marginLeft: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--green)" }}>{s.potentialSavings}</span>
                <span style={{
                  fontSize: 10, padding: "2px 8px", borderRadius: 5, textTransform: "capitalize",
                  background: COMPLEXITY_BG[s.complexity], color: COMPLEXITY_COLOR[s.complexity],
                }}>
                  {s.complexity} complexity
                </span>
                <ChevronRight size={14} color="var(--text-3)" style={{ transform: expanded === s.id ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
              </div>
            </div>

            {expanded === s.id && (
              <div style={{ padding: "0 24px 20px 24px", borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: 12, color: "var(--text-3)", margin: "16px 0 12px" }}>
                  Eligibility: <span style={{ color: "var(--text-2)" }}>{s.eligibility}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-2)", marginBottom: 10 }}>Action Items:</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.actionItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 10, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 6px", flexShrink: 0, marginTop: 1, fontFamily: "JetBrains Mono, monospace", color: "var(--text-3)" }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
