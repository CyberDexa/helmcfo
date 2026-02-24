"use client";

import { useState } from "react";
import {
  CheckCircle2, Circle, AlertCircle, ExternalLink, Users, CreditCard,
  Bell, Shield, ChevronRight,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  connected: boolean;
  lastSync?: string;
  logo: string;
}

const integrations: Integration[] = [
  { id: "plaid", name: "Plaid", description: "Bank accounts & real-time transaction data", category: "Banking", connected: true, lastSync: "2 min ago", logo: "🏦" },
  { id: "qbo", name: "QuickBooks Online", description: "GL, P&L, balance sheet sync", category: "Accounting", connected: true, lastSync: "5 min ago", logo: "📊" },
  { id: "stripe", name: "Stripe", description: "Revenue, MRR, churn from billing", category: "Revenue", connected: true, lastSync: "1 min ago", logo: "⚡" },
  { id: "finch", name: "Finch", description: "Payroll & headcount data from HRIS", category: "HR", connected: true, lastSync: "1 hr ago", logo: "👥" },
  { id: "ramp", name: "Ramp", description: "Corporate card spend & expense categories", category: "Expenses", connected: false, logo: "💳" },
  { id: "brex", name: "Brex", description: "Corporate card with spend controls", category: "Expenses", connected: false, logo: "💼" },
  { id: "salesforce", name: "Salesforce", description: "Pipeline, ARR forecasts from CRM", category: "CRM", connected: false, logo: "☁️" },
  { id: "hubspot", name: "HubSpot", description: "Deal flow & CAC attribution", category: "CRM", connected: false, logo: "🔶" },
];

const teamMembers = [
  { name: "Alex Chen", email: "alex@acmecorp.com", role: "Admin", avatar: "AC" },
  { name: "Priya Raman", email: "priya@acmecorp.com", role: "CFO Access", avatar: "PR" },
  { name: "Marcus Wright", email: "marcus@acmecorp.com", role: "Board Observer", avatar: "MW" },
  { name: "Elena Torres", email: "elena@acmecorp.com", role: "View Only", avatar: "ET" },
];

const roleColors: Record<string, string> = {
  Admin: "#3b82f6",
  "CFO Access": "#10b981",
  "Board Observer": "#8b5cf6",
  "View Only": "#4f5b72",
};

export default function SettingsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(integrations.map((i) => [i.id, i.connected]))
  );
  const [tab, setTab] = useState<"integrations" | "team" | "billing" | "notifications">("integrations");

  const handleToggle = (id: string) => {
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs = [
    { id: "integrations" as const, label: "Integrations", icon: <ExternalLink size={13} /> },
    { id: "team" as const, label: "Team & Access", icon: <Users size={13} /> },
    { id: "billing" as const, label: "Billing", icon: <CreditCard size={13} /> },
    { id: "notifications" as const, label: "Notifications", icon: <Bell size={13} /> },
  ];

  const categories = [...new Set(integrations.map((i) => i.category))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>Manage integrations, team access, and account preferences</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px]" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} />
          <span style={{ color: "var(--text-2)" }}>Acme Corp</span>
          <span className="px-1.5 py-0.5 rounded-md font-semibold text-[10px]" style={{ background: "rgba(59,130,246,0.15)", color: "var(--accent)" }}>Growth · $799/mo</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--surface)" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
            style={{
              background: tab === t.id ? "var(--surface-2)" : "transparent",
              color: tab === t.id ? "var(--text)" : "var(--text-3)",
              border: tab === t.id ? "1px solid var(--border)" : "1px solid transparent",
            }}>
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Integrations */}
      {tab === "integrations" && (
        <div className="space-y-5">
          {categories.map((cat) => (
            <div key={cat} className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>{cat}</span>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {integrations.filter((i) => i.category === cat).map((intg) => (
                  <div key={intg.id} className="flex items-center gap-4 px-5 py-4">
                    <span className="text-2xl">{intg.logo}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{intg.name}</span>
                        {connected[intg.id] && intg.lastSync && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: "rgba(16,185,129,0.1)", color: "var(--green)" }}>
                            Synced {intg.lastSync}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-3)" }}>{intg.description}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(intg.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all hover:opacity-80"
                      style={{
                        background: connected[intg.id] ? "rgba(16,185,129,0.1)" : "var(--surface-2)",
                        border: `1px solid ${connected[intg.id] ? "rgba(16,185,129,0.25)" : "var(--border)"}`,
                        color: connected[intg.id] ? "var(--green)" : "var(--text-2)",
                      }}>
                      {connected[intg.id]
                        ? <><CheckCircle2 size={11} /> Connected</>
                        : <><Circle size={11} /> Connect</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team */}
      {tab === "team" && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Team Members</h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-80"
                style={{ background: "var(--accent)", color: "#fff" }}>
                <Users size={11} /> Invite
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {teamMembers.map((m) => (
                <div key={m.email} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: "var(--surface-3)", color: "var(--text-2)" }}>
                    {m.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{m.name}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{m.email}</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold"
                    style={{ background: `${roleColors[m.role]}18`, color: roleColors[m.role] }}>
                    {m.role}
                  </span>
                  <button style={{ color: "var(--text-3)" }} className="hover:opacity-60 transition-opacity">
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-5 flex items-start gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <Shield size={14} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--text)" }}>Role-based access control</p>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-3)" }}>
                Admin can see all data and modify settings. CFO Access can view and export all financial data. Board Observer has read-only access to the Board Reports page. View Only sees dashboard only.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Billing */}
      {tab === "billing" && (
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[11px] uppercase tracking-wider mb-1" style={{ color: "var(--text-3)" }}>Current Plan</p>
                <p className="text-xl font-bold" style={{ color: "var(--text)" }}>Growth</p>
                <p className="text-[13px]" style={{ color: "var(--text-2)" }}>$799 / month · Billed monthly</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-80"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
                Upgrade to Scale
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t pt-5" style={{ borderColor: "var(--border)" }}>
              {[
                { label: "Integrations", value: "All 8" },
                { label: "Team seats", value: "Up to 10" },
                { label: "AI Advisor queries", value: "Unlimited" },
                { label: "Data retention", value: "24 months" },
                { label: "Board packs / mo", value: "Unlimited" },
                { label: "Scenario models", value: "Unlimited" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-[12px]">
                  <CheckCircle2 size={12} style={{ color: "var(--green)", flexShrink: 0 }} />
                  <span style={{ color: "var(--text-2)" }}>{f.label}:</span>
                  <span className="font-semibold" style={{ color: "var(--text)" }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-[14px] font-semibold mb-3" style={{ color: "var(--text)" }}>Billing History</h3>
            <div className="space-y-2">
              {["Mar 2026", "Feb 2026", "Jan 2026"].map((month) => (
                <div key={month} className="flex items-center justify-between text-[12px] py-2 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <span style={{ color: "var(--text-2)" }}>{month} · Growth Plan</span>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold font-mono" style={{ color: "var(--text)" }}>$799.00</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: "rgba(16,185,129,0.1)", color: "var(--green)" }}>Paid</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Alert Preferences</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {[
              { label: "Runway drops below 6 months", desc: "Critical cash warning", on: true },
              { label: "Invoice overdue by 30 days", desc: "AR collection alert", on: true },
              { label: "Burn rate increases >10%", desc: "Anomaly detection", on: true },
              { label: "New integration sync error", desc: "Data reliability", on: true },
              { label: "Weekly financial digest", desc: "Every Monday 8am", on: false },
              { label: "Board pack ready to review", desc: "AI generation complete", on: true },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{n.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>{n.desc}</p>
                </div>
                <ToggleSwitch on={n.on} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ on }: { on: boolean }) {
  const [isOn, setIsOn] = useState(on);
  return (
    <button
      onClick={() => setIsOn((v) => !v)}
      className="relative w-10 h-5 rounded-full transition-colors"
      style={{ background: isOn ? "var(--accent)" : "var(--surface-3)" }}
    >
      <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
        style={{ transform: isOn ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  );
}
