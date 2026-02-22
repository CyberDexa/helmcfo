import { Bell, Search, ChevronDown } from "lucide-react";

export function TopBar() {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border-subtle bg-surface-1/50 backdrop-blur-sm">
      {/* Left — Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Ask Chief anything..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-2 border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-azure/30 focus:border-brand-azure/40 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted bg-surface-0 px-1.5 py-0.5 rounded border border-border-subtle">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-4">
        {/* Live status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-emerald/10 border border-brand-emerald/20">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
          <span className="text-xs font-medium text-brand-emerald">
            Synced
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-surface-hover transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-azure rounded-full" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-hover transition-colors">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-sapphire to-brand-emerald flex items-center justify-center">
            <span className="text-white font-semibold text-xs">OB</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>
    </header>
  );
}
