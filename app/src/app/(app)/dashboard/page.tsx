"use client";

import { useEffect, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Zap,
  Calendar,
  ArrowUpRight,
  DollarSign,
  Users,
  CreditCard,
} from "lucide-react";
import type { RunwayAnalysis } from "@/lib/engine/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

// ── MOCK DATA ──────────────────────────────────────────────────────────────────

const cashflowData = [
  { month: "Sep", cash: 742000, burn: 240000, revenue: 198000 },
  { month: "Oct", cash: 698000, burn: 255000, revenue: 211000 },
  { month: "Nov", cash: 651000, burn: 268000, revenue: 226000 },
  { month: "Dec", cash: 609000, burn: 249000, revenue: 241000 },
  { month: "Jan", cash: 598000, burn: 262000, revenue: 258000 },
  { month: "Feb", cash: 574000, burn: 287000, revenue: 271000 },
  { month: "Mar", cash: 510000, burn: 290000, revenue: 285000 },
  { month: "Apr", cash: 448000, burn: 295000, revenue: 299000 },
  { month: "May", cash: 398000, burn: 298000, revenue: 315000 },
  { month: "Jun", cash: 369000, burn: 295000, revenue: 331000 },
  { month: "Jul", cash: 358000, burn: 292000, revenue: 348000 },
  { month: "Aug", cash: 378000, burn: 288000, revenue: 366000 },
];

const expenseData = [
  { name: "Payroll", value: 187000, pct: 65 },
  { name: "Marketing", value: 24000, pct: 8.4 },
  { name: "Other", value: 53800, pct: 18.9 },
  { name: "SaaS", value: 12400, pct: 4.3 },
  { name: "Cloud", value: 9800, pct: 3.4 },
];

const aiInsights = [
  {
    severity: "critical" as const,
    title: "Burn rate discrepancy detected",
    body: "Your burn rate is $287K/mo but books show $240K — you're missing $47K in accrued liabilities. At current burn, cash runs out August 14th.",
    action: "View accruals →",
  },
  {
    severity: "warning" as const,
    title: "3 overdue invoices totalling $94K",
    body: "Average age: 38 days. Collecting these immediately extends runway to September 2nd — gain 19 days.",
    action: "Send reminders →",
  },
  {
    severity: "opportunity" as const,
    title: "4 unused SaaS subscriptions found",
    body: "Cut $2,800/mo in zero-utilization tools. Combined with AR collection, runway extends to November 2nd.",
    action: "Review subscriptions →",
  },
  {
    severity: "info" as const,
    title: "Series A readiness: 73%",
    body: "You have 6 months to close. Missing: audited financials, 12-mo forecast model, data room. I can generate these.",
    action: "Build data room →",
  },
];

const metrics = [
  { label: "Cash Balance", value: formatCurrency(574000, { compact: true }), change: "-5.6%", trend: "down" as const, sub: "Updated 2h ago", icon: DollarSign, color: "var(--accent)" },
  { label: "Monthly Burn", value: formatCurrency(287000, { compact: true }), change: "+9.5%", trend: "up" as const, sub: "vs last month", icon: TrendingDown, color: "var(--red)" },
  { label: "Runway", value: "5.8 mo", change: "-0.4 mo", trend: "down" as const, sub: "Aug 14, 2026", icon: Calendar, color: "var(--amber)" },
  { label: "MRR", value: formatCurrency(271000, { compact: true }), change: "+5.1%", trend: "up" as const, sub: "vs last month", icon: TrendingUp, color: "var(--green)" },
  { label: "Headcount", value: "34", change: "+2", trend: "up" as const, sub: "2 new hires", icon: Users, color: "var(--purple)" },
  { label: "Gross Margin", value: "71%", change: "+1.2pt", trend: "up" as const, sub: "SaaS gross margin", icon: CreditCard, color: "var(--green)" },
];

const severityStyles = {
  critical:    { bar: "var(--red)", bg: "var(--red-dim)", border: "rgba(239,68,68,0.2)", icon: AlertTriangle, iconColor: "var(--red)" },
  warning:     { bar: "var(--amber)", bg: "var(--amber-dim)", border: "rgba(245,158,11,0.2)", icon: AlertTriangle, iconColor: "var(--amber)" },
  opportunity: { bar: "var(--green)", bg: "var(--green-dim)", border: "rgba(16,185,129,0.2)", icon: Zap, iconColor: "var(--green)" },
  info:        { bar: "var(--accent)", bg: "var(--accent-dim)", border: "rgba(59,130,246,0.2)", icon: Zap, iconColor: "var(--accent)" },
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; stroke?: string; fill?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 text-sm shadow-xl" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
      <p className="font-semibold mb-2" style={{ color: "var(--text)" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.stroke || p.fill }} />
          <span style={{ color: "var(--text-2)" }}>{p.name}:</span>
          <span className="font-semibold" style={{ color: "var(--text)" }}>{formatCurrency(p.value, { compact: true })}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [runwayAnalysis, setRunwayAnalysis] = useState<RunwayAnalysis | null>(null);

  useEffect(() => {
    fetch("/api/engine/run")
      .then((r) => r.json())
      .then((data: { runwayAnalysis: RunwayAnalysis }) => setRunwayAnalysis(data.runwayAnalysis))
      .catch(() => {/* non-critical */});
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Good morning, Alex 👋</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>
            Acme Corp · February 23, 2026 · <span style={{ color: "var(--red)" }}>⚠ 3 items need attention</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm px-4 py-2 rounded-xl font-medium" style={{ background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)" }}>Connect data</button>
          <button className="text-sm px-4 py-2 rounded-xl font-semibold flex items-center gap-2" style={{ background: "var(--accent)", color: "white" }}>
            <Zap size={14} />Ask HelmCFO
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-6 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          const isDown = m.trend === "down";
          return (
            <div key={m.label} className="rounded-xl p-4 space-y-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-3)" }}>{m.label}</span>
                <Icon size={13} style={{ color: m.color }} />
              </div>
              <div className="text-xl font-bold" style={{ color: "var(--text)" }}>{m.value}</div>
              <div className="flex items-center gap-1.5">
                {isDown ? <TrendingDown size={11} style={{ color: "var(--red)" }} /> : <TrendingUp size={11} style={{ color: "var(--green)" }} />}
                <span className="text-[11px] font-semibold" style={{ color: isDown ? "var(--red)" : "var(--green)" }}>{m.change}</span>
                <span className="text-[11px]" style={{ color: "var(--text-3)" }}>{m.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5">
          {/* Cash flow chart */}
          <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Cash Flow & Runway</h2>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>Historical · 6mo forecast · Base scenario</p>
              </div>
              <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--text-3)" }}>
                {[{ color: "var(--accent)", label: "Cash" }, { color: "var(--red)", label: "Burn" }, { color: "var(--green)", label: "Revenue" }].map(({ color, label }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={cashflowData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,186,0.08)" />
                <XAxis dataKey="month" tick={{ fill: "#4f5b72", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => formatCurrency(v, { compact: true })} tick={{ fill: "#4f5b72", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="cash" name="Cash balance" stroke="#3b82f6" strokeWidth={2} fill="url(#cashGrad)" dot={false} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={1.5} fill="url(#revGrad)" dot={false} strokeDasharray="4 2" />
                <Area type="monotone" dataKey="burn" name="Burn rate" stroke="#ef4444" strokeWidth={1.5} fill="none" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Expense breakdown */}
          <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Expense Breakdown</h2>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>February 2026 · $287K total</p>
              </div>
              <ArrowUpRight size={16} style={{ color: "var(--text-3)" }} />
            </div>
            <div className="space-y-3">
              {expenseData.map((item, idx) => {
                const colors = ["linear-gradient(90deg,#3b82f6,#818cf8)", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"];
                return (
                  <div key={item.name}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span style={{ color: "var(--text-2)" }}>{item.name}</span>
                      <span className="font-semibold" style={{ color: "var(--text)" }}>
                        {formatCurrency(item.value, { compact: true })}
                        <span className="font-normal ml-1.5" style={{ color: "var(--text-3)" }}>{item.pct}%</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full w-full" style={{ background: "var(--surface-3)" }}>
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: colors[idx] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>AI Insights</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>4 actions</span>
          </div>

          {aiInsights.map((insight, i) => {
            const styles = severityStyles[insight.severity];
            const Icon = styles.icon;
            return (
              <div key={i} className="rounded-2xl p-4 space-y-2.5 cursor-pointer" style={{ background: styles.bg, border: `1px solid ${styles.border}` }}>
                <div className="flex items-start gap-2.5">
                  <Icon size={14} style={{ color: styles.iconColor, marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--text)" }}>{insight.title}</p>
                    <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color: "var(--text-2)" }}>{insight.body}</p>
                    <button className="mt-2 text-[11px] font-semibold" style={{ color: styles.iconColor }}>{insight.action}</button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Runway scenarios */}
          <div className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--text-3)" }}>Runway scenarios</p>
            {[
              { label: "Bear", date: "Jun 22, 2026", months: 4.0, color: "var(--red)" },
              { label: "Base", date: "Aug 14, 2026", months: 5.8, color: "var(--amber)" },
              { label: "Bull", date: "Nov 2, 2026", months: 8.4, color: "var(--green)" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 py-2">
                <span className="text-[10px] w-8 font-mono font-bold" style={{ color: s.color }}>{s.label}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--surface-3)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(s.months / 12) * 100}%`, background: s.color }} />
                </div>
                <span className="text-[11px] w-14 text-right font-mono" style={{ color: "var(--text-2)" }}>{s.months} mo</span>
              </div>
            ))}
            <button className="mt-3 text-[12px] font-medium w-full text-center py-2 rounded-xl" style={{ background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)" }}>
              Edit assumptions →
            </button>
          </div>

          {/* Live Runway Sensitivity from Engine */}
          {runwayAnalysis && (
            <div className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--text-3)" }}>
                Sensitivity analysis
              </p>
              <div className="space-y-1.5">
                {runwayAnalysis.sensitivityTable
                  .slice()
                  .sort((a, b) => b.deltaRunwayMonths - a.deltaRunwayMonths)
                  .map((lever) => (
                    <div key={lever.lever} className="flex items-center justify-between py-1.5 px-2 rounded-lg" style={{ background: "var(--surface-2)" }}>
                      <span className="text-[11px]" style={{ color: "var(--text-2)" }}>{lever.lever}</span>
                      <span className="text-[11px] font-mono font-semibold" style={{ color: lever.deltaRunwayMonths > 1 ? "var(--green)" : lever.deltaRunwayMonths > 0 ? "var(--amber)" : "var(--text-3)" }}>
                        +{lever.deltaRunwayMonths.toFixed(1)} mo
                      </span>
                    </div>
                  ))}
              </div>
              <p className="text-[10px] mt-3" style={{ color: "var(--text-3)" }}>
                Current runway: <span className="font-mono font-semibold" style={{ color: runwayAnalysis.baseRunwayMonths < 3 ? "var(--red)" : runwayAnalysis.baseRunwayMonths < 6 ? "var(--amber)" : "var(--green)" }}>{runwayAnalysis.baseRunwayMonths.toFixed(1)} mo</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
