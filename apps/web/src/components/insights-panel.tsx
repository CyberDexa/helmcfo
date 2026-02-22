import {
  AlertTriangle,
  TrendingDown,
  FileText,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const insights = [
  {
    type: "critical" as const,
    icon: AlertTriangle,
    title: "Burn rate $47K above your estimate",
    description:
      "You think burn is $240K/mo but it's actually $287K/mo. Missing: $28K accrued liabilities, $12K uncategorized expenses, $7K auto-renewals.",
    action: "See breakdown",
  },
  {
    type: "warning" as const,
    icon: TrendingDown,
    title: "3 invoices overdue — $94K outstanding",
    description:
      "Acme Corp ($42K, 45 days), Globex ($31K, 38 days), Initech ($21K, 32 days). Average DSO increased from 28 to 38 days.",
    action: "Draft collection emails",
  },
  {
    type: "opportunity" as const,
    icon: Zap,
    title: "4 unused SaaS subscriptions detected",
    description:
      "Datadog ($1,200/mo — 0 active users), Notion Teams ($800/mo — migrated to Confluence), Figma ($500/mo — 1 login in 90 days), Loom ($300/mo — 0 recordings).",
    action: "Review & cancel",
  },
  {
    type: "info" as const,
    icon: FileText,
    title: "Board report ready for review",
    description:
      "Q4 financial package auto-generated: P&L, cash flow statement, KPI dashboard, and variance analysis. Ready to send.",
    action: "Preview report",
  },
];

const typeStyles = {
  critical: "border-l-negative bg-negative/5",
  warning: "border-l-warning bg-warning/5",
  opportunity: "border-l-brand-emerald bg-brand-emerald/5",
  info: "border-l-brand-azure bg-brand-azure/5",
};

const iconStyles = {
  critical: "text-negative",
  warning: "text-warning",
  opportunity: "text-brand-emerald",
  info: "text-brand-azure",
};

export function InsightsPanel() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold">AI Insights</h2>
          <p className="text-sm text-text-muted">4 actions recommended</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/20">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
          <span className="text-[11px] font-medium text-brand-emerald">
            Live analysis
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={cn(
              "border-l-[3px] rounded-xl p-4 group cursor-pointer hover:brightness-110 transition-all",
              typeStyles[insight.type]
            )}
          >
            <div className="flex items-start gap-3">
              <insight.icon
                className={cn("w-5 h-5 mt-0.5 flex-shrink-0", iconStyles[insight.type])}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold mb-1">{insight.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {insight.description}
                </p>
                <button className="flex items-center gap-1 mt-2 text-xs font-semibold text-brand-azure hover:text-brand-azure/80 transition-colors">
                  {insight.action}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
