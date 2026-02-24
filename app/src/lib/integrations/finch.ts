/**
 * Finch unified payroll/HRIS integration.
 * Finch covers 200+ providers (Gusto, ADP, Rippling, Paychex, BambooHR)
 * via a single API.
 *
 * Env vars required:
 *   FINCH_CLIENT_ID
 *   FINCH_CLIENT_SECRET
 *   FINCH_REDIRECT_URI  (e.g. http://localhost:3001/api/integrations/finch/callback)
 */

import Finch from "@tryfinch/finch-api";

/** Normalised employee record from Finch */
export interface FinchEmployee {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  department: string | null;
  startDate: string | null;          // ISO date
  isActive: boolean;
  annualSalary: number | null;       // USD, fully-loaded best estimate
  currency: string;
}

/** Aggregate payroll summary derived from Finch data */
export interface FinchPayrollSummary {
  totalHeadcount: number;
  activeHeadcount: number;
  totalMonthlyPayroll: number;       // USD
  totalAnnualPayroll: number;        // USD
  avgAnnualSalary: number;           // USD
  departmentBreakdown: Array<{
    department: string;
    headcount: number;
    monthlyPayroll: number;
  }>;
  employees: FinchEmployee[];
  syncedAt: string;
}

function buildClient(accessToken: string): Finch {
  return new Finch({ accessToken });
}

/**
 * Exchange a Finch authorization code for an access token.
 * Call this from the OAuth callback route.
 */
export async function exchangeFinchCode(code: string): Promise<string> {
  const clientId = process.env.FINCH_CLIENT_ID;
  const clientSecret = process.env.FINCH_CLIENT_SECRET;
  const redirectUri = process.env.FINCH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("FINCH_CLIENT_ID, FINCH_CLIENT_SECRET, and FINCH_REDIRECT_URI must be set");
  }

  // Finch token exchange is a standard OAuth2 code exchange
  const response = await fetch("https://api.tryfinch.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Finch token exchange failed: ${err}`);
  }

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

/**
 * Fetch employee directory and payroll data for a connected company.
 * Returns a normalised summary ready for the computation engine.
 */
export async function syncFinchPayroll(accessToken: string): Promise<FinchPayrollSummary> {
  const client = buildClient(accessToken);

  // Fetch directory (all employees)
  const directoryPage = await client.hris.directory.list();
  const directory = directoryPage.individuals ?? [];

  // Fetch pay statements (most recent pay period for each employee)
  // Finch pay_statements requires individual IDs
  const activeIds = directory
    .filter((e) => e.is_active)
    .map((e) => e.id)
    .filter((id): id is string => Boolean(id));

  // Fetch individual details for salary info
  let individualsWithSalary: Array<{ id: string; annualSalary: number | null }> = [];
  if (activeIds.length > 0) {
    const responses = await client.hris.individuals.retrieveMany({
      requests: activeIds.map((id) => ({ individual_id: id })),
      options: { include: ["income"] },
    });
    for await (const batch of responses) {
      const individual = batch.body;
      if (individual && "id" in individual && individual.id) {
        // Income is in individual responses
        const income = "income" in individual && individual.income;
        let annual = null;
        if (income && typeof income === "object" && "amount" in income && income.amount != null) {
          const amt = income as { amount: number; currency: string; unit?: string };
          // Finch income amounts may be in cents or dollars depending on unit
          annual = (amt.unit === "monthly")
            ? (amt.amount ?? 0) * 12
            : (amt.amount ?? 0);
        }
        individualsWithSalary.push({ id: individual.id as string, annualSalary: annual });
      }
    }
  }

  const salaryMap = new Map(individualsWithSalary.map((i) => [i.id, i.annualSalary]));

  const employees: FinchEmployee[] = directory.map((e) => ({
    id: e.id ?? "",
    firstName: e.first_name ?? "",
    lastName: e.last_name ?? "",
    title: ("title" in e && typeof e.title === "string") ? e.title : null,
    department: e.department?.name ?? null,
    startDate: ("start_date" in e && typeof e.start_date === "string") ? e.start_date : null,
    isActive: e.is_active ?? false,
    annualSalary: salaryMap.get(e.id ?? "") ?? null,
    currency: "USD",
  }));

  const active = employees.filter((e) => e.isActive);

  const totalAnnualPayroll = active.reduce((sum, e) => sum + (e.annualSalary ?? 0), 0);
  const totalMonthlyPayroll = Math.round(totalAnnualPayroll / 12);
  const avgAnnualSalary = active.length > 0
    ? Math.round(totalAnnualPayroll / active.length)
    : 0;

  // Group by department
  const deptMap = new Map<string, { headcount: number; monthlyPayroll: number }>();
  for (const e of active) {
    const dept = e.department ?? "Unassigned";
    const existing = deptMap.get(dept) ?? { headcount: 0, monthlyPayroll: 0 };
    deptMap.set(dept, {
      headcount: existing.headcount + 1,
      monthlyPayroll: existing.monthlyPayroll + Math.round((e.annualSalary ?? 0) / 12),
    });
  }

  return {
    totalHeadcount: employees.length,
    activeHeadcount: active.length,
    totalMonthlyPayroll,
    totalAnnualPayroll,
    avgAnnualSalary,
    departmentBreakdown: Array.from(deptMap.entries()).map(([department, data]) => ({
      department,
      ...data,
    })),
    employees,
    syncedAt: new Date().toISOString(),
  };
}
