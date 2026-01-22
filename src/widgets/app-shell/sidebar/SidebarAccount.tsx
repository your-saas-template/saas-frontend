"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";

import { Auth, Users } from "@/entities/identity";
import Tooltip, { TooltipPosition } from "@/shared/ui/Tooltip";
import { messages } from "@/i18n/messages";
import { useI18n } from "@/shared/lib/i18n";

type SidebarAccountProps = {
  isExpanded: boolean;
  variant: "desktop" | "mobile";
  onAfterNavigate?: () => void;
};

export const SidebarAccount = ({
  isExpanded,
  variant,
  onAfterNavigate,
}: SidebarAccountProps) => {
  const router = useRouter();
  const { user } = Auth.useAuth();
  const { t } = useI18n();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    router.push("/dashboard/account/profile");
    if (onAfterNavigate) onAfterNavigate();
  };

  const showExpandedContent = variant === "desktop" ? isExpanded : true;
  const hideText = variant === "desktop" && !isExpanded;

  return (
    <div
      className="border-b border-border px-3 py-3 cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={clsx(
          "flex items-center transition-all duration-200",
          variant === "desktop"
            ? isExpanded
              ? "justify-start"
              : "justify-center"
            : "justify-start",
        )}
      >
        <Users.UserPreview
          user={user ?? null}
          showEmail={!!user?.email && !!user?.name}
          showPlan
          showRoleBadge
          size="md"
          hideText={!showExpandedContent || hideText}
        />
      </div>
    </div>
  );
};
