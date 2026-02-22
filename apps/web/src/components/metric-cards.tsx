import { TrendingUp, TrendingDown, DollarSign, Clock, CreditCard, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const metrics = [
  {
    label: "Cash Position",
    value: "$1.42M",
    change: "+3.2%",
    positive: true,
    icon: DollarSign,
    detail: "Across 3 accounts",
  },
  {
    label: "Monthly Burn",
    value: "$287K",
    change: "+12.4%",
    positive: false,
    icon: CreditCard,
    detail: "$47K above estimate",
    alert: true,
  },
  {
    label: "Runway",
    value: "4.9 mo",
    change: "-0.8 mo",
    positive: false,
    icon: Clock,
    detail: "Cash out: Aug 14",
    alert: true,
  },
  {
    label: "MRR",
    value: "$189K",
    change: "+8.7%",
    positive: true,
    icon: BarChart3,
    detail: "32 active customers",
  },
];

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={cn(
            "glass-card p-5 group hover:bg-surface-hover/50 transition-all duration-200 cursor-default",
            m.alert && "border-negative/20"
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                m.alert
                  ? "bg-negative/10"
                  : "bg-brand-azure/10"
              )}
            >
              <m.icon
                className={cn(
                  "w-5 h-5",
                  m.alert ? "text-negative" : "text-brand-azure"
                )}
              />
            </div>
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                m.positive
                  ? "bg-positive/10 text-positive"
                  : "bg-negative/10 text-negative"
              )}
            >
              {m.positive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {m.change}
            </div>
          </div>
          <div className="stat-value mb-1">{m.value}</div>
          <div className="stat-label mb-1">{m.label}</div>
          <div className="text-xs text-text-muted">{m.detail}</div>
        </div>
      ))}
    </div>
  );
}
