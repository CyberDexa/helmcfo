"use client";

import { useState } from "react";
import { Clock, AlertCircle, CheckCircle, TrendingUp, TrendingDown, ChevronDown, ChevronRight, Mail } from "lucide-react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

type AgingBucket = "0-30" | "31-60" | "61-90" | "90+";

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  issued: string;      // ISO date string
  due: string;
  bucket: AgingBucket;
  status: "overdue" | "due-soon" | "paid" | "open";
}

interface Bill {
  id: string;
  vendor: string;
  amount: number;
  due: string;
  dpo: number;         // days payable outstanding
  status: "scheduled" | "overdue" | "hold" | "paid";
}

// ── MOCK DATA ─────────────────────────────────────────────────────────────────

const INVOICES: Invoice[] = [
  { id: "INV-1081", customer: "Nexus Corp",       amount: 18_500, issued: "2026-05-15", due: "2026-06-14", bucket: "31-60",  status: "overdue"  },
  { id: "INV-1074", customer: "Vantage Health",   amount: 9_200,  issued: "2026-04-20", due: "2026-05-20", bucket: "61-90",  status: "overdue"  },
  { id: "INV-1098", customer: "Orbital Labs",     amount: 24_000, issued: "2026-06-01", due: "2026-07-01", bucket: "0-30",   status: "due-soon" },
  { id: "INV-1052", customer: "Stratum Finance",  amount: 6_600,  issued: "2026-03-01", due: "2026-04-01", bucket: "90+",    status: "overdue"  },
  { id: "INV-1101", customer: "Meridian Studios", amount: 11_800, issued: "2026-06-10", due: "2026-07-10", bucket: "0-30",   status: "open"     },
  { id: "INV-1067", customer: "Apexio Inc",       amount: 15_300, issued: "2026-04-30", due: "2026-05-30", bucket: "61-90",  status: "overdue"  },
  { id: "INV-1112", customer: "Crestline AI",     amount: 8_750,  issued: "2026-06-18", due: "2026-07-18", bucket: "0-30",   status: "open"     },
  { id: "INV-1045", customer: "Summit Digital",   amount: 4_400,  issued: "2026-02-14", due: "2026-03-14", bucket: "90+",    status: "overdue"  },
];

const BILLS: Bill[] = [
  { id: "BILL-402", vendor: "AWS",              amount: 22_100, due: "2026-07-01", dpo: 30, status: "scheduled" },
  { id: "BILL-397", vendor: "Stripe",           amount: 4_200,  due: "2026-07-05", dpo: 30, status: "scheduled" },
  { id: "BILL-384", vendor: "Salesforce",       amount: 18_600, due: "2026-06-25", dpo: 60, status: "hold"      },
  { id: "BILL-391", vendor: "Brex Credit",      amount: 9_800,  due: "2026-07-15", dpo: 45, status: "scheduled" },
  { id: "BILL-378", vendor: "LexisNexis",       amount: 3_400,  due: "2026-06-20", dpo: 30, status: "overdue"   },
  { id: "BILL-408", vendor: "Snowflake",        amount: 11_200, due: "2026-07-10", dpo: 30, status: "scheduled" },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const BUCKET_COLOR: Record<AgingBucket, string> = {
  "0-30":  "var(--green)",
  "31-60": "var(--amber)",
  "61-90": "var(--orange, #f97316)",
  "90+":   "var(--red)",
};

const BUCKET_BG: Record<AgingBucket, string> = {
  "0-30":  "rgba(16,185,129,0.08)",
  "31-60": "rgba(245,158,11,0.08)",
  "61-90": "rgba(249,115,22,0.08)",
  "90+":   "rgba(239,68,68,0.08)",
};

function statusBadge(status: Invoice["status"]) {
  const map = {
    overdue:    { bg: "rgba(239,68,68,0.1)",    color: "#ef4444", label: "Overdue"   },
    "due-soon": { bg: "rgba(245,158,11,0.1)",   color: "#f59e0b", label: "Due Soon"  },
    open:       { bg: "rgba(59,130,246,0.1)",   color: "#3b82f6", label: "Open"      },
    paid:       { bg: "rgba(16,185,129,0.1)",   color: "#10b981", label: "Paid"      },
  };
  const s = map[status];
  return <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: s.bg, color: s.color }}>{s.label}</span>;
}

function billBadge(status: Bill["status"]) {
  const map = {
    scheduled: { bg: "rgba(59,130,246,0.1)",  color: "#3b82f6", label: "Scheduled" },
    overdue:   { bg: "rgba(239,68,68,0.1)",   color: "#ef4444", label: "Overdue"   },
    hold:      { bg: "rgba(245,158,11,0.1)",  color: "#f59e0b", label: "On Hold"   },
    paid:      { bg: "rgba(16,185,129,0.1)",  color: "#10b981", label: "Paid"      },
  };
  const s = map[status];
  return <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: s.bg, color: s.color }}>{s.label}</span>;
}

// ── EMAIL GENERATOR ───────────────────────────────────────────────────────────

function CollectionEmail({ invoice }: { invoice: Invoice }) {
  const days = invoice.bucket === "90+" ? 95 : invoice.bucket === "61-90" ? 75 : invoice.bucket === "31-60" ? 45 : 15;
  return (
    <div style={{ background: "var(--surface-3)", borderRadius: 10, padding: 16, fontSize: 12, color: "var(--text-2)", lineHeight: 1.7 }}>
      <div style={{ color: "var(--text-3)", marginBottom: 6, fontSize: 11 }}>AI-drafted · Collection email</div>
      <p><strong>Subject:</strong> Invoice {invoice.id} — {fmt(invoice.amount)} past due ({days} days)</p>
      <p><strong>To:</strong> accounts@{invoice.customer.toLowerCase().replace(" ", "")}.com</p>
      <br />
      <p>Dear {invoice.customer} Finance Team,</p>
      <p>I hope this message finds you well. I'm following up on invoice <strong>{invoice.id}</strong> for <strong>{fmt(invoice.amount)}</strong>, which was due on <strong>{invoice.due}</strong> — now {days} days overdue.</p>
      <p>Please arrange payment at your earliest convenience. If there's a dispute or issue with this invoice, please reply and we'll resolve it immediately.</p>
      <p>To pay online: <span style={{ color: "var(--accent)" }}>https://pay.helmcfo.io/inv/{invoice.id}</span></p>
      <p>If payment has already been sent, please disregard this message.</p>
      <p>Warm regards,<br />HelmCFO Collections · on behalf of your finance team</p>
    </div>
  );
}

// ── AGING CHART (SVG) ─────────────────────────────────────────────────────────

function AgingChart() {
  const buckets: AgingBucket[] = ["0-30", "31-60", "61-90", "90+"];
  const totals = buckets.map((b) => INVOICES.filter((i) => i.bucket === b).reduce((s, i) => s + i.amount, 0));
  const max = Math.max(...totals);
  const h = 80; const barW = 60; const gap = 24;

  return (
    <svg viewBox={`0 0 ${buckets.length * (barW + gap) - gap + 16} ${h + 24}`} style={{ width: "100%", height: 120 }}>
      {buckets.map((b, i) => {
        const barH = totals[i] > 0 ? (totals[i] / max) * h : 2;
        const x = 8 + i * (barW + gap);
        return (
          <g key={b}>
            <rect x={x} y={h - barH} width={barW} height={barH} rx={4} fill={BUCKET_COLOR[b]} opacity={0.85} />
            <text x={x + barW / 2} y={h + 14} textAnchor="middle" fontSize={10} fill="var(--text-3)" fontFamily="JetBrains Mono,monospace">{b} days</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

type Tab = "ar" | "ap";

export default function ArApPage() {
  const [tab, setTab] = useState<Tab>("ar");
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalAr = INVOICES.reduce((s, i) => s + i.amount, 0);
  const totalOverdue = INVOICES.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0);
  const dso = Math.round(INVOICES.reduce((s, i) => s + i.amount * (parseInt(i.bucket.split("-")[0]) + 15), 0) / INVOICES.reduce((s, i) => s + i.amount, 0));

  const totalAp = BILLS.reduce((s, b) => s + b.amount, 0);
  const avgDpo = Math.round(BILLS.reduce((s, b) => s + b.dpo, 0) / BILLS.length);

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Clock size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, fontWeight: 400 }}>AR / AP Optimization</h1>
        </div>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>
          Accounts receivable aging, overdue collection, and payables cash flow optimization
        </p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total AR Outstanding", value: fmt(totalAr), sub: `${fmt(totalOverdue)} overdue`, color: "var(--amber)" },
          { label: "DSO (Days Sales Outstnd.)", value: `${dso} days`, sub: `Industry avg: 45 days`, color: dso < 45 ? "var(--green)" : "var(--amber)" },
          { label: "Total AP Outstanding", value: fmt(totalAp), sub: "Next 30 days", color: "var(--accent)" },
          { label: "DPO (Days Payable Outstnd.)", value: `${avgDpo} days`, sub: "Weighted avg across vendors", color: "var(--purple)" },
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
        {([["ar", "Accounts Receivable"], ["ap", "Accounts Payable"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: "7px 20px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
              background: tab === key ? "var(--surface-3)" : "transparent",
              color: tab === key ? "var(--text)" : "var(--text-3)",
            }}
          >{label}</button>
        ))}
      </div>

      {tab === "ar" && (
        <>
          {/* Aging Chart + AI insight */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>AR Aging Buckets</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 16 }}>Overdue amounts by days outstanding</div>
              <AgingChart />
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>AI Collection Insights</div>
              {[
                { icon: <AlertCircle size={14} />, color: "var(--red)",   text: `${fmt(totalOverdue)} is overdue — send collection emails today to recover cash before month-end.` },
                { icon: <TrendingDown size={14} />, color: "var(--amber)", text: "DSO has crept to 38 days vs your target of 30. Consider moving to Net-15 terms for new SMB customers." },
                { icon: <CheckCircle size={14} />, color: "var(--green)",  text: "Orbital Labs ($24K) is due in 12 days — proactive reminder recommended to prevent aging." },
                { icon: <TrendingUp size={14} />,  color: "var(--accent)", text: "Enable ACH auto-pay for enterprise accounts to reduce average collection time by 8–12 days." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  <span style={{ color: item.color, marginTop: 1, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Table with email generator */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 600 }}>
              Outstanding Invoices
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["", "Invoice", "Customer", "Amount", "Due Date", "Aging", "Status", "Action"].map((h, i) => (
                    <th key={i} style={{ padding: "10px 16px", textAlign: i <= 1 ? "left" : "right", fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv) => (
                  <>
                    <tr
                      key={inv.id}
                      style={{ borderBottom: expanded === inv.id ? "none" : "1px solid var(--border)", cursor: "pointer" }}
                      onClick={() => setExpanded(expanded === inv.id ? null : inv.id)}
                    >
                      <td style={{ padding: "12px 8px 12px 16px", width: 20 }}>
                        {expanded === inv.id ? <ChevronDown size={14} color="var(--text-3)" /> : <ChevronRight size={14} color="var(--text-3)" />}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{inv.id}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{inv.customer}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", fontWeight: 500 }}>{fmt(inv.amount)}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, color: "var(--text-2)" }}>{inv.due}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: BUCKET_BG[inv.bucket], color: BUCKET_COLOR[inv.bucket], fontFamily: "JetBrains Mono, monospace" }}>{inv.bucket}d</span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>{statusBadge(inv.status)}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpanded(expanded === inv.id ? null : inv.id); }}
                          style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: "auto", padding: "5px 10px", fontSize: 11, borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-2)", cursor: "pointer", fontFamily: "inherit" }}
                        >
                          <Mail size={11} /> Draft Email
                        </button>
                      </td>
                    </tr>
                    {expanded === inv.id && (
                      <tr key={`${inv.id}-email`} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td colSpan={8} style={{ padding: "0 24px 16px" }}>
                          <CollectionEmail invoice={inv} />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "ap" && (
        <>
          <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", fontSize: 12, color: "var(--text-2)", marginBottom: 20, lineHeight: 1.6 }}>
            <strong style={{ color: "var(--accent)" }}>Cash flow tip:</strong> Extending DPO from {avgDpo} to 60 days on non-penalty vendors would free approx. <strong style={{ color: "var(--green)" }}>$31K</strong> in working capital this quarter. Salesforce has been flagged for renegotiation.
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 600 }}>
              Outstanding Payables
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Bill ID", "Vendor", "Amount", "Due Date", "DPO", "Status"].map((h, i) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: i === 0 || i === 1 ? "left" : "right", fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BILLS.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{b.id}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>{b.vendor}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", fontWeight: 500 }}>{fmt(b.amount)}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, color: "var(--text-2)" }}>{b.due}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: b.dpo >= 45 ? "var(--green)" : "var(--text-2)" }}>{b.dpo}d</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>{billBadge(b.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
