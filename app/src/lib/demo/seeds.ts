/**
 * Demo seeds for 5 design partner companies.
 * These override the mock data in lib/data.ts when DEMO_COMPANY env var is set.
 * Each seed represents a realistic SMB scenario to stress-test HelmCFO's
 * analysis and surfaced insights during design partner sessions.
 */

export interface DemoCompany {
  id: string;
  name: string;
  industry: string;
  stage: "pre-seed" | "seed" | "series-a";
  cashBalance: number;       // USD
  monthlyBurn: number;       // USD
  mrr: number;               // USD
  revenueGrowthMoM: number;  // decimal, e.g. 0.08 = 8%
  headcount: number;
  customerCount: number;
  grossMargin: number;       // decimal
  nrr: number;               // decimal, e.g. 1.05 = 105%
  overdueAR: number;         // USD
  cac: number;               // USD
  ltv: number;               // USD
  scenario: string;          // narrative for the AI advisor
}

export const DEMO_COMPANIES: DemoCompany[] = [
  {
    id: "acme-saas",
    name: "Acme SaaS",
    industry: "B2B SaaS / HR Tech",
    stage: "seed",
    cashBalance: 980_000,
    monthlyBurn: 85_000,
    mrr: 42_000,
    revenueGrowthMoM: 0.09,
    headcount: 12,
    customerCount: 38,
    grossMargin: 0.74,
    nrr: 1.08,
    overdueAR: 18_000,
    cac: 2_400,
    ltv: 19_200,
    scenario:
      "Burning ~$85k/mo with ~11.5 months runway. Strong NRR but AR is slipping. " +
      "Series A pitch deck being built — needs to sharpen unit economics story.",
  },
  {
    id: "greenleaf-ecomm",
    name: "Greenleaf Commerce",
    industry: "E-commerce / Sustainable Goods",
    stage: "pre-seed",
    cashBalance: 310_000,
    monthlyBurn: 38_000,
    mrr: 22_000,
    revenueGrowthMoM: 0.14,
    headcount: 5,
    customerCount: 1_200,
    grossMargin: 0.48,
    nrr: 0.97,
    overdueAR: 0,
    cac: 42,
    ltv: 390,
    scenario:
      "8 months runway. Fast top-line growth but thin margins squeeze burn. " +
      "Needs to model the impact of a wholesale channel on CAC/LTV before next raise.",
  },
  {
    id: "dataflow-ai",
    name: "DataFlow AI",
    industry: "AI / Data Infrastructure",
    stage: "series-a",
    cashBalance: 4_200_000,
    monthlyBurn: 310_000,
    mrr: 195_000,
    revenueGrowthMoM: 0.06,
    headcount: 31,
    customerCount: 14,
    grossMargin: 0.81,
    nrr: 1.22,
    overdueAR: 85_000,
    cac: 38_000,
    ltv: 456_000,
    scenario:
      "13.5 months runway post-Series A. Enterprise contracts mean large AR balances. " +
      "Board wants a plan to hit $3M ARR in 18 months — needs headcount modelling.",
  },
  {
    id: "cliniq-health",
    name: "CliniQ Health",
    industry: "HealthTech / Telehealth",
    stage: "seed",
    cashBalance: 1_650_000,
    monthlyBurn: 120_000,
    mrr: 68_000,
    revenueGrowthMoM: 0.07,
    headcount: 18,
    customerCount: 290,
    grossMargin: 0.62,
    nrr: 1.04,
    overdueAR: 32_000,
    cac: 1_100,
    ltv: 8_800,
    scenario:
      "13.75 months runway. Regulatory overhead suppresses margin. " +
      "CEO wants to understand which expense categories to cut if growth slows to 3% MoM.",
  },
  {
    id: "logiqflow",
    name: "LogiqFlow",
    industry: "Supply Chain / Logistics SaaS",
    stage: "seed",
    cashBalance: 720_000,
    monthlyBurn: 96_000,
    mrr: 54_000,
    revenueGrowthMoM: 0.05,
    headcount: 14,
    customerCount: 22,
    grossMargin: 0.70,
    nrr: 1.11,
    overdueAR: 44_000,
    cac: 8_500,
    ltv: 93_500,
    scenario:
      "7.5 months runway — needs bridge or significant burn cut within 90 days. " +
      "High NRR and strong LTV/CAC ratio makes a bridge extension argument viable.",
  },
];

/**
 * Get a demo company by its ID (set via DEMO_COMPANY env var or URL param).
 */
export function getDemoCompany(id: string): DemoCompany | undefined {
  return DEMO_COMPANIES.find((c) => c.id === id);
}

/**
 * Convert a DemoCompany into the FinancialSnapshot shape expected by the engine.
 */
export function demoCompanyToSnapshot(c: DemoCompany) {
  return {
    cashBalance: c.cashBalance,
    monthlyBurn: c.monthlyBurn,
    runway: Math.round(c.cashBalance / c.monthlyBurn),
    mrr: c.mrr,
    arr: c.mrr * 12,
    revenueGrowthMoM: c.revenueGrowthMoM,
    customerCount: c.customerCount,
    nrr: c.nrr,
    cac: c.cac,
    ltv: c.ltv,
    grossMargin: c.grossMargin,
    headcount: c.headcount,
    overdueAR: c.overdueAR,
    sources: { plaid: false, stripe: false, qbo: false, finch: false },
    syncedAt: new Date().toISOString(),
  };
}
