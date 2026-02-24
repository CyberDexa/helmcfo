/**
 * Deterministic cash-flow forecasting engine.
 *
 * Pure functions — no I/O, no side effects, fully unit-testable.
 * Uses month-by-month arithmetic; no rounding until the final output layer.
 */
import type {
  FinancialPosition,
  ScenarioAssumptions,
  ScenarioKey,
  ProjectedMonth,
  ScenarioProjection,
  CashEvent,
} from "./types";

// ── Date helpers ──────────────────────────────────────────────────────────────

/** Returns "Mar '26" format label for a given date offset from today */
export function monthLabel(offsetMonths: number): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offsetMonths);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }).replace(" ", " '");
}

/** Returns an ISO date string N months from today */
export function addMonths(n: number): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  return d.toISOString().slice(0, 10);
}

// ── Core projection engine ────────────────────────────────────────────────────

/**
 * Projects cash month-by-month for `horizonMonths` periods.
 * Returns an array of ProjectedMonth values — one per period.
 */
export function projectCashFlow(
  position: FinancialPosition,
  assumptions: ScenarioAssumptions,
  horizonMonths = 12
): ProjectedMonth[] {
  const months: ProjectedMonth[] = [];

  let cash = position.cashBalance;
  let revenue = position.monthlyRevenue;
  let burn = position.monthlyBurn;
  let headcount = position.headcount;

  // Apply SaaS optimisation as a one-time burn reduction in month 0
  burn = Math.max(0, burn + assumptions.saasOptimisation);

  for (let i = 0; i < horizonMonths; i++) {
    const openingCash = cash;
    const eventLabels: string[] = [];

    // ── Revenue growth ─────────────────────────────────────────────────────
    revenue = revenue * (1 + assumptions.revenueGrowthMoM);

    // ── Hiring cost ────────────────────────────────────────────────────────
    const newHires = Math.floor(assumptions.hiresPerMonth);
    const fractionalHire = assumptions.hiresPerMonth - newHires;
    // Fully-loaded salary cost accrued this month
    const hireCost =
      (newHires + (Math.random() < fractionalHire ? 1 : 0)) *
      (assumptions.avgHireSalary * 1.25) / 12;
    headcount += newHires;
    burn = burn + hireCost + burn * assumptions.burnGrowthMoM;

    // ── Scheduled events ───────────────────────────────────────────────────
    let eventCash = 0;
    for (const ev of assumptions.events) {
      const fires = ev.recurring ? i >= ev.month : i === ev.month;
      if (fires) {
        eventCash += ev.amount;
        if (!ev.recurring || i === ev.month) {
          eventLabels.push(ev.label);
        }
      }
    }

    // ── AR collection ──────────────────────────────────────────────────────
    if (i === assumptions.arCollectionMonth && position.overdueAR > 0) {
      eventCash += position.overdueAR;
      eventLabels.push(`AR collected +${fmt(position.overdueAR)}`);
    }

    const netCashFlow = revenue - burn + eventCash;
    cash = openingCash + netCashFlow;

    const runwayAtPoint = burn > 0 ? Math.max(0, cash / burn) : 999;

    months.push({
      month: i,
      label: monthLabel(i + 1),   // +1 because month 0 = next month
      openingCash: Math.round(openingCash),
      revenue: Math.round(revenue),
      burn: Math.round(burn),
      netCashFlow: Math.round(netCashFlow),
      closingCash: Math.round(cash),
      events: eventLabels,
      runway: Math.round(runwayAtPoint * 10) / 10,
    });

    // Stop projecting once cash hits zero
    if (cash <= 0) break;
  }

  return months;
}

// ── Scenario builder ───────────────────────────────────────────────────────────

export function buildScenarioProjection(
  scenario: ScenarioKey,
  position: FinancialPosition,
  assumptions: ScenarioAssumptions,
  horizonMonths = 12
): ScenarioProjection {
  const months = projectCashFlow(position, assumptions, horizonMonths);

  // Find when cash goes negative
  const runoutMonth = months.find((m) => m.closingCash <= 0);
  const runwayMonths = runoutMonth
    ? runoutMonth.month
    : months[months.length - 1]?.runway ?? 0;

  const runoutDate = runoutMonth
    ? addMonths(runoutMonth.month + 1)
    : "Beyond projection window";

  return {
    scenario,
    assumptions,
    months,
    runwayMonths: Math.round(runwayMonths * 10) / 10,
    runoutDate,
    totalBurnInPeriod: Math.round(months.reduce((s, m) => s + m.burn, 0)),
    totalRevenueInPeriod: Math.round(months.reduce((s, m) => s + m.revenue, 0)),
  };
}

// ── Default assumptions per scenario ─────────────────────────────────────────

export function defaultAssumptions(
  scenario: ScenarioKey,
  position: FinancialPosition
): ScenarioAssumptions {
  const arEvent: CashEvent = {
    month: 1,
    label: "AR collection",
    amount: position.overdueAR,
    category: "ar_collection",
    recurring: false,
  };

  switch (scenario) {
    case "bear":
      return {
        revenueGrowthMoM: 0.02,          // 2% — stalling
        burnGrowthMoM: 0.03,             // 3% monthly burn creep
        hiresPerMonth: 1.5,
        avgHireSalary: 175_000,
        saasOptimisation: 0,             // no optimisation
        arCollectionMonth: -1,           // AR not collected
        events: [],
      };

    case "base":
      return {
        revenueGrowthMoM: 0.05,
        burnGrowthMoM: 0.01,
        hiresPerMonth: 2,
        avgHireSalary: 160_000,
        saasOptimisation: -2800,         // one-time monthly saving
        arCollectionMonth: 1,
        events: [arEvent],
      };

    case "bull":
      return {
        revenueGrowthMoM: 0.08,
        burnGrowthMoM: 0.005,
        hiresPerMonth: 1,
        avgHireSalary: 150_000,
        saasOptimisation: -5000,
        arCollectionMonth: 0,
        events: [
          arEvent,
          {
            month: 3,                    // Series A closes in month 3
            label: "Series A close",
            amount: 5_000_000,
            category: "fundraise",
            recurring: false,
          },
        ],
      };
  }
}

// ── Convenience: run all three scenarios ─────────────────────────────────────

export function runAllScenarios(
  position: FinancialPosition,
  horizonMonths = 12
): Record<ScenarioKey, ScenarioProjection> {
  return {
    bear: buildScenarioProjection("bear", position, defaultAssumptions("bear", position), horizonMonths),
    base: buildScenarioProjection("base", position, defaultAssumptions("base", position), horizonMonths),
    bull: buildScenarioProjection("bull", position, defaultAssumptions("bull", position), horizonMonths),
  };
}

// ── Private helpers ───────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}
