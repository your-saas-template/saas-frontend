"use client";

import { messages } from "@/i18n/messages";
import { useI18n } from "@/shared/lib/i18n";
import { P, Small, TextColorEnum } from "@/shared/ui/Typography";
import { SectionCard } from "@/shared/ui/section/SectionCard";
import { ThemeToggle, LanguageSwitcher } from "@/widgets/app-shell/controls";

export const DashboardAccountPreferencesPage = () => {
  const { t } = useI18n();

  return (
    <SectionCard
      title={t(messages.dashboard.account.preferencesTitle)}
      description={t(messages.dashboard.account.preferencesDescription)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <P className="text-sm font-medium">
              {t(messages.dashboard.account.themeLabel)}
            </P>
            <Small>{t(messages.dashboard.account.themeDescription)}</Small>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <P className="text-sm font-medium">
              {t(messages.dashboard.account.languageLabel)}
            </P>
            <Small>{t(messages.dashboard.account.languageDescription)}</Small>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </SectionCard>
  );
};
