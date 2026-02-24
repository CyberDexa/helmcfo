"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { Sliders, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ScenarioProjection } from "@/lib/engine/types";

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 text-sm shadow-xl" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
      <p className="font-semibold mb-2" style={{ color: "var(--text)" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-2)" }}>{p.name}:</span>
          <span className="font-semibold" style={{ color: "var(--text)" }}>{formatCurrency(p.value, { compact: true })}</span>
        </div>
      ))}
    </div>
  );
}

interface Assumption {
  label: string;
  key: string;
  base: number;
  unit: string;
  min: number;
  max: number;
  step: number;
}

const assumptions: Assumption[] = [
  { label: "Revenue growth (MoM)", key: "revenueGrowth", base: 5, unit: "%", min: -10, max: 30, step: 0.5 },
  { label: "Headcount additions", key: "headcount", base: 2, unit: "hires/mo", min: 0, max: 8, step: 1 },
  { label: "Avg salary (new hires)", key: "avgSalary", base: 160000, unit: "$", min: 80000, max: 350000, step: 10000 },
  { label: "SaaS optimization", key: "saas", base: -2800, unit: "$/mo", min: -15000, max: 0, step: 500 },
  { label: "Marketing spend", key: "marketing", base: 24000, unit: "$/mo", min: 0, max: 80000, step: 2000 },
  { label: "Fundraise amount", key: "fundraise", base: 0, unit: "$", min: 0, max: 15000000, step: 500000 },
];

const scenarioMeta = [
  { key: "bear" as const, label: "Bear Case", color: "#ef4444" },
  { key: "base" as const, label: "Base Case", color: "#f59e0b" },
  { key: "bull" as const, label: "Bull Case", color: "#10b981" },
];

interface ScenariosResponse {
  scenarios: Record<string, ScenarioProjection>;
  snapshot: { cashBalance: number; monthlyBurn: number; mrr: number; syncedAt: string };
}

export default function ScenariosPage() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(assumptions.map((a) => [a.key, a.base]))
  );
  const [data, setData] = useState<ScenariosResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadScenarios = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/engine/scenarios");
      if (res.ok) setData(await res.json() as ScenariosResponse);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadScenarios(); }, [loadScenarios]);

  const handleChange = (key: string, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  // Build chart data from engine response
  const comparisonData = data
    ? data.scenarios.base.months.map((m, i) => ({
        month: m.label,
        bear: data.scenarios.bear.months[i]?.closingCash ?? 0,
        base: m.closingCash,
        bull: data.scenarios.bull.months[i]?.closingCash ?? 0,
      }))
    : [];

  // Custom runway from slider values using snapshot cash
  const baseCash = data?.snapshot.cashBalance ?? 574_000;
  const baseBurn = data?.snapshot.monthlyBurn ?? 287_000;
  const baseMRR = data?.snapshot.mrr ?? 271_000;

  const customRunway = Math.max(1, Math.round(
    baseCash / Math.max(1,
      baseBurn
      + (values.headcount * values.avgSalary / 12)
      + values.marketing
      + values.saas
      - (baseMRR * (1 + values.revenueGrowth / 100))
      + (baseMRR)
    )
  ));

  const forecastLabel = data
    ? data.scenarios.base.months[0]?.label ?? "Forecast →"
    : "Forecast →";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Scenario Planning</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>Compare bear / base / bull outcomes · Model custom assumptions</p>
      </div>

      {/* Comparison chart */}
      <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Cash Balance — All Scenarios</h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>12-month projection from live data</p>
          </div>
          <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--text-3)" }}>
            {scenarioMeta.map((s) => (
              <span key={s.key} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="h-[280px] flex items-center justify-center text-[13px]" style={{ color: "var(--text-3)" }}>
            Loading engine data…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={comparisonData} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,186,0.07)" />
              <XAxis dataKey="month" tick={{ fill: "#4f5b72", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => formatCurrency(v, { compact: true })} tick={{ fill: "#4f5b72", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={forecastLabel} stroke="rgba(99,130,186,0.2)" strokeDasharray="4 2" label={{ value: "Month 1 →", fill: "#4f5b72", fontSize: 10 }} />
              {scenarioMeta.map((s) => (
                <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Scenario cards */}
      <div className="grid grid-cols-3 gap-4">
        {scenarioMeta.map((s) => {
          const proj = data?.scenarios[s.key];
          return (
            <div key={s.key} className="rounded-2xl p-5" style={{ background: "var(--surface)", border: `1px solid ${s.color}28` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="font-bold text-[14px]" style={{ color: "var(--text)" }}>{s.label}</span>
                {proj && (
                  <span className="ml-auto font-mono text-[12px] font-semibold" style={{ color: s.color }}>
                    {proj.runwayMonths} mo
                  </span>
                )}
              </div>
              {proj ? (
                <>
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px]" style={{ color: "var(--text-3)" }}>
                      <span style={{ color: s.color }}>›</span> Revenue growth: {(proj.assumptions.revenueGrowthMoM * 100).toFixed(0)}% MoM
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-3)" }}>
                      <span style={{ color: s.color }}>›</span> Hires/mo: {proj.assumptions.hiresPerMonth}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-3)" }}>
                      <span style={{ color: s.color }}>›</span> SaaS cut: {proj.assumptions.saasOptimisation > 0 ? `-$${proj.assumptions.saasOptimisation.toLocaleString()}/mo` : "none"}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-3)" }}>
                      <span style={{ color: s.color }}>›</span> Total burn: {formatCurrency(proj.totalBurnInPeriod, { compact: true })}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="flex justify-between text-[11px]">
                      <span style={{ color: "var(--text-3)" }}>Runway ends</span>
                      <span className="font-semibold font-mono" style={{ color: "var(--text)" }}>
                        {proj.runoutDate === "Beyond projection window" ? "12+ mo" : proj.runoutDate}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-20 flex items-center justify-center text-[12px]" style={{ color: "var(--text-3)" }}>Loading…</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom modeler */}
      <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 mb-5">
          <Sliders size={16} style={{ color: "var(--accent)" }} />
          <div>
            <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Custom Scenario Builder</h2>
            <p className="text-[12px]" style={{ color: "var(--text-3)" }}>Adjust the levers below. Runway recalculates in real time.</p>
          </div>
          <div className="ml-auto px-4 py-2 rounded-xl" style={{ background: "var(--accent-dim)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <p className="text-[11px] font-mono" style={{ color: "var(--text-3)" }}>Estimated runway</p>
            <p className="text-xl font-bold" style={{ color: "var(--accent)" }}>{customRunway} mo</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          {assumptions.map((a) => (
            <div key={a.key}>
              <div className="flex justify-between mb-2">
                <label className="text-[12px] font-medium" style={{ color: "var(--text-2)" }}>{a.label}</label>
                <span className="text-[12px] font-semibold font-mono" style={{ color: "var(--accent)" }}>
                  {a.unit === "$" && values[a.key] !== 0
                    ? formatCurrency(values[a.key], { compact: true })
                    : `${values[a.key]}${a.unit !== "$" ? ` ${a.unit}` : ""}`}
                </span>
              </div>
              <input type="range" min={a.min} max={a.max} step={a.step}
                value={values[a.key]}
                onChange={(e) => handleChange(a.key, Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "var(--accent)", background: "var(--surface-3)" }}
              />
              <div className="flex justify-between mt-1 text-[10px]" style={{ color: "var(--text-3)" }}>
                <span>{a.unit === "$" && a.min !== 0 ? formatCurrency(a.min, { compact: true }) : `${a.min}${a.unit !== "$" ? a.unit : ""}`}</span>
                <span>{a.unit === "$" ? formatCurrency(a.max, { compact: true }) : `${a.max}${a.unit !== "$" ? a.unit : ""}`}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2 text-[11px] px-3 py-2.5 rounded-xl" style={{ background: "var(--accent-dim)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <Info size={12} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <span style={{ color: "var(--text-2)" }}>Runway is calculated using deterministic arithmetic (no LLM math) on live cash balance, adjusted burn rate, and projected revenue growth.</span>
        </div>
      </div>
    </div>
  );
}
