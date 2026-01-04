import { CurrentSubscriptionSection } from "@/widgets/billing/current-subscription";
import { PricingSection } from "@/widgets/billing/pricing";

export const DashboardBillingPage = () => {
  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-sm text-zinc-500">
          Manage subscriptions, plans, and payment settings.
        </p>
      </header>
      <CurrentSubscriptionSection />
      <PricingSection />
    </div>
  );
};
