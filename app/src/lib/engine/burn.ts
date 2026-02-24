/**
 * Burn rate attribution engine.
 *
 * Breaks down total monthly burn into categories, identifies top drivers,
 * and computes the payroll-to-burn ratio.
 *
 * Works with either real data from the normalizer (FinancialSnapshot)
 * or the mock expense data in lib/data.ts.
 */
import type { BurnBreakdown, BurnCategory } from "./types";

// ── Raw input types ───────────────────────────────────────────────────────────

export interface RawExpense {
  label: string;
  monthlyAmount: number;
  /** Optional — inferred as flat if omitted */
  previousMonthAmount?: number;
}

export interface PayrollInput {
  headcount: number;
  avgFullyLoadedMonthly: number;  // per person
}

// ── Main breakdown builder ────────────────────────────────────────────────────

export function buildBurnBreakdown(
  totalBurn: number,
  payroll: PayrollInput,
  otherExpenses: RawExpense[]
): BurnBreakdown {
  const payrollMonthly = payroll.headcount * payroll.avgFullyLoadedMonthly;
  const payrollPct = totalBurn > 0 ? (payrollMonthly / totalBurn) * 100 : 0;

  const categories: BurnCategory[] = [
    buildCategory("Payroll & Benefits", payrollMonthly, totalBurn, undefined, "Fully-loaded at 1.25× base salary"),
    ...otherExpenses.map((e) =>
      buildCategory(e.label, e.monthlyAmount, totalBurn, e.previousMonthAmount)
    ),
  ];

  // Sort descending by amount
  categories.sort((a, b) => b.monthlyAmount - a.monthlyAmount);

  // Reconcile: if sum of categories != totalBurn, add an "Other" bucket
  const categorisedTotal = categories.reduce((s, c) => s + c.monthlyAmount, 0);
  const remainder = totalBurn - categorisedTotal;
  if (Math.abs(remainder) > 100) {
    categories.push(
      buildCategory("Other", remainder, totalBurn, undefined, "Uncategorised spend")
    );
  }

  return {
    totalBurn: Math.round(totalBurn),
    categories,
    payrollRatio: Math.round(payrollPct),
    topDriver: categories[0]?.label ?? "Unknown",
  };
}

// ── Category builder ──────────────────────────────────────────────────────────

function buildCategory(
  label: string,
  monthly: number,
  totalBurn: number,
  prevMonthly?: number,
  driverNote?: string
): BurnCategory {
  const pct = totalBurn > 0 ? (monthly / totalBurn) * 100 : 0;
  let trend: BurnCategory["trend"] = "flat";
  if (prevMonthly != null) {
    const delta = monthly - prevMonthly;
    if (delta > monthly * 0.02) trend = "up";
    else if (delta < -monthly * 0.02) trend = "down";
  }

  return {
    label,
    monthlyAmount: Math.round(monthly),
    pctOfBurn: Math.round(pct * 10) / 10,
    trend,
    driverNote: driverNote ?? inferDriverNote(label, trend, pct),
  };
}

function inferDriverNote(label: string, trend: BurnCategory["trend"], pct: number): string {
  const trendWord = trend === "up" ? "↑ Increasing" : trend === "down" ? "↓ Decreasing" : "→ Stable";
  if (pct > 50) return `${trendWord} · Largest burn driver`;
  if (pct > 20) return `${trendWord} · Significant cost centre`;
  return `${trendWord}`;
}

// ── Derive from mock/demo data (for use when real integrations not connected) ──

import { employees, expenses } from "@/lib/data";

export function buildBurnBreakdownFromMockData(totalBurn: number): BurnBreakdown {
  const activeEmployees = employees.filter((e) => e.status === "active");
  const avgSalary = activeEmployees.reduce((s, e) => s + e.salary, 0) / activeEmployees.length;

  const payroll: PayrollInput = {
    headcount: activeEmployees.length,
    avgFullyLoadedMonthly: (avgSalary * 1.25) / 12,
  };

  const otherExpenses: RawExpense[] = expenses.map((e) => ({
    label: e.name,
    monthlyAmount: e.value,
    previousMonthAmount: e.value * (1 - e.delta / 100),
  }));

  return buildBurnBreakdown(totalBurn, payroll, otherExpenses);
}

// ── Opportunity identifier ────────────────────────────────────────────────────

export interface OptimisationOpportunity {
  category: string;
  currentSpend: number;
  potentialSaving: number;
  action: string;
  runwayImpactDays: number;
}

export function identifyOptimisations(
  breakdown: BurnBreakdown,
  cashBalance: number
): OptimisationOpportunity[] {
  const opportunities: OptimisationOpportunity[] = [];

  for (const cat of breakdown.categories) {
    if (cat.label === "Payroll & Benefits") continue; // Handled by headcount planner

    // Flag categories that are "up" trending and >5% of burn for review
    if (cat.trend === "up" && cat.pctOfBurn > 5) {
      const saving = cat.monthlyAmount * 0.15; // Assume 15% reducible
      opportunities.push({
        category: cat.label,
        currentSpend: cat.monthlyAmount,
        potentialSaving: Math.round(saving),
        action: `Audit ${cat.label.toLowerCase()} vendors — potential contract renegotiation`,
        runwayImpactDays: cashBalance > 0 ? Math.round((saving / breakdown.totalBurn) * 30) : 0,
      });
    }

    // Specific SaaS heuristic
    if (cat.label.toLowerCase().includes("saas") || cat.label.toLowerCase().includes("software")) {
      const saving = cat.monthlyAmount * 0.2;
      opportunities.push({
        category: cat.label,
        currentSpend: cat.monthlyAmount,
        potentialSaving: Math.round(saving),
        action: "Run a SaaS audit — cancel unused seats and consolidate overlapping tools",
        runwayImpactDays: Math.round((saving / breakdown.totalBurn) * 30),
      });
    }
  }

  // Deduplicate by category
  const seen = new Set<string>();
  return opportunities.filter((o) => {
    if (seen.has(o.category)) return false;
    seen.add(o.category);
    return true;
  });
}
