/**
 * Xero data sync — pulls P&L, balance sheet, and cash flow from a connected Xero organisation
 * and normalises the data into the canonical HelmCFO financial model.
 */
import { NextRequest, NextResponse } from "next/server";

// Xero report IDs
const XERO_REPORTS = {
  PL: "ProfitAndLoss",
  BS: "BalanceSheet",
  CF: "CashSummary",
  TB: "TrialBalance",
} as const;

interface XeroReportRow {
  RowType: "Header" | "Section" | "Row" | "SummaryRow";
  Title?: string;
  Cells?: Array<{ Value: string; Attributes?: Array<{ Value: string; Id: string }> }>;
  Rows?: XeroReportRow[];
}

interface XeroReport {
  ReportID: string;
  ReportName: string;
  ReportType: string;
  ReportTitles: string[];
  ReportDate: string;
  Rows: XeroReportRow[];
}

/**
 * Fetch a Xero report for a given tenant.
 */
async function fetchXeroReport(
  accessToken: string,
  tenantId: string,
  reportId: string,
  params: Record<string, string> = {}
): Promise<XeroReport> {
  const qs = new URLSearchParams({ ...params }).toString();
  const url = `https://api.xero.com/api.xro/2.0/Reports/${reportId}${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Xero-tenant-id": tenantId,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Xero report ${reportId} failed: ${res.status}`);
  }

  const data = await res.json();
  return data.Reports?.[0] as XeroReport;
}

/**
 * Flatten Xero report rows into a simple key→value map using cell values.
 */
function flattenRows(rows: XeroReportRow[]): Record<string, number> {
  const result: Record<string, number> = {};

  function walk(row: XeroReportRow) {
    if (row.RowType === "Row" && row.Cells && row.Cells.length >= 2) {
      const label = row.Cells[0].Value.trim();
      const value = parseFloat(row.Cells[1].Value.replace(/[^0-9.-]/g, "")) || 0;
      if (label) result[label] = value;
    }
    if (row.Rows) row.Rows.forEach(walk);
  }

  rows.forEach(walk);
  return result;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { accessToken: string; tenantId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const { accessToken, tenantId } = body;
  if (!accessToken || !tenantId) {
    return NextResponse.json({ ok: false, error: "accessToken and tenantId are required" }, { status: 422 });
  }

  // Fetch all reports in parallel
  const today = new Date();
  const periodStart = new Date(today.getFullYear(), today.getMonth() - 12, 1).toISOString().slice(0, 10);
  const periodEnd = today.toISOString().slice(0, 10);
  const dateParams = { fromDate: periodStart, toDate: periodEnd };

  const [pl, bs] = await Promise.all([
    fetchXeroReport(accessToken, tenantId, XERO_REPORTS.PL, dateParams),
    fetchXeroReport(accessToken, tenantId, XERO_REPORTS.BS),
  ]);

  const plData = flattenRows(pl.Rows);
  const bsData = flattenRows(bs.Rows);

  // Normalise to HelmCFO canonical shape
  const snapshot = {
    source: "xero" as const,
    tenantId,
    reportDate: periodEnd,
    income: {
      totalRevenue: plData["Total Revenue"] ?? plData["Total Income"] ?? 0,
    },
    expenses: {
      totalOperating: plData["Total Operating Expenses"] ?? plData["Total Expenses"] ?? 0,
      payroll: plData["Wages and Salaries"] ?? plData["Payroll"] ?? 0,
      cogs: plData["Total Cost of Sales"] ?? plData["Cost of Sales"] ?? 0,
    },
    profitability: {
      grossProfit: plData["Gross Profit"] ?? 0,
      netProfit: plData["Net Profit"] ?? plData["Net Income"] ?? 0,
      ebitda: (plData["Net Profit"] ?? 0) + (plData["Depreciation"] ?? 0) + (plData["Amortisation"] ?? 0),
    },
    balance: {
      cash: bsData["Cash"] ?? bsData["Bank"] ?? 0,
      totalAssets: bsData["Total Assets"] ?? 0,
      totalLiabilities: bsData["Total Liabilities"] ?? 0,
      equity: bsData["Total Equity"] ?? 0,
    },
    raw: { pl: plData, bs: bsData },
  };

  return NextResponse.json({ ok: true, snapshot });
}
