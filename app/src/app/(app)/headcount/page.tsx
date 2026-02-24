"use client";

import { useState } from "react";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie,
} from "recharts";
import { UserPlus, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { employees, deptColors } from "@/lib/data";

const MULTIPLIER = 1.25; // fully-loaded cost factor (benefits, taxes, equity)

// Aggregate by dept
const deptMap: Record<string, { total: number; count: number; color: string }> = {};
employees.filter((e) => e.status === "active").forEach((e) => {
  if (!deptMap[e.dept]) deptMap[e.dept] = { total: 0, count: 0, color: deptColors[e.dept] ?? "#3b82f6" };
  deptMap[e.dept].total += e.salary * MULTIPLIER;
  deptMap[e.dept].count++;
});
const deptBreakdown = Object.entries(deptMap).map(([name, v]) => ({ name, ...v }));

const totalPayroll = employees
  .filter((e) => e.status === "active")
  .reduce((sum, e) => sum + e.salary * MULTIPLIER, 0) / 12;

const CASH = 574000;
const BURN = 287000;
const RUNWAY_MONTHS = 5.8;

function RunwayBar({ extra }: { extra: number }) {
  const newBurn = BURN + extra / 12;
  const runway = CASH / newBurn;
  const pct = Math.min(100, (runway / 12) * 100);
  const color = runway < 3 ? "#ef4444" : runway < 6 ? "#f59e0b" : "#10b981";
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1" style={{ color: "var(--text-3)" }}>
        <span>New runway</span>
        <span className="font-semibold font-mono" style={{ color }}>{runway.toFixed(1)} mo</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function HeadcountPage() {
  const [hireRole, setHireRole] = useState("");
  const [hireDept, setHireDept] = useState("Engineering");
  const [hireSalary, setHireSalary] = useState(160000);
  const [planOpen, setPlanOpen] = useState(false);

  const fullyLoaded = (s: number) => s * MULTIPLIER;
  const activeEmps = employees.filter((e) => e.status === "active");
  const openRoles = employees.filter((e) => e.status === "open");

  const statusColor: Record<string, string> = {
    active: "#10b981",
    open: "#f59e0b",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Headcount & Payroll</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>{activeEmps.length} active · {openRoles.length} open roles · Fully-loaded at 1.25×</p>
        </div>
        <button
          onClick={() => setPlanOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <UserPlus size={14} />
          Plan Hire
        </button>
      </div>

      {/* KPI strip */}

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Monthly payroll (fully-loaded)", value: formatCurrency(totalPayroll, { compact: true }), sub: "×1.25 benefits + taxes" },
          { label: "% of burn", value: `${((totalPayroll / BURN) * 100).toFixed(0)}%`, sub: `of ${formatCurrency(BURN, { compact: true })}/mo burn` },
          { label: "Active headcount", value: String(activeEmps.length), sub: `${openRoles.length} open roles queued` },
          { label: "Avg fully-loaded cost", value: formatCurrency(totalPayroll / activeEmps.length, { compact: true }), sub: "per person / mo" },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--text-3)" }}>{k.label}</p>
            <p className="text-2xl font-bold font-mono" style={{ color: "var(--text)" }}>{k.value}</p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-3)" }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Dept breakdown + Chart */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text)" }}>Monthly Payroll by Department</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={deptBreakdown} margin={{ top: 0, right: 4, bottom: 0, left: -10 }} barSize={32} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,186,0.07)" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => formatCurrency(v / 12, { compact: true })} tick={{ fill: "#4f5b72", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#8491a3", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(v: number | undefined) => [v != null ? formatCurrency(v / 12, { compact: true }) : "—", "Monthly payroll"]} contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                {deptBreakdown.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="text-[14px] font-semibold mb-2" style={{ color: "var(--text)" }}>Headcount Split</h2>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={deptBreakdown} dataKey="count" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3}>
                {deptBreakdown.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {deptBreakdown.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span style={{ color: "var(--text-2)" }}>{d.name}</span>
                </div>
                <span className="font-semibold" style={{ color: "var(--text)" }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Team Roster</h2>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ background: "var(--surface-2)" }}>
              {["Name", "Role", "Department", "Base Salary", "Loaded Cost / Mo", "Equity", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-3)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((e, i) => (
              <tr key={e.name} style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>{e.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--text-2)" }}>{e.role}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: `${deptColors[e.dept]}22`, color: deptColors[e.dept] }}>
                    {e.dept}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono" style={{ color: "var(--text-2)" }}>
                  {e.status === "open" ? "—" : formatCurrency(e.salary, { compact: false })}
                </td>
                <td className="px-4 py-3 font-mono font-semibold" style={{ color: "var(--text)" }}>
                  {e.status === "open" ? "—" : formatCurrency(fullyLoaded(e.salary) / 12, { compact: true })}
                </td>
                <td className="px-4 py-3 font-mono text-[11px]" style={{ color: "var(--text-3)" }}>{e.equity}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: `${statusColor[e.status]}22`, color: statusColor[e.status] }}>
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Plan Hire Panel */}
      {planOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setPlanOpen(false); }}>
          <div className="rounded-2xl p-6 w-[420px] space-y-4" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div>
              <h3 className="text-[16px] font-bold" style={{ color: "var(--text)" }}>Plan a Hire</h3>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>See the runway impact before you commit.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-3)" }}>Role title</label>
                <input className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-1"
                   style={{ background: "var(--surface-3)", border: "1px solid var(--border)", color: "var(--text)" }}
                  value={hireRole} onChange={(e) => setHireRole(e.target.value)} placeholder="e.g. Senior Backend Engineer" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-3)" }}>Department</label>
                  <select className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--surface-3)", border: "1px solid var(--border)", color: "var(--text)" }}
                    value={hireDept} onChange={(e) => setHireDept(e.target.value)}>
                    {Object.keys(deptColors).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-3)" }}>Annual salary</label>
                  <input type="number" step={10000}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--surface-3)", border: "1px solid var(--border)", color: "var(--text)" }}
                    value={hireSalary} onChange={(e) => setHireSalary(Number(e.target.value))} />
                </div>
              </div>
              <div className="p-4 rounded-xl space-y-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>Runway impact</p>
                <div className="flex justify-between text-[12px]">
                  <span style={{ color: "var(--text-2)" }}>Current runway</span>
                  <span className="font-mono font-semibold" style={{ color: "var(--green)" }}>{RUNWAY_MONTHS} mo</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span style={{ color: "var(--text-2)" }}>Fully-loaded annual cost</span>
                  <span className="font-mono font-semibold" style={{ color: "var(--text)" }}>{formatCurrency(hireSalary * MULTIPLIER, { compact: true })}</span>
                </div>
                <RunwayBar extra={hireSalary * MULTIPLIER} />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setPlanOpen(false)} className="flex-1 rounded-xl py-2 text-sm"
                style={{ background: "var(--surface-3)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
                Cancel
              </button>
              <button onClick={() => setPlanOpen(false)} className="flex-1 rounded-xl py-2 text-sm font-semibold"
                style={{ background: "var(--accent)", color: "#fff" }}>
                Save to plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
