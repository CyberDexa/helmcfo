// ── SHARED MOCK DATA & TYPES ───────────────────────────────────────────────────
// In production this would be fetched from the API layer (Plaid, QBO, Stripe).

export type Scenario = "bear" | "base" | "bull";

// ── CASH FLOW ─────────────────────────────────────────────────────────────────
export interface CashFlowMonth {
  month: string;
  cash: number;
  burn: number;
  revenue: number;
  forecast?: boolean;
}

export const cashflowHistory: CashFlowMonth[] = [
  { month: "Sep '25", cash: 742000, burn: 240000, revenue: 198000 },
  { month: "Oct '25", cash: 698000, burn: 255000, revenue: 211000 },
  { month: "Nov '25", cash: 651000, burn: 268000, revenue: 226000 },
  { month: "Dec '25", cash: 609000, burn: 249000, revenue: 241000 },
  { month: "Jan '26", cash: 598000, burn: 262000, revenue: 258000 },
  { month: "Feb '26", cash: 574000, burn: 287000, revenue: 271000 },
];

export const cashflowForecast: Record<Scenario, CashFlowMonth[]> = {
  bear: [
    { month: "Mar '26", cash: 490000, burn: 310000, revenue: 268000, forecast: true },
    { month: "Apr '26", cash: 404000, burn: 318000, revenue: 275000, forecast: true },
    { month: "May '26", cash: 318000, burn: 322000, revenue: 280000, forecast: true },
    { month: "Jun '26", cash: 234000, burn: 320000, revenue: 286000, forecast: true },
    { month: "Jul '26", cash: 148000, burn: 315000, revenue: 291000, forecast: true },
    { month: "Aug '26", cash: 72000, burn: 310000, revenue: 296000, forecast: true },
  ],
  base: [
    { month: "Mar '26", cash: 510000, burn: 290000, revenue: 285000, forecast: true },
    { month: "Apr '26", cash: 448000, burn: 295000, revenue: 299000, forecast: true },
    { month: "May '26", cash: 398000, burn: 298000, revenue: 315000, forecast: true },
    { month: "Jun '26", cash: 369000, burn: 295000, revenue: 331000, forecast: true },
    { month: "Jul '26", cash: 358000, burn: 292000, revenue: 348000, forecast: true },
    { month: "Aug '26", cash: 378000, burn: 288000, revenue: 366000, forecast: true },
  ],
  bull: [
    { month: "Mar '26", cash: 534000, burn: 270000, revenue: 318000, forecast: true },
    { month: "Apr '26", cash: 506000, burn: 272000, revenue: 342000, forecast: true },
    { month: "May '26", cash: 492000, burn: 275000, revenue: 368000, forecast: true },
    { month: "Jun '26", cash: 497000, burn: 274000, revenue: 396000, forecast: true },
    { month: "Jul '26", cash: 524000, burn: 272000, revenue: 427000, forecast: true },
    { month: "Aug '26", cash: 578000, burn: 270000, revenue: 460000, forecast: true },
  ],
};

// Runway end dates per scenario
export const runwayDates: Record<Scenario, { label: string; months: number }> = {
  bear: { label: "Jun 22, 2026", months: 4.0 },
  base: { label: "Aug 14, 2026", months: 5.8 },
  bull: { label: "Nov 2, 2026", months: 8.4 },
};

// ── EXPENSES ──────────────────────────────────────────────────────────────────
export interface ExpenseCategory {
  name: string;
  value: number;
  pct: number;
  trend: "up" | "down" | "flat";
  delta: number;
}

export const expenses: ExpenseCategory[] = [
  { name: "Payroll", value: 187000, pct: 65.2, trend: "up", delta: 3.1 },
  { name: "Marketing", value: 24000, pct: 8.4, trend: "up", delta: 12.0 },
  { name: "Other", value: 28800, pct: 10.0, trend: "flat", delta: 0.4 },
  { name: "SaaS tools", value: 12400, pct: 4.3, trend: "down", delta: -5.6 },
  { name: "Cloud infra", value: 9800, pct: 3.4, trend: "up", delta: 8.2 },
  { name: "Office & G&A", value: 25000, pct: 8.7, trend: "flat", delta: -0.5 },
];

// ── HEADCOUNT ────────────────────────────────────────────────────────────────
export interface Employee {
  id: string;
  name: string;
  role: string;
  dept: string;
  salary: number; // annual
  equity: number; // % as decimal
  startDate: string;
  status: "active" | "onboarding" | "open";
}

export const employees: Employee[] = [
  { id: "e1", name: "Alex Chen", role: "CEO", dept: "Executive", salary: 180000, equity: 0.08, startDate: "2024-01-01", status: "active" },
  { id: "e2", name: "Sarah Kim", role: "CTO", dept: "Engineering", salary: 200000, equity: 0.06, startDate: "2024-01-01", status: "active" },
  { id: "e3", name: "Marcus Reid", role: "Head of AI", dept: "Engineering", salary: 195000, equity: 0.04, startDate: "2024-03-01", status: "active" },
  { id: "e4", name: "Priya Nair", role: "Sr. Full-Stack Eng", dept: "Engineering", salary: 165000, equity: 0.015, startDate: "2024-04-15", status: "active" },
  { id: "e5", name: "Tyler Brooks", role: "Sr. Full-Stack Eng", dept: "Engineering", salary: 162000, equity: 0.015, startDate: "2024-06-01", status: "active" },
  { id: "e6", name: "Zoe Wang", role: "ML Engineer", dept: "Engineering", salary: 175000, equity: 0.012, startDate: "2024-07-01", status: "active" },
  { id: "e7", name: "James Liu", role: "Head of Growth", dept: "GTM", salary: 150000, equity: 0.02, startDate: "2024-05-01", status: "active" },
  { id: "e8", name: "Fatima Hassan", role: "Account Executive", dept: "GTM", salary: 90000, equity: 0.005, startDate: "2024-09-01", status: "active" },
  { id: "e9", name: "Noah Park", role: "DevOps Engineer", dept: "Engineering", salary: 145000, equity: 0.008, startDate: "2024-10-01", status: "active" },
  { id: "e10", name: "Isabella Torres", role: "Product Designer", dept: "Product", salary: 140000, equity: 0.01, startDate: "2024-11-01", status: "active" },
  { id: "e11", name: "Ryan Osei", role: "Sr. Backend Eng", dept: "Engineering", salary: 168000, equity: 0.012, startDate: "2025-01-15", status: "active" },
  { id: "e12", name: "Chloe Martin", role: "Customer Success", dept: "GTM", salary: 85000, equity: 0.004, startDate: "2025-02-01", status: "active" },
  { id: "e13", name: "Open Role", role: "Sr. Data Eng", dept: "Engineering", salary: 170000, equity: 0.012, startDate: "", status: "open" },
  { id: "e14", name: "Open Role", role: "Account Executive", dept: "GTM", salary: 95000, equity: 0.005, startDate: "", status: "open" },
];

export const deptColors: Record<string, string> = {
  Engineering: "#3b82f6",
  GTM: "#10b981",
  Product: "#8b5cf6",
  Executive: "#f59e0b",
};

// ── INVOICES ─────────────────────────────────────────────────────────────────
export interface Invoice {
  id: string;
  customer: string;
  amount: number;
  dueDate: string;
  status: "paid" | "overdue" | "pending";
  daysOverdue?: number;
}

export const invoices: Invoice[] = [
  { id: "INV-041", customer: "Nexus Systems", amount: 42000, dueDate: "2026-01-16", status: "overdue", daysOverdue: 38 },
  { id: "INV-039", customer: "Orbit Analytics", amount: 31000, dueDate: "2026-01-22", status: "overdue", daysOverdue: 32 },
  { id: "INV-037", customer: "Cascade Health", amount: 21000, dueDate: "2026-01-28", status: "overdue", daysOverdue: 26 },
  { id: "INV-044", customer: "Delta Freight", amount: 18500, dueDate: "2026-02-28", status: "pending" },
  { id: "INV-045", customer: "Vertex AI Corp", amount: 24000, dueDate: "2026-03-05", status: "pending" },
  { id: "INV-038", customer: "Pioneer Labs", amount: 14200, dueDate: "2026-01-30", status: "paid" },
  { id: "INV-036", customer: "Summit Capital", amount: 9800, dueDate: "2026-01-15", status: "paid" },
];

// ── METRICS (current snapshot) ────────────────────────────────────────────────
export const currentMetrics = {
  cashBalance: 574000,
  monthlyBurn: 287000,
  runwayMonths: 5.8,
  mrr: 271000,
  headcount: 34,
  grossMargin: 71,
  arr: 3252000,
  customers: 87,
  nrr: 118,
  cac: 4200,
  ltv: 29800,
  ltvCacRatio: 7.1,
};
