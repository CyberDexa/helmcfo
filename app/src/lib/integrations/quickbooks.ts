/**
 * QuickBooks Online integration service (Intuit OAuth 2.0)
 * Handles: OAuth flow, P&L report, Balance Sheet, expense categories
 */
import OAuthClient from "intuit-oauth";

// ── OAuth client factory ──────────────────────────────────────────────────────

export function getQBOClient(token?: { access_token: string; refresh_token: string; realmId: string }) {
  const client = new OAuthClient({
    clientId: process.env.QBO_CLIENT_ID!,
    clientSecret: process.env.QBO_CLIENT_SECRET!,
    environment: (process.env.QBO_ENV ?? "sandbox") as "sandbox" | "production",
    redirectUri: process.env.QBO_REDIRECT_URI!,
  });

  if (token) {
    client.setToken({
      token_type: "bearer",
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      x_refresh_token_expires_in: 8726400,
      expires_in: 3600,
      createdAt: Date.now(),
    });
  }

  return client;
}

export function getAuthUri(state?: string): string {
  const client = getQBOClient();
  return client.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: state ?? crypto.randomUUID(),
  });
}

export async function exchangeCode(url: string): Promise<{
  accessToken: string;
  refreshToken: string;
  realmId: string;
}> {
  const client = getQBOClient();
  const authResponse = await client.createToken(url);
  const tokenData = authResponse.getJson() as {
    access_token: string;
    refresh_token: string;
    realmId: string;
  };
  // realmId is in the query string of the callback URL
  const realmId = new URL(url).searchParams.get("realmId") ?? "";
  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    realmId,
  };
}

// ── QBO API helpers ───────────────────────────────────────────────────────────

const QBO_BASE = {
  sandbox: "https://sandbox-quickbooks.api.intuit.com/v3/company",
  production: "https://quickbooks.api.intuit.com/v3/company",
};

async function qboFetch(
  accessToken: string,
  realmId: string,
  path: string
): Promise<unknown> {
  const base = QBO_BASE[(process.env.QBO_ENV as "sandbox" | "production") ?? "sandbox"];
  const url = `${base}/${realmId}/${path}&minorversion=65`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`QBO API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// ── P&L Report ────────────────────────────────────────────────────────────────

export interface PLRow {
  label: string;
  amount: number;
}

export interface PLReport {
  period: { start: string; end: string };
  revenue: PLRow[];
  totalRevenue: number;
  expenses: PLRow[];
  totalExpenses: number;
  netIncome: number;
  grossMargin: number;
}

export async function getProfitAndLoss(
  accessToken: string,
  realmId: string,
  startDate: string,   // YYYY-MM-DD
  endDate: string
): Promise<PLReport> {
  const data = await qboFetch(
    accessToken,
    realmId,
    `reports/ProfitAndLoss?start_date=${startDate}&end_date=${endDate}&accounting_method=Accrual`
  ) as { Rows: { Row: Array<{ type: string; Header?: { ColData: Array<{ value: string }> }; Summary?: { ColData: Array<{ value: string }> }; Rows?: { Row: Array<{ ColData: Array<{ value: string }>; type: string }> } }> } };

  const rows = data.Rows?.Row ?? [];

  const revenueSection = rows.find((r) => r.Header?.ColData?.[0]?.value === "Income");
  const expenseSection = rows.find((r) => r.Header?.ColData?.[0]?.value === "Expenses");

  function parseSection(section: typeof revenueSection): PLRow[] {
    if (!section?.Rows?.Row) return [];
    return section.Rows.Row
      .filter((r) => r.type === "Data")
      .map((r) => ({
        label: r.ColData?.[0]?.value ?? "",
        amount: parseFloat(r.ColData?.[1]?.value ?? "0"),
      }));
  }

  const revenue = parseSection(revenueSection);
  const expenses = parseSection(expenseSection);
  const totalRevenue = revenue.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, r) => s + r.amount, 0);

  return {
    period: { start: startDate, end: endDate },
    revenue,
    totalRevenue,
    expenses,
    totalExpenses,
    netIncome: totalRevenue - totalExpenses,
    grossMargin: totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0,
  };
}

// ── Balance Sheet ─────────────────────────────────────────────────────────────

export interface BalanceSheetSnapshot {
  date: string;
  cashAndEquivalents: number;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
}

// Recursive QBO row type to accommodate nested sections
interface QBORow {
  type?: string;
  Header?: { ColData: Array<{ value: string }> };
  Summary?: { ColData: Array<{ value: string }> };
  ColData?: Array<{ value: string }>;
  Rows?: { Row: QBORow[] };
}

export async function getBalanceSheet(
  accessToken: string,
  realmId: string,
  asOfDate: string      // YYYY-MM-DD
): Promise<BalanceSheetSnapshot> {
  const data = await qboFetch(
    accessToken,
    realmId,
    `reports/BalanceSheet?date_macro=Today&as_of_date=${asOfDate}`
  ) as { Rows: { Row: QBORow[] } };

  const rows = data.Rows?.Row ?? [];

  function findSectionTotal(label: string): number {
    const section = rows.find((r) => r.Header?.ColData?.[0]?.value === label);
    if (!section?.Summary?.ColData) return 0;
    return parseFloat(section.Summary.ColData[1]?.value ?? "0");
  }

  // Drill into Assets → Current Assets → Cash sub-section
  const assetsSection = rows.find((r) => r.Header?.ColData?.[0]?.value === "Assets");
  const currentAssets = assetsSection?.Rows?.Row?.find(
    (r) => r.Header?.ColData?.[0]?.value === "Current Assets"
  );
  const cashRow = currentAssets?.Rows?.Row?.find(
    (r) => r.Header?.ColData?.[0]?.value === "Bank Accounts"
  );
  const cash = parseFloat(cashRow?.Summary?.ColData?.[1]?.value ?? "0");

  return {
    date: asOfDate,
    cashAndEquivalents: cash,
    totalAssets: findSectionTotal("Assets"),
    totalLiabilities: findSectionTotal("Liabilities"),
    equity: findSectionTotal("Equity"),
  };
}
