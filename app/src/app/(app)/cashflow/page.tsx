"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendingDown, TrendingUp, Info, Download, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cashflowHistory, cashflowForecast, expenses, invoices, type Scenario } from "@/lib/data";

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; stroke?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 text-sm shadow-xl" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
      <p className="font-semibold mb-2" style={{ color: "var(--text)" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.stroke }} />
          <span style={{ color: "var(--text-2)" }}>{p.name}:</span>
          <span className="font-semibold" style={{ color: "var(--text)" }}>{formatCurrency(p.value, { compact: true })}</span>
        </div>
      ))}
    </div>
  );
}

const scenarioBadge: Record<Scenario, { label: string; color: string; bg: string; border: string }> = {
  bear: { label: "Bear", color: "var(--red)", bg: "var(--red-dim)", border: "rgba(239,68,68,0.2)" },
  base: { label: "Base", color: "var(--amber)", bg: "var(--amber-dim)", border: "rgba(245,158,11,0.2)" },
  bull: { label: "Bull", color: "var(--green)", bg: "var(--green-dim)", border: "rgba(16,185,129,0.2)" },
};

const expenseChartColors = ["#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b", "#14b8a6"];

// Monthly expenses for bar chart
const expenseMonths = [
  { month: "Sep", payroll: 178000, marketing: 18000, saas: 13000, cloud: 8800, other: 21200 },
  { month: "Oct", payroll: 178000, marketing: 20000, saas: 13200, cloud: 9100, other: 34700 },
  { month: "Nov", payroll: 185000, marketing: 22000, saas: 12800, cloud: 9400, other: 38800 },
  { month: "Dec", payroll: 185000, marketing: 19000, saas: 12400, cloud: 9000, other: 23600 },
  { month: "Jan", payroll: 187000, marketing: 21000, saas: 12400, cloud: 9600, other: 32000 },
  { month: "Feb", payroll: 187000, marketing: 24000, saas: 12400, cloud: 9800, other: 53800 },
];

export default function CashFlowPage() {
  const [scenario, setScenario] = useState<Scenario>("base");
  const chartData = [...cashflowHistory, ...cashflowForecast[scenario]];
  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  const overdueTotal = overdueInvoices.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Cash Flow</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>12-month view · Historical + AI forecast · Updated Feb 23, 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm px-3 py-2 rounded-xl font-medium flex items-center gap-2" style={{ background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)" }}>
            <RefreshCw size={13} /> Sync data
          </button>
          <button className="text-sm px-3 py-2 rounded-xl font-medium flex items-center gap-2" style={{ background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)" }}>
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Current Cash", value: formatCurrency(574000, { compact: true }), sub: "as of Feb 23", color: "var(--accent)", trend: null },
          { label: "Monthly Burn", value: formatCurrency(287000, { compact: true }), sub: "+9.5% vs Jan", color: "var(--red)", trend: "up" as const },
          { label: "Net Cash Burn", value: formatCurrency(-16000, { compact: true }), sub: "revenue - burn", color: "var(--amber)", trend: null },
          { label: "Overdue AR", value: formatCurrency(overdueTotal, { compact: true }), sub: `${overdueInvoices.length} invoices`, color: "var(--red)", trend: null },
        ].map((k) => (
          <div key={k.label} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: "var(--text-3)" }}>{k.label}</p>
            <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{k.value}</p>
            <div className="flex items-center gap-1.5 mt-1">
              {k.trend === "up" && <TrendingUp size={11} style={{ color: "var(--red)" }} />}
              <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Cash Balance & Burn Trajectory</h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>Shaded area = forecast. Dashed = revenue.</p>
          </div>
          {/* Scenario selector */}
          <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            {(["bear", "base", "bull"] as Scenario[]).map((s) => (
              <button key={s} onClick={() => setScenario(s)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                style={scenario === s
                  ? { background: scenarioBadge[s].bg, color: scenarioBadge[s].color, border: `1px solid ${scenarioBadge[s].border}` }
                  : { color: "var(--text-3)", border: "1px solid transparent" }}>
                {scenarioBadge[s].label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id="cashGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,186,0.07)" />
            <XAxis dataKey="month" tick={{ fill: "#4f5b72", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => formatCurrency(v, { compact: true })} tick={{ fill: "#4f5b72", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 2" />
            <Area type="monotone" dataKey="cash" name="Cash balance" stroke="#3b82f6" strokeWidth={2.5} fill="url(#cashGrad2)" dot={false} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={1.5} fill="none" dot={false} strokeDasharray="5 3" />
            <Area type="monotone" dataKey="burn" name="Burn rate" stroke="#ef4444" strokeWidth={1.5} fill="none" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-5">
        {/* Expense bar chart */}
        <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>Expense Composition</h2>
          <p className="text-[12px] mb-4" style={{ color: "var(--text-3)" }}>6-month stacked breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={expenseMonths} margin={{ top: 0, right: 0, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,186,0.07)" />
              <XAxis dataKey="month" tick={{ fill: "#4f5b72", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => formatCurrency(v, { compact: true })} tick={{ fill: "#4f5b72", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {["payroll", "marketing", "cloud", "saas", "other"].map((k, i) => (
                <Bar key={k} dataKey={k} name={k.charAt(0).toUpperCase() + k.slice(1)} stackId="a"
                  fill={expenseChartColors[i]} radius={i === 4 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Overdue invoices */}
        <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Accounts Receivable</h2>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>Open & overdue invoices</p>
            </div>
            <div className="px-2.5 py-1 rounded-lg text-[11px] font-semibold" style={{ background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {formatCurrency(overdueTotal, { compact: true })} overdue
            </div>
          </div>
          <div className="space-y-2">
            {invoices.slice(0, 7).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{inv.customer}</p>
                  <p className="text-[11px] font-mono" style={{ color: "var(--text-3)" }}>{inv.id} · Due {inv.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold" style={{ color: "var(--text)" }}>{formatCurrency(inv.amount, { compact: true })}</p>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                    style={inv.status === "overdue"
                      ? { background: "var(--red-dim)", color: "var(--red)" }
                      : inv.status === "pending"
                      ? { background: "var(--amber-dim)", color: "var(--amber)" }
                      : { background: "var(--green-dim)", color: "var(--green)" }}>
                    {inv.status === "overdue" ? `${inv.daysOverdue}d overdue` : inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
