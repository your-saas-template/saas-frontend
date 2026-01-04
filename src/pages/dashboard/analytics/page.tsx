import { AnalyticsOverview } from "@/widgets/analytics/overview";

export const DashboardAnalyticsPage = () => {
  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-zinc-500">
          Review traffic, business metrics, and usage trends.
        </p>
      </header>
      <AnalyticsOverview />
    </div>
  );
};
