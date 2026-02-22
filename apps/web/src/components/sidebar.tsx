"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  FileText,
  Settings,
  MessageSquare,
  PieChart,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", active: true },
  { icon: TrendingUp, label: "Cash Flow", href: "/cash-flow" },
  { icon: PieChart, label: "Budget", href: "/budget" },
  { icon: Wallet, label: "Expenses", href: "/expenses" },
  { icon: Users, label: "Headcount", href: "/headcount" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: MessageSquare, label: "Ask Chief", href: "/chat" },
];

const bottomItems = [
  { icon: Zap, label: "Integrations", href: "/integrations" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-surface-1 border-r border-border-subtle transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border-subtle">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-sapphire to-brand-azure flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">
            Chief<span className="text-brand-azure">CFO</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
              item.active
                ? "bg-brand-sapphire/15 text-brand-azure"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            )}
          >
            <item.icon
              className={cn("w-5 h-5 flex-shrink-0", item.active && "text-brand-azure")}
            />
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* Bottom */}
      <div className="py-4 px-3 space-y-1 border-t border-border-subtle">
        {bottomItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-150"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-text-muted hover:text-text-secondary w-full transition-all"
        >
          {collapsed ? "→" : "← Collapse"}
        </button>
      </div>
    </aside>
  );
}
