/**
 * Shared types for the deterministic financial computation engine.
 */

export type ScenarioKey = "bear" | "base" | "bull";

// ── Inputs ────────────────────────────────────────────────────────────────────

/** The raw financial position at a point in time */
export interface FinancialPosition {
  cashBalance: number;        // current cash on hand
  monthlyBurn: number;        // gross monthly cash outflow
  monthlyRevenue: number;     // gross monthly inflow (MRR equivalent)
  headcount: number;
  avgFullyLoadedSalary: number; // per person, annually
  overdueAR: number;          // receivables that can be collected
}

/** A single scheduled future event that affects cash */
export interface CashEvent {
  month: number;              // 0-based offset from projection start
  label: string;
  amount: number;             // positive = cash in, negative = cash out
  category: "fundraise" | "hire" | "expense" | "ar_collection" | "other";
  recurring: boolean;         // if true, repeats every month from `month` onward
}

/** Assumptions driving a single scenario projection */
export interface ScenarioAssumptions {
  revenueGrowthMoM: number;   // e.g. 0.05 = 5%
  burnGrowthMoM: number;      // e.g. 0.02 = 2% monthly burn creep
  hiresPerMonth: number;
  avgHireSalary: number;      // annual
  saasOptimisation: number;   // one-time monthly burn reduction (negative = saving)
  arCollectionMonth: number;  // which month (0-based) AR is collected; -1 = never
  events: CashEvent[];
}

// ── Outputs ───────────────────────────────────────────────────────────────────

/** One month in a cash-flow projection */
export interface ProjectedMonth {
  month: number;              // 0-based
  label: string;              // "Mar '26"
  openingCash: number;
  revenue: number;
  burn: number;
  netCashFlow: number;
  closingCash: number;
  events: string[];           // event labels that fired this month
  runway: number;             // months remaining at this point
}

/** Full cash-flow projection for one scenario */
export interface ScenarioProjection {
  scenario: ScenarioKey;
  assumptions: ScenarioAssumptions;
  months: ProjectedMonth[];
  runwayMonths: number;       // total runway
  runoutDate: string;         // ISO date string, or "Not in window" if beyond horizon
  totalBurnInPeriod: number;
  totalRevenueInPeriod: number;
}

// ── Burn breakdown ────────────────────────────────────────────────────────────

export interface BurnCategory {
  label: string;
  monthlyAmount: number;
  pctOfBurn: number;
  trend: "up" | "down" | "flat";
  driverNote: string;
}

export interface BurnBreakdown {
  totalBurn: number;
  categories: BurnCategory[];
  payrollRatio: number;       // payroll as % of total burn
  topDriver: string;
}

// ── Runway analysis ────────────────────────────────────────────────────────────

export interface RunwaySensitivity {
  lever: string;
  currentValue: number;
  unit: string;
  deltaRunwayMonths: number;  // change in runway from current if lever is applied
  deltaRunwayPct: number;
}

export interface RunwayAnalysis {
  baseRunwayMonths: number;
  baseRunoutDate: string;
  cashBalance: number;
  monthlyBurn: number;
  sensitivityTable: RunwaySensitivity[];
}
