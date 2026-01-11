"use client";

import { useAuth, UserApi, type User } from "@/entities/identity";
import { messages } from "@/i18n/messages";
import { useI18n } from "@/shared/lib/i18n";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";
import { DangerZoneSection } from "@/shared/ui/section/DangerZoneSection";
import { useDeleteWithConfirm } from "@/shared/lib/hooks/useDeleteWithConfirm";
import { toast } from "@/shared/ui/toast/toast";

export const DashboardAccountDangerPage = () => {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const deleteAccount = UserApi.Account.useDeleteAccount();

  const {
    requestDelete: requestAccountDelete,
    modalProps: accountDeleteModalProps,
  } = useDeleteWithConfirm<User>({
    canDelete: true,
    getLabel: () => "DELETE",
    onDelete: async () => {
      try {
        await deleteAccount.mutateAsync();
        toast.success(t(messages.notifications.account.deleteSuccess));
        await logout();
      } catch (error: any) {
        const message =
          error?.response?.data?.message || t(messages.errors.generic);
        toast.error(message);
      }
    },
  });

  return (
    <>
      <DangerZoneSection
        titleKey={messages.dashboard.account.delete.title}
        descriptionKey={messages.dashboard.account.delete.description}
        buttonLabelKey={messages.dashboard.account.delete.buttonLabel}
        onClick={() => user && requestAccountDelete(user as User)}
      />

      <DeleteModal
        open={accountDeleteModalProps.open}
        onClose={accountDeleteModalProps.onClose}
        requiredValue={accountDeleteModalProps.requiredValue}
        onConfirm={accountDeleteModalProps.onConfirm}
      />
    </>
  );
};
