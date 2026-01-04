import { EmailTemplatesGrid } from "@/widgets/email/templates-grid";

export const DashboardEmailPage = () => {
  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">Email</h1>
        <p className="text-sm text-zinc-500">
          Manage templates, branding, and email delivery.
        </p>
      </header>
      <EmailTemplatesGrid />
    </div>
  );
};
