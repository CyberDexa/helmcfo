"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Users,
  FileText,
  Settings,
  Zap,
  ChevronRight,
  Tag,
  Rocket,
  TrendingDown,
  DollarSign,
  LineChart,
  Calculator,
  Target,
  PieChart,
  Clock,
  BookOpen,
  Building2,
  Percent,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: TrendingUp, label: "Cash Flow", href: "/cashflow" },
  { icon: BarChart3, label: "Scenarios", href: "/scenarios" },
  { icon: Users, label: "Headcount", href: "/headcount" },
  { icon: FileText, label: "Board Reports", href: "/reports" },
  { icon: Zap, label: "AI Advisor", href: "/advisor" },
  { icon: TrendingDown, label: "Expenses", href: "/expenses" },
  { icon: DollarSign, label: "Capital", href: "/lending" },
  { icon: LineChart, label: "Benchmarks", href: "/benchmarks" },
  { icon: Calculator, label: "Tax Strategy", href: "/tax" },
  { icon: Target, label: "Budget vs. Actuals", href: "/budget" },
  { icon: PieChart, label: "Unit Economics", href: "/unit-economics" },
  { icon: Clock, label: "AR / AP", href: "/ar-ap" },
  { icon: BookOpen, label: "Revenue", href: "/revenue" },
  { icon: Building2, label: "Exit Readiness", href: "/exit" },
  { icon: Percent, label: "Margin Analysis", href: "/margin-analysis" },
  { icon: Banknote, label: "Working Capital", href: "/working-capital" },
];

const bottomItems = [
  { icon: Tag, label: "Pricing", href: "/pricing" },
  { icon: Rocket, label: "Onboarding", href: "/onboarding" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-[220px] flex flex-col z-30"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", boxShadow: "0 0 16px rgba(59,130,246,0.3)" }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <circle cx="12" cy="12" r="3" fill="white" opacity="0.9"/>
            <circle cx="12" cy="12" r="7" fill="none" stroke="white" strokeWidth="1.8" strokeOpacity="0.8"/>
            <line x1="12" y1="2" x2="12" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="19" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="17.5" y1="4.3" x2="15.9" y2="7.1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8.1" y1="16.9" x2="6.5" y2="19.7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="17.5" y1="19.7" x2="15.9" y2="16.9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8.1" y1="7.1" x2="6.5" y2="4.3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="font-bold text-[15px] tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Helm<span style={{ color: "var(--accent)" }}>CFO</span>
          </div>
          <div className="text-[10px] font-mono tracking-widest" style={{ color: "var(--text-3)" }}>AI FINANCE</div>
        </div>
      </div>

      {/* Company selector */}
      <div className="mx-3 my-3 px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>Acme Corp</p>
          <p className="text-[10px] font-mono" style={{ color: "var(--text-3)" }}>Growth · $799/mo</p>
        </div>
        <ChevronRight size={14} style={{ color: "var(--text-3)" }} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150",
                active
                  ? "text-white"
                  : "hover:bg-[var(--surface-2)]"
              )}
              style={
                active
                  ? {
                      background: "var(--accent-dim)",
                      color: "var(--accent)",
                      border: "1px solid rgba(59,130,246,0.2)",
                    }
                  : { color: "var(--text-2)" }
              }
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t space-y-0.5" style={{ borderColor: "var(--border)" }}>
        {bottomItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all"
            style={{ color: "var(--text-2)" }}
          >
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </Link>
        ))}
        <div className="px-3 py-2.5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", color: "white" }}>
            AC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold truncate" style={{ color: "var(--text)" }}>Alex Chen</p>
            <p className="text-[10px] truncate" style={{ color: "var(--text-3)" }}>CEO · Acme Corp</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
