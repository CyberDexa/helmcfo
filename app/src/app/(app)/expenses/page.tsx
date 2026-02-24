"use client";

import { useState } from "react";
import {
  DollarSign, TrendingDown, Search, AlertTriangle, CheckCircle,
  ExternalLink, ChevronRight, RefreshCw, ShoppingCart, Zap, Server,
  MessageSquare, BarChart2, Shield, PieChart,
} from "lucide-react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface VendorItem {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  monthlySpend: number;
  lastUsed: string; // ISO date
  seats: number;
  seatsUsed: number;
  status: "active" | "low-usage" | "unused" | "overpriced";
  recommendation: string;
  potentialSaving: number;
  negotiationScript?: string;
}

// ── MOCK DATA ─────────────────────────────────────────────────────────────────

const VENDORS: VendorItem[] = [
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    icon: MessageSquare,
    monthlySpend: 1240,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    seats: 62,
    seatsUsed: 41,
    status: "low-usage",
    recommendation: "Downgrade 21 unused seats to free tier or cancel.",
    potentialSaving: 420,
    negotiationScript:
      "We're renewing in 30 days. We've identified 21 seats with <3 logins in 90 days. Please remove those licenses and apply a 15% loyalty discount on remaining 41 seats. Otherwise we'll migrate to Teams.",
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design",
    icon: PieChart,
    monthlySpend: 900,
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    seats: 15,
    seatsUsed: 7,
    status: "low-usage",
    recommendation: "Reduce from 15 to 8 seats. Only 7 designers active.",
    potentialSaving: 480,
  },
  {
    id: "datadog",
    name: "Datadog",
    category: "Monitoring",
    icon: BarChart2,
    monthlySpend: 2100,
    lastUsed: new Date().toISOString(),
    seats: 20,
    seatsUsed: 18,
    status: "overpriced",
    recommendation:
      "Switch to Grafana Cloud (free up to 10K metrics) + Sentry for error tracking. Saves ~$1,400/mo.",
    potentialSaving: 1400,
    negotiationScript:
      "We're evaluating Grafana Cloud as an alternative. Match $700/mo or we migrate in 60 days.",
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "Video",
    icon: Zap,
    monthlySpend: 540,
    lastUsed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    seats: 30,
    seatsUsed: 4,
    status: "unused",
    recommendation: "You switched to Google Meet. Cancel Zoom — 4 users logged in once in 30 days.",
    potentialSaving: 540,
  },
  {
    id: "aws",
    name: "AWS",
    category: "Infrastructure",
    icon: Server,
    monthlySpend: 4800,
    lastUsed: new Date().toISOString(),
    seats: 0,
    seatsUsed: 0,
    status: "overpriced",
    recommendation:
      "3 oversized EC2 instances (t3.xlarge) running at <20% CPU. Right-size to t3.medium. Migrate RDS to Aurora Serverless.",
    potentialSaving: 1600,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    icon: ShoppingCart,
    monthlySpend: 1600,
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    seats: 10,
    seatsUsed: 3,
    status: "low-usage",
    recommendation:
      "Only 3 of 10 seats active. Downgrade to Starter CRM ($50/mo) or consolidate on a free tier.",
    potentialSaving: 1100,
  },
  {
    id: "snyk",
    name: "Snyk",
    category: "Security",
    icon: Shield,
    monthlySpend: 398,
    lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    seats: 5,
    seatsUsed: 5,
    status: "active",
    recommendation: "No action — all seats are utilized and the tool is business-critical.",
    potentialSaving: 0,
  },
];

const STATUS_CONFIG: Record<VendorItem["status"], { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  "low-usage": { label: "Low Usage", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  unused: { label: "Unused", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  overpriced: { label: "Overpriced", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Communication: MessageSquare,
  Design: PieChart,
  Monitoring: BarChart2,
  Video: Zap,
  Infrastructure: Server,
  CRM: ShoppingCart,
  Security: Shield,
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function ExpensesPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<VendorItem["status"] | "all">("all");
  const [scriptOpen, setScriptOpen] = useState<string | null>(null);

  const totalSpend = VENDORS.reduce((s, v) => s + v.monthlySpend, 0);
  const totalSavings = VENDORS.reduce((s, v) => s + v.potentialSaving, 0);
  const unusedCount = VENDORS.filter((v) => v.status === "unused" || v.status === "low-usage").length;

  const filtered = filter === "all" ? VENDORS : VENDORS.filter((v) => v.status === filter);
  const selectedVendor = VENDORS.find((v) => v.id === selected);

  return (
    <div style={{ padding: "32px 32px 80px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <TrendingDown size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, fontWeight: 400 }}>
            Expense Optimization
          </h1>
        </div>
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>
          AI-powered SaaS audit · vendor renegotiation scripts · right-sizing recommendations
        </p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Monthly SaaS Spend", value: fmt(totalSpend), sub: "across tracked tools", color: "var(--accent)" },
          { label: "Identified Savings", value: fmt(totalSavings), sub: `${Math.round((totalSavings / totalSpend) * 100)}% of spend`, color: "var(--green)" },
          { label: "Unused / Low-Usage", value: `${unusedCount}`, sub: "tools flagged", color: "var(--amber)" },
          { label: "Annual Opportunity", value: fmt(totalSavings * 12), sub: "if all actions taken", color: "var(--purple)" },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "20px 24px",
            }}
          >
            <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>
              {k.label}
            </div>
            <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 28, color: k.color, lineHeight: 1 }}>
              {k.value}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["all", "unused", "low-usage", "overpriced", "active"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid",
              borderColor: filter === f ? "var(--accent)" : "var(--border)",
              background: filter === f ? "rgba(59,130,246,0.12)" : "transparent",
              color: filter === f ? "var(--accent)" : "var(--text-2)",
              fontSize: 12,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {f === "all" ? "All Tools" : f.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Vendor Table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 32 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
          padding: "10px 20px",
          borderBottom: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--text-3)",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
        }}>
          {["Vendor", "Category", "Monthly", "Seat Usage", "Status", "Savings"].map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>

        {filtered.map((v) => {
          const sConf = STATUS_CONFIG[v.status];
          const Icon = v.icon;
          const usagePct = v.seats > 0 ? Math.round((v.seatsUsed / v.seats) * 100) : 100;
          return (
            <div
              key={v.id}
              onClick={() => setSelected(selected === v.id ? null : v.id)}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                padding: "14px 20px",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                background: selected === v.id ? "var(--surface-2)" : "transparent",
                transition: "background 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", display: "grid", placeItems: "center" }}>
                  <Icon size={15} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>Last used {daysSince(v.lastUsed)}d ago</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", fontSize: 12, color: "var(--text-2)" }}>{v.category}</div>
              <div style={{ display: "flex", alignItems: "center", fontSize: 13, fontFamily: "JetBrains Mono, monospace" }}>{fmt(v.monthlySpend)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {v.seats > 0 ? (
                  <>
                    <div style={{ flex: 1, height: 4, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${usagePct}%`, height: "100%", background: usagePct < 50 ? "var(--amber)" : "var(--green)", borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-2)", whiteSpace: "nowrap" }}>{v.seatsUsed}/{v.seats}</span>
                  </>
                ) : (
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>Usage-based</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: sConf.bg, color: sConf.color }}>{sConf.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: v.potentialSaving > 0 ? "var(--green)" : "var(--text-3)" }}>
                  {v.potentialSaving > 0 ? `+${fmt(v.potentialSaving)}` : "—"}
                </span>
                <ChevronRight size={12} color="var(--text-3)" style={{ transform: selected === v.id ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Detail Panel */}
      {selectedVendor && (
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 24,
          marginBottom: 32,
          animation: "fadeIn 0.15s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{selectedVendor.name} — AI Recommendation</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle size={13} color="var(--green)" />
                <span style={{ fontSize: 12, color: "var(--text-2)" }}>Potential saving: {fmt(selectedVendor.potentialSaving)}/mo · {fmt(selectedVendor.potentialSaving * 12)}/yr</span>
              </div>
            </div>
            {selectedVendor.potentialSaving > 0 && (
              <button
                onClick={() => setScriptOpen(scriptOpen === selectedVendor.id ? null : selectedVendor.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 8, border: "1px solid var(--accent)",
                  background: "rgba(59,130,246,0.1)", color: "var(--accent)",
                  fontSize: 12, cursor: "pointer",
                }}
              >
                <MessageSquare size={13} />
                {scriptOpen === selectedVendor.id ? "Hide" : "View"} Negotiation Script
              </button>
            )}
          </div>

          <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.7, marginBottom: scriptOpen === selectedVendor.id ? 16 : 0 }}>
            {selectedVendor.recommendation}
          </p>

          {scriptOpen === selectedVendor.id && selectedVendor.negotiationScript && (
            <div style={{
              background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10,
              padding: 16, marginTop: 16,
            }}>
              <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
                AI-Drafted Negotiation Script
              </div>
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, fontStyle: "italic" }}>
                &ldquo;{selectedVendor.negotiationScript}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Plan */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <RefreshCw size={15} color="var(--accent)" />
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>30-Day Action Plan</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { action: "Cancel Zoom — zero active users", priority: "This week", saving: 540, icon: "🔴" },
            { action: "Downgrade HubSpot to Starter CRM (3 active users)", priority: "This week", saving: 1100, icon: "🔴" },
            { action: "Email DataDog: price match request or migrate to Grafana Cloud", priority: "Week 2", saving: 1400, icon: "🟡" },
            { action: "Right-size 3 EC2 t3.xlarge → t3.medium (18% avg CPU)", priority: "Week 2", saving: 1600, icon: "🟡" },
            { action: "Remove 21 unused Slack seats, request 15% loyalty discount", priority: "Before renewal", saving: 420, icon: "🟢" },
            { action: "Reduce Figma from 15 to 8 seats", priority: "Before renewal", saving: 480, icon: "🟢" },
          ].map((a, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
              background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border)",
            }}>
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.action}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{a.priority}</div>
              </div>
              <div style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "var(--green)" }}>
                +{fmt(a.saving)}/mo
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20, padding: "14px 20px", borderRadius: 10,
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--green)" }}>Total recoverable savings</span>
          <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 24, color: "var(--green)" }}>{fmt(totalSavings)}/mo</span>
        </div>
      </div>
    </div>
  );
}
