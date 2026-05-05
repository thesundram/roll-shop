import AppShell from "@/components/app-shell";
import KpiCards from "@/components/dashboard/kpi-cards";
import {
  GrindingTrendChart,
  MachineProductivityChart,
  RollTypeChart,
  ShapeDistributionChart,
  TonnageTrendChart,
} from "@/components/dashboard/charts";
import {
  RecentGrindings,
  AlertsPanel,
  RollStatusSummary,
} from "@/components/dashboard/recent-activity";
import PageHeader from "@/components/page-header";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="p-4 md:p-6 space-y-6 pt-16 lg:pt-6">
        <PageHeader
          title="Executive Dashboard"
          description="Real-time overview of Roll Shop grinding operations · January 2024"
        />

        {/* KPI Cards */}
        <KpiCards />

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GrindingTrendChart />
          <TonnageTrendChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MachineProductivityChart />
          <RollTypeChart />
        </div>

        {/* Lower Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <ShapeDistributionChart />
          </div>
          <div className="lg:col-span-1">
            <RollStatusSummary />
          </div>
          <div className="lg:col-span-1">
            <AlertsPanel />
          </div>
        </div>

        {/* Recent Logs */}
        <RecentGrindings />
      </div>
    </AppShell>
  );
}
