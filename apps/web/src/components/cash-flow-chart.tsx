"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jul", inflow: 165000, outflow: 230000, net: -65000 },
  { month: "Aug", inflow: 178000, outflow: 245000, net: -67000 },
  { month: "Sep", inflow: 182000, outflow: 258000, net: -76000 },
  { month: "Oct", inflow: 195000, outflow: 262000, net: -67000 },
  { month: "Nov", inflow: 201000, outflow: 271000, net: -70000 },
  { month: "Dec", inflow: 189000, outflow: 287000, net: -98000 },
  { month: "Jan", inflow: 210000, outflow: 280000, net: -70000 },
  { month: "Feb", inflow: 220000, outflow: 287000, net: -67000 },
  { month: "Mar*", inflow: 235000, outflow: 285000, net: -50000 },
  { month: "Apr*", inflow: 248000, outflow: 282000, net: -34000 },
  { month: "May*", inflow: 260000, outflow: 278000, net: -18000 },
  { month: "Jun*", inflow: 275000, outflow: 275000, net: 0 },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-xs space-y-1.5 min-w-[140px]">
      <div className="font-semibold text-text-primary">{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex justify-between gap-4">
          <span className="text-text-muted capitalize">
            {entry.dataKey === "net"
              ? "Net"
              : entry.dataKey === "inflow"
                ? "Revenue"
                : "Expenses"}
          </span>
          <span style={{ color: entry.color }} className="font-mono font-medium">
            ${(entry.value / 1000).toFixed(0)}K
          </span>
        </div>
      ))}
    </div>
  );
}

export function CashFlowChart() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Cash Flow</h2>
          <p className="text-sm text-text-muted">
            Last 8 months + 4-month forecast
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1.5 rounded-full bg-brand-emerald" />
            <span className="text-text-muted">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1.5 rounded-full bg-negative" />
            <span className="text-text-muted">Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1.5 rounded-full bg-brand-azure" />
            <span className="text-text-muted">Net</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D68F" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#00D68F" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1A2744"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
            tickFormatter={(v) => `$${v / 1000}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="inflow"
            stroke="#00D68F"
            fill="url(#inflowGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="outflow"
            stroke="#F43F5E"
            fill="url(#outflowGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="net"
            stroke="#1B7FE3"
            fill="none"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
