import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  {
    type: "inflow" as const,
    description: "Stripe — Subscription revenue",
    amount: "+$42,300",
    time: "2 hours ago",
    icon: ArrowDownLeft,
  },
  {
    type: "outflow" as const,
    description: "Gusto — Payroll processing",
    amount: "-$128,450",
    time: "5 hours ago",
    icon: ArrowUpRight,
  },
  {
    type: "outflow" as const,
    description: "AWS — Cloud infrastructure",
    amount: "-$8,234",
    time: "Yesterday",
    icon: CreditCard,
  },
  {
    type: "inflow" as const,
    description: "Globex Corp — Invoice #1042 paid",
    amount: "+$31,000",
    time: "Yesterday",
    icon: ArrowDownLeft,
  },
  {
    type: "sync" as const,
    description: "QuickBooks — Auto-reconciled 23 txns",
    amount: "",
    time: "Yesterday",
    icon: RefreshCw,
  },
  {
    type: "outflow" as const,
    description: "Datadog — Monthly subscription",
    amount: "-$1,200",
    time: "2 days ago",
    icon: CreditCard,
    flagged: true,
  },
];

export function RecentActivity() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <p className="text-sm text-text-muted">Live from connected accounts</p>
        </div>
        <button className="text-xs text-brand-azure font-medium hover:underline">
          View all
        </button>
      </div>
      <div className="space-y-1">
        {transactions.map((tx, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-surface-hover/50 transition-colors cursor-default",
              i < transactions.length - 1 && "border-b border-border-subtle/50"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                tx.type === "inflow" && "bg-positive/10",
                tx.type === "outflow" && "bg-negative/10",
                tx.type === "sync" && "bg-brand-azure/10"
              )}
            >
              <tx.icon
                className={cn(
                  "w-4 h-4",
                  tx.type === "inflow" && "text-positive",
                  tx.type === "outflow" && "text-negative",
                  tx.type === "sync" && "text-brand-azure"
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">
                  {tx.description}
                </span>
                {tx.flagged && (
                  <span className="text-[10px] font-semibold bg-warning/15 text-warning px-1.5 py-0.5 rounded">
                    UNUSED
                  </span>
                )}
              </div>
              <span className="text-xs text-text-muted">{tx.time}</span>
            </div>
            {tx.amount && (
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums flex-shrink-0",
                  tx.type === "inflow" ? "text-positive" : "text-negative"
                )}
              >
                {tx.amount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
