import { AlertTriangle } from "lucide-react";

export function RunwayGauge() {
  const totalMonths = 12;
  const currentRunway = 4.9;
  const extendedRunway = 7.3;
  const pct = (currentRunway / totalMonths) * 100;
  const extPct = (extendedRunway / totalMonths) * 100;

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Runway</h2>
        <div className="flex items-center gap-1.5 text-warning text-xs font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          Warning
        </div>
      </div>

      {/* Circular gauge */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            {/* Background track */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#1A2744"
              strokeWidth="12"
            />
            {/* Extended runway (lighter) */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#1B7FE3"
              strokeWidth="12"
              strokeDasharray={`${(extPct / 100) * 534} 534`}
              strokeLinecap="round"
              opacity={0.3}
            />
            {/* Current runway */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="12"
              strokeDasharray={`${(pct / 100) * 534} 534`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold tabular-nums">4.9</span>
            <span className="text-sm text-text-muted">months left</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mt-auto">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Cash-out date</span>
          <span className="font-semibold text-negative">Aug 14, 2026</span>
        </div>
        <div className="h-px bg-border-subtle" />
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">If optimized</span>
          <span className="font-semibold text-brand-azure">Nov 2, 2026</span>
        </div>
        <div className="h-px bg-border-subtle" />
        <div className="text-xs text-text-muted">
          Collect $94K overdue invoices + cut $2.8K/mo unused SaaS → extend by{" "}
          <span className="text-brand-emerald font-semibold">2.4 months</span>
        </div>
        <button className="w-full mt-2 py-2.5 rounded-xl bg-brand-azure/15 text-brand-azure text-sm font-semibold hover:bg-brand-azure/25 transition-colors">
          View Optimization Plan
        </button>
      </div>
    </div>
  );
}
