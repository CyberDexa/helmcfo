import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { MetricCards } from "@/components/metric-cards";
import { CashFlowChart } from "@/components/cash-flow-chart";
import { RunwayGauge } from "@/components/runway-gauge";
import { InsightsPanel } from "@/components/insights-panel";
import { RecentActivity } from "@/components/recent-activity";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPI Row */}
          <div className="animate-fade-in" style={{ animationDelay: "0.05s" }}>
            <MetricCards />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Cash Flow Chart — spans 2 cols */}
            <div
              className="xl:col-span-2 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CashFlowChart />
            </div>

            {/* Runway Gauge */}
            <div
              className="animate-fade-in"
              style={{ animationDelay: "0.15s" }}
            >
              <RunwayGauge />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div
              className="animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <InsightsPanel />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "0.25s" }}
            >
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
