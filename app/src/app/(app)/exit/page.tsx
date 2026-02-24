"use client";

import { useState } from "react";
import { Building2, CheckCircle, Circle, AlertCircle, TrendingUp, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

type DdStatus = "complete" | "in-progress" | "missing" | "na";
type ExitType = "strategic" | "pe" | "ipo" | "acqui-hire";

interface DdItem {
  category: string;
  item: string;
  status: DdStatus;
  owner: string;
  note?: string;
}

interface Comparable {
  company: string;
  arr: number;
  multiple: number;
  category: string;
  acquirer: string;
  year: number;
}

// ── MOCK DATA ─────────────────────────────────────────────────────────────────

const DD_ITEMS: DdItem[] = [
  // Financial
  { category: "Financial",    item: "3 years audited financials",          status: "complete",     owner: "CFO",     note: "Audited by Deloitte through 2025" },
  { category: "Financial",    item: "Revenue recognition policy (ASC 606)", status: "complete",    owner: "CFO" },
  { category: "Financial",    item: "Cap table (fully diluted)",            status: "complete",     owner: "Legal",   note: "Carta up to date" },
  { category: "Financial",    item: "12-month detailed financial model",    status: "in-progress",  owner: "CFO",     note: "In review with bankers" },
  { category: "Financial",    item: "Customer MRR detail by account",       status: "complete",     owner: "CFO" },
  { category: "Financial",    item: "Cohort churn analysis",                status: "missing",      owner: "CFO",     note: "Needs to be compiled" },
  // Legal
  { category: "Legal",        item: "Certificate of incorporation",         status: "complete",     owner: "Legal" },
  { category: "Legal",        item: "All board and stockholder resolutions", status: "complete",    owner: "Legal" },
  { category: "Legal",        item: "IP assignment agreements (all staff)",  status: "in-progress", owner: "Legal",   note: "2 contractors outstanding" },
  { category: "Legal",        item: "Customer contract templates",           status: "complete",     owner: "Legal" },
  { category: "Legal",        item: "Material contracts (>$50K)",            status: "missing",      owner: "Legal",   note: "Salesforce + AWS MSA copies needed" },
  // Technical
  { category: "Technical",    item: "System architecture overview",          status: "complete",     owner: "CTO" },
  { category: "Technical",    item: "SOC 2 Type II report",                  status: "in-progress",  owner: "CTO",     note: "Audit in progress, expected Aug 2026" },
  { category: "Technical",    item: "Security vulnerability assessment",     status: "complete",     owner: "CTO" },
  { category: "Technical",    item: "Uptime SLA metrics (12 months)",        status: "complete",     owner: "CTO" },
  { category: "Technical",    item: "Data processing agreements (GDPR)",     status: "missing",      owner: "CTO",     note: "DPA template being drafted" },
  // HR
  { category: "HR",           item: "Org chart and headcount detail",        status: "complete",     owner: "HR" },
  { category: "HR",           item: "Key employee retention agreements",     status: "in-progress",  owner: "HR",      note: "Finalizing for 3 executives" },
  { category: "HR",           item: "Benefits plan documentation",           status: "complete",     owner: "HR" },
  { category: "HR",           item: "Contractor vs. employee classification", status: "complete",    owner: "HR" },
];

const COMPS: Comparable[] = [
  { company: "Looker",        arr: 150_000_000, multiple: 10.2, category: "Analytics SaaS",   acquirer: "Google",      year: 2019 },
  { company: "Tableau",       arr: 877_000_000, multiple: 5.5,  category: "Analytics SaaS",   acquirer: "Salesforce",  year: 2019 },
  { company: "Figma",         arr: 450_000_000, multiple: 22.0, category: "Design SaaS",       acquirer: "Adobe",       year: 2022 },
  { company: "GitHub",        arr: 300_000_000, multiple: 10.0, category: "Dev Tools SaaS",    acquirer: "Microsoft",   year: 2018 },
  { company: "Coupa",         arr: 400_000_000, multiple: 7.8,  category: "Finance SaaS",      acquirer: "Vista Equity",year: 2023 },
  { company: "Anaplan",       arr: 590_000_000, multiple: 6.4,  category: "Finance SaaS",      acquirer: "Thoma Bravo", year: 2022 },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function ddIcon(status: DdStatus) {
  if (status === "complete")     return <CheckCircle size={14} color="var(--green)" />;
  if (status === "in-progress")  return <AlertCircle size={14} color="var(--amber)" />;
  if (status === "missing")      return <Circle size={14} color="var(--red)" />;
  return <Minus size={14} color="var(--text-3)" />;
}

function ddBadge(status: DdStatus) {
  const map = {
    complete:     { bg: "rgba(16,185,129,0.08)",  color: "var(--green)",  label: "Complete" },
    "in-progress":{ bg: "rgba(245,158,11,0.08)",  color: "var(--amber)",  label: "In Progress" },
    missing:      { bg: "rgba(239,68,68,0.08)",   color: "var(--red)",    label: "Missing" },
    na:           { bg: "rgba(100,116,139,0.08)", color: "var(--text-3)", label: "N/A" },
  };
  const s = map[status];
  return <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: s.bg, color: s.color }}>{s.label}</span>;
}

function Minus({ size, color }: { size: number; color: string }) {
  return <span style={{ display: "inline-block", width: size, height: size, color, fontSize: size - 2, lineHeight: `${size}px`, textAlign: "center" }}>—</span>;
}

// ── VALUATION CALCULATOR ──────────────────────────────────────────────────────

function ValuationCalc() {
  const [arr, setArr] = useState(7_800_000);
  const [multiple, setMultiple] = useState(8);
  const [growth, setGrowth] = useState(45);

  const growthAdj = multiple * (1 + (growth - 30) / 100 * 0.3);
  const baseFwd = arr * 1.45; // next 12mo ARR
  const valuation = baseFwd * growthAdj;

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ARR Valuation Calculator</div>
      <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 20 }}>Based on forward ARR × growth-adjusted multiple</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Current ARR", value: arr, setValue: setArr, min: 1_000_000, max: 50_000_000, step: 100_000, fmt: (v: number) => `$${(v / 1_000_000).toFixed(1)}M` },
          { label: "Revenue Multiple", value: multiple, setValue: setMultiple, min: 3, max: 25, step: 0.5, fmt: (v: number) => `${v}x` },
          { label: "YoY Growth Rate", value: growth, setValue: setGrowth, min: 10, max: 150, step: 5, fmt: (v: number) => `${v}%` },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 22, color: "var(--text)", marginBottom: 8 }}>{s.fmt(s.value)}</div>
            <input
              type="range" min={s.min} max={s.max} step={s.step} value={s.value}
              onChange={(e) => s.setValue(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)" }}
            />
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 20px", borderRadius: 10, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Estimated Enterprise Value</div>
        <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 40, color: "var(--accent)", marginTop: 4, lineHeight: 1 }}>{fmt(valuation)}</div>
        <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 6 }}>
          Based on fwd ARR of {fmt(baseFwd)} × {growthAdj.toFixed(1)}x growth-adjusted multiple · Range: {fmt(baseFwd * (growthAdj * 0.8))} – {fmt(baseFwd * (growthAdj * 1.2))}
        </div>
      </div>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

type Tab = "valuation" | "dd-checklist" | "comps";

export default function ExitPage() {
  const [tab, setTab] = useState<Tab>("valuation");
  const [ddFilter, setDdFilter] = useState<string>("All");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Financial");

  const categories = ["All", ...Array.from(new Set(DD_ITEMS.map((d) => d.category)))];
  const filtered = ddFilter === "All" ? DD_ITEMS : DD_ITEMS.filter((d) => d.category === ddFilter);
  const grouped = categories.filter((c) => c !== "All").map((cat) => ({
    cat,
    items: DD_ITEMS.filter((d) => d.category === cat),
    complete: DD_ITEMS.filter((d) => d.category === cat && d.status === "complete").length,
  }));

  const totalComplete = DD_ITEMS.filter((d) => d.status === "complete").length;
  const totalItems = DD_ITEMS.length;
  const readinessPct = Math.round((totalComplete / totalItems) * 100);

  const avgMultiple = COMPS.reduce((s, c) => s + c.multiple, 0) / COMPS.length;

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Building2 size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, fontWeight: 400 }}>M&A / Exit Readiness</h1>
        </div>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>
          Valuation modeling, due diligence checklist, and comparable M&A transactions
        </p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "DD Readiness Score", value: `${readinessPct}%`, sub: `${totalComplete}/${totalItems} items complete`, color: readinessPct >= 75 ? "var(--green)" : "var(--amber)" },
          { label: "Missing Items", value: `${DD_ITEMS.filter((d) => d.status === "missing").length}`, sub: "Blocking diligence", color: "var(--red)" },
          { label: "Avg SaaS Multiple (Comps)", value: `${avgMultiple.toFixed(1)}x`, sub: "Finance SaaS cohort", color: "var(--accent)" },
          { label: "Est. Exit Range", value: "$57M–$86M", sub: "Based on $7.8M ARR · 8–11x", color: "var(--purple)" },
        ].map((k) => (
          <div key={k.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 26, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, padding: 4, background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)", width: "fit-content" }}>
        {([["valuation", "Valuation Model"], ["dd-checklist", "DD Checklist"], ["comps", "M&A Comps"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "7px 20px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
            background: tab === key ? "var(--surface-3)" : "transparent",
            color: tab === key ? "var(--text)" : "var(--text-3)",
          }}>{label}</button>
        ))}
      </div>

      {/* VALUATION TAB */}
      {tab === "valuation" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <ValuationCalc />

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Exit Type Cards */}
            {[
              { type: "Strategic Acquisition", multiple: "8–12x ARR", horizon: "12–24mo", notes: "Best valuation · requires process · board/investor alignment needed", color: "var(--green)" },
              { type: "PE / Growth Buyout", multiple: "6–9x ARR", horizon: "18–36mo", notes: "Predictable path · management rollover common · expect leverage", color: "var(--accent)" },
              { type: "IPO", multiple: "10–20x ARR", horizon: "24–48mo + lock-up", notes: "Maximum value potential · requires $25M+ ARR, >30% growth, clean audit history", color: "var(--purple)" },
              { type: "Acqui-hire", multiple: "1–3x ARR", horizon: "3–6mo", notes: "Fastest exit · team retention packages · low valuation, good for wind-down scenario", color: "var(--amber)" },
            ].map((e) => (
              <div key={e.type} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{e.type}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: `${e.color}15`, color: e.color }}>{e.multiple}</span>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: "var(--surface-3)", color: "var(--text-3)" }}>{e.horizon}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{e.notes}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DD CHECKLIST TAB */}
      {tab === "dd-checklist" && (
        <>
          {/* Progress bar */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Overall DD Readiness</span>
              <span style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: readinessPct >= 75 ? "var(--green)" : "var(--amber)" }}>{readinessPct}% complete</span>
            </div>
            <div style={{ height: 8, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${readinessPct}%`, height: "100%", background: readinessPct >= 75 ? "var(--green)" : "var(--amber)", borderRadius: 99, transition: "width 0.5s" }} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: "var(--text-3)" }}>
              {[["var(--green)", "complete", "Complete"], ["var(--amber)", "in-progress", "In Progress"], ["var(--red)", "missing", "Missing"]].map(([c, status, label]) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: c as string, display: "inline-block" }} />
                  {DD_ITEMS.filter((d) => d.status === status as DdStatus).length} {label}
                </span>
              ))}
            </div>
          </div>

          {/* Category accordions */}
          {grouped.map(({ cat, items, complete }) => (
            <div key={cat} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 12, overflow: "hidden" }}>
              <button
                onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                style={{ width: "100%", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "inherit", fontFamily: "inherit" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {expandedCategory === cat ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{cat}</span>
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>{complete}/{items.length} complete</span>
                </div>
                <div style={{ width: 80, height: 4, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${(complete / items.length) * 100}%`, height: "100%", background: complete === items.length ? "var(--green)" : "var(--amber)", borderRadius: 99 }} />
                </div>
              </button>
              {expandedCategory === cat && (
                <table style={{ width: "100%", borderCollapse: "collapse", borderTop: "1px solid var(--border)" }}>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.item} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "10px 20px 10px 32px", width: 20 }}>{ddIcon(item.status)}</td>
                        <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text)" }}>{item.item}</td>
                        <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 11, color: "var(--text-3)" }}>{item.owner}</td>
                        <td style={{ padding: "10px 16px", textAlign: "right" }}>{ddBadge(item.status)}</td>
                        <td style={{ padding: "10px 20px 10px 0", fontSize: 11, color: "var(--text-3)", maxWidth: 200 }}>{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </>
      )}

      {/* M&A COMPS TAB */}
      {tab === "comps" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>M&A Comparable Transactions</span>
            <span style={{ fontSize: 11, color: "var(--text-3)" }}>SaaS · 2018–2023 · avg {avgMultiple.toFixed(1)}x ARR</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Company", "ARR at Exit", "Multiple", "Category", "Acquirer", "Year"].map((h, i) => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: i <= 1 ? "left" : "right", fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.7px", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPS.map((c) => (
                <tr key={c.company} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "13px 20px", fontSize: 13, fontWeight: 500 }}>{c.company}</td>
                  <td style={{ padding: "13px 20px", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{fmt(c.arr)}</td>
                  <td style={{ padding: "13px 20px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: c.multiple >= avgMultiple ? "var(--green)" : "var(--text-2)", fontWeight: 600 }}>{c.multiple}x</td>
                  <td style={{ padding: "13px 20px", textAlign: "right" }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: "rgba(139,92,246,0.08)", color: "var(--purple)" }}>{c.category}</span>
                  </td>
                  <td style={{ padding: "13px 20px", textAlign: "right", fontSize: 12, color: "var(--text-2)" }}>{c.acquirer}</td>
                  <td style={{ padding: "13px 20px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "var(--text-3)" }}>{c.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-3)" }}>
            These transactions are for illustrative benchmarking purposes. Actual valuation depends on growth rate, churn, NRR, competitive dynamics, and strategic fit.
          </div>
        </div>
      )}
    </div>
  );
}
