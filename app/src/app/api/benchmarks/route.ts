import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS, getRateLimitKey } from "@/lib/security/rate-limiter";

/**
 * Anonymized cross-customer benchmark data API.
 *
 * In production, this aggregates real opt-in customer metrics.
 * Data is anonymized: no company names, computed as percentile distributions.
 * Minimum cohort size of 10 required before any cell is publishable (k-anonymity).
 */

export interface BenchmarkMetric {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  label: string;
  unit: string;
  description: string;
}

export interface BenchmarkReport {
  generatedAt: string;
  cohort: string;
  companyCount: number; // masked to nearest 10 for privacy
  metrics: {
    burnMultiple: BenchmarkMetric;
    grossMarginPct: BenchmarkMetric;
    mrrGrowthMoM: BenchmarkMetric;
    cacPaybackMonths: BenchmarkMetric;
    nrrPct: BenchmarkMetric;
    runwayMonths: BenchmarkMetric;
    revenuePerEmployee: BenchmarkMetric;
    arrPerSalesPerson: BenchmarkMetric;
    magicNumber: BenchmarkMetric;
    ruleOf40: BenchmarkMetric;
  };
}

// Synthetic benchmark data — replace with real aggregation query in production
function generateBenchmarks(segment: string): BenchmarkReport {
  const segments: Record<string, BenchmarkReport["metrics"]> = {
    "saas-seed": {
      burnMultiple:         { p25: 1.1, p50: 1.8, p75: 2.8, p90: 4.2, label: "Burn Multiple",            unit: "x",  description: "Net burn ÷ net new ARR. <1.5x is efficient." },
      grossMarginPct:       { p25: 55,  p50: 67,  p75: 76,  p90: 83,  label: "Gross Margin",             unit: "%",  description: "Revenue minus COGS as % of revenue." },
      mrrGrowthMoM:         { p25: 4,   p50: 8,   p75: 14,  p90: 22,  label: "MRR Growth (MoM)",         unit: "%",  description: "Month-over-month MRR growth rate." },
      cacPaybackMonths:     { p25: 10,  p50: 17,  p75: 26,  p90: 38,  label: "CAC Payback Period",       unit: "mo", description: "Months to recover CAC from gross profit." },
      nrrPct:               { p25: 88,  p50: 98,  p75: 112, p90: 125, label: "Net Revenue Retention",    unit: "%",  description: ">100% means expansion revenue > churn." },
      runwayMonths:         { p25: 6,   p50: 14,  p75: 22,  p90: 30,  label: "Cash Runway",              unit: "mo", description: "Months of cash at current burn rate." },
      revenuePerEmployee:   { p25: 85,  p50: 140, p75: 210, p90: 320, label: "Revenue per Employee",     unit: "$K", description: "ARR ÷ full-time headcount." },
      arrPerSalesPerson:    { p25: 400, p50: 700, p75: 1100,p90: 1800,label: "ARR per Sales FTE",        unit: "$K", description: "ARR ÷ quota-carrying sales headcount." },
      magicNumber:          { p25: 0.4, p50: 0.7, p75: 1.1, p90: 1.6, label: "Magic Number",             unit: "x",  description: "Net new ARR ÷ prior-quarter S&M spend." },
      ruleOf40:             { p25: -8,  p50: 12,  p75: 28,  p90: 45,  label: "Rule of 40",               unit: "%",  description: "YoY growth rate + EBITDA margin. >40% is healthy." },
    },
    "saas-series-a": {
      burnMultiple:         { p25: 0.9, p50: 1.4, p75: 2.2, p90: 3.5, label: "Burn Multiple",            unit: "x",  description: "Net burn ÷ net new ARR. <1.5x is efficient." },
      grossMarginPct:       { p25: 62,  p50: 72,  p75: 80,  p90: 86,  label: "Gross Margin",             unit: "%",  description: "Revenue minus COGS as % of revenue." },
      mrrGrowthMoM:         { p25: 6,   p50: 12,  p75: 18,  p90: 28,  label: "MRR Growth (MoM)",         unit: "%",  description: "Month-over-month MRR growth rate." },
      cacPaybackMonths:     { p25: 8,   p50: 14,  p75: 22,  p90: 32,  label: "CAC Payback Period",       unit: "mo", description: "Months to recover CAC from gross profit." },
      nrrPct:               { p25: 95,  p50: 108, p75: 120, p90: 135, label: "Net Revenue Retention",    unit: "%",  description: ">100% means expansion revenue > churn." },
      runwayMonths:         { p25: 14,  p50: 20,  p75: 28,  p90: 36,  label: "Cash Runway",              unit: "mo", description: "Months of cash at current burn rate." },
      revenuePerEmployee:   { p25: 130, p50: 200, p75: 290, p90: 410, label: "Revenue per Employee",     unit: "$K", description: "ARR ÷ full-time headcount." },
      arrPerSalesPerson:    { p25: 600, p50: 900, p75: 1400,p90: 2200,label: "ARR per Sales FTE",        unit: "$K", description: "ARR ÷ quota-carrying sales headcount." },
      magicNumber:          { p25: 0.6, p50: 0.9, p75: 1.4, p90: 2.0, label: "Magic Number",             unit: "x",  description: "Net new ARR ÷ prior-quarter S&M spend." },
      ruleOf40:             { p25: 5,   p50: 22,  p75: 38,  p90: 58,  label: "Rule of 40",               unit: "%",  description: "YoY growth rate + EBITDA margin. >40% is healthy." },
    },
  };

  const data = segments[segment] ?? segments["saas-seed"];

  return {
    generatedAt: new Date().toISOString(),
    cohort: segment,
    companyCount: segment === "saas-series-a" ? 80 : 150, // masked
    metrics: data,
  };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const key = `benchmarks:${getRateLimitKey(req)}`;
  const rateResult = checkRateLimit(key, RATE_LIMITS.public);
  if (!rateResult.allowed) {
    return NextResponse.json({ ok: false, error: "Rate limit exceeded" }, { status: 429 });
  }

  const segment = req.nextUrl.searchParams.get("segment") ?? "saas-seed";
  const allowed = ["saas-seed", "saas-series-a"];
  if (!allowed.includes(segment)) {
    return NextResponse.json({ ok: false, error: `segment must be one of: ${allowed.join(", ")}` }, { status: 400 });
  }

  const report = generateBenchmarks(segment);
  return NextResponse.json({ ok: true, ...report });
}
