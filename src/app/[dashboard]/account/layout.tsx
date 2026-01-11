"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { messages } from "@/i18n/messages";
import { useI18n } from "@/shared/lib/i18n";
import { Container } from "@/shared/layout/Container";
import { PageHeader } from "@/shared/layout/PageHeader";
import { PageShell } from "@/shared/layout/PageShell";
import { TextColorEnum } from "@/shared/ui/Typography";

const accountNav = [
  {
    href: "/dashboard/account/profile",
    labelKey: messages.dashboard.account.nav.profile,
  },
  {
    href: "/dashboard/account/preferences",
    labelKey: messages.dashboard.account.nav.preferences,
  },
  {
    href: "/dashboard/account/security",
    labelKey: messages.dashboard.account.nav.security,
  },
  {
    href: "/dashboard/account/danger",
    labelKey: messages.dashboard.account.nav.danger,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <PageShell>
      <Container className="space-y-6">
        <PageHeader
          title={t(messages.dashboard.account.title)}
          subtitle={t(messages.dashboard.account.subtitle)}
          subtitleColor={TextColorEnum.Secondary}
        />

        <nav className="flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-2">
          {accountNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-onPrimary"
                    : "text-text hover:bg-primaryHover hover:text-onPrimary",
                )}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-6">{children}</div>
      </Container>
    </PageShell>
  );
}
