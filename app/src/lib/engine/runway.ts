/**
 * Runway analysis & sensitivity engine.
 *
 * Answers: "How many more months do I get from each lever?"
 */
import type { RunwayAnalysis, RunwaySensitivity } from "./types";
import { addMonths } from "./forecast";

// ── Core runway calculator ────────────────────────────────────────────────────

export function calculateRunway(cashBalance: number, monthlyBurn: number): number {
  if (monthlyBurn <= 0) return 999;
  return Math.max(0, cashBalance / monthlyBurn);
}

export function runwayToDate(cashBalance: number, monthlyBurn: number): string {
  const months = calculateRunway(cashBalance, monthlyBurn);
  if (months >= 120) return "No foreseeable runout";
  return addMonths(Math.ceil(months));
}

// ── Sensitivity analysis ───────────────────────────────────────────────────────

/**
 * For each lever, compute the delta in runway months if the lever were applied today.
 */
export function buildRunwayAnalysis(
  cashBalance: number,
  monthlyBurn: number,
  monthlyRevenue: number,
  overdueAR: number,
  headcount: number,
  avgAnnualSalary: number
): RunwayAnalysis {
  const baseRunway = calculateRunway(cashBalance, monthlyBurn);
  const baseRunoutDate = runwayToDate(cashBalance, monthlyBurn);
  const fullyLoadedMonthly = (avgAnnualSalary * 1.25) / 12;

  const levers: Array<{ lever: string; currentValue: number; unit: string; newCash: number; newBurn: number }> = [
    // Collect all overdue AR → immediate cash boost
    {
      lever: "Collect overdue AR",
      currentValue: overdueAR,
      unit: "$",
      newCash: cashBalance + overdueAR,
      newBurn: monthlyBurn,
    },
    // Cut 1 hire → reduce burn
    {
      lever: "Defer 1 planned hire",
      currentValue: fullyLoadedMonthly,
      unit: "$/mo saved",
      newCash: cashBalance,
      newBurn: Math.max(0, monthlyBurn - fullyLoadedMonthly),
    },
    // 10% SaaS vendor renegotiation
    {
      lever: "10% SaaS cost reduction",
      currentValue: monthlyBurn * 0.08,  // assume SaaS ≈ 8% of burn
      unit: "$/mo saved",
      newCash: cashBalance,
      newBurn: Math.max(0, monthlyBurn - monthlyBurn * 0.08 * 0.1),
    },
    // Raise a $500K bridge
    {
      lever: "$500K bridge / SAFEs",
      currentValue: 500_000,
      unit: "$",
      newCash: cashBalance + 500_000,
      newBurn: monthlyBurn,
    },
    // Raise a $2M bridge
    {
      lever: "$2M bridge round",
      currentValue: 2_000_000,
      unit: "$",
      newCash: cashBalance + 2_000_000,
      newBurn: monthlyBurn,
    },
    // Freeze all new hiring
    {
      lever: "Hiring freeze (0 new hires)",
      currentValue: 2 * fullyLoadedMonthly,  // assume 2 hires/mo planned
      unit: "$/mo saved",
      newCash: cashBalance,
      newBurn: Math.max(0, monthlyBurn - 2 * fullyLoadedMonthly),
    },
    // 5% revenue acceleration
    {
      lever: "+5% MoM revenue acceleration",
      currentValue: monthlyRevenue * 0.05,
      unit: "$/mo extra inflow",
      newCash: cashBalance,
      newBurn: Math.max(0, monthlyBurn - monthlyRevenue * 0.05),
    },
  ];

  const sensitivityTable: RunwaySensitivity[] = levers.map((l) => {
    const newRunway = calculateRunway(l.newCash, l.newBurn);
    const delta = newRunway - baseRunway;
    const deltaPct = baseRunway > 0 ? (delta / baseRunway) * 100 : 0;
    return {
      lever: l.lever,
      currentValue: Math.round(l.currentValue),
      unit: l.unit,
      deltaRunwayMonths: Math.round(delta * 10) / 10,
      deltaRunwayPct: Math.round(deltaPct),
    };
  });

  // Sort by biggest impact first
  sensitivityTable.sort((a, b) => b.deltaRunwayMonths - a.deltaRunwayMonths);

  return {
    baseRunwayMonths: Math.round(baseRunway * 10) / 10,
    baseRunoutDate,
    cashBalance: Math.round(cashBalance),
    monthlyBurn: Math.round(monthlyBurn),
    sensitivityTable,
  };
}

// ── Burn rate zone classification ─────────────────────────────────────────────

export type RunwayZone = "critical" | "warning" | "comfortable" | "healthy";

export function classifyRunwayZone(runwayMonths: number): RunwayZone {
  if (runwayMonths < 3) return "critical";
  if (runwayMonths < 6) return "warning";
  if (runwayMonths < 12) return "comfortable";
  return "healthy";
}

export function runwayZoneMessage(zone: RunwayZone): string {
  switch (zone) {
    case "critical": return "Immediate action required — begin fundraising and cut non-essential spend now.";
    case "warning":  return "Start fundraising today. Initiate burn reduction measures in parallel.";
    case "comfortable": return "Healthy position but begin series A conversations — 6 months passes quickly.";
    case "healthy":  return "Strong runway. Focus on growth and prepare metrics for next round.";
  }
}
