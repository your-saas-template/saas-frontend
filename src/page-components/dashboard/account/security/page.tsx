"use client";

import React, { useMemo, useState } from "react";

import { UserApi } from "@/entities/identity";
import { messages } from "@/i18n/messages";
import { useI18n } from "@/shared/lib/i18n";
import { P, Small, TextColorEnum } from "@/shared/ui/Typography";
import { Button, ButtonSizeEnum, ButtonVariantEnum } from "@/shared/ui/Button";
import Input from "@/shared/ui/forms/Input";
import { GoogleButton } from "@/shared/ui/oauth/GoogleButton";
import { LoadingOverlay } from "@/shared/ui/loading/LoadingOverlay";
import { SectionCard } from "@/shared/ui/section/SectionCard";
import PasswordInput from "@/shared/ui/forms/PasswordInput";
import { toast } from "@/shared/ui/toast/toast";
import { useGoogleOAuth } from "@/features/auth/lib/useGoogleOAuth";

export const DashboardAccountSecurityPage = () => {
  const { t } = useI18n();
  const accountQuery = UserApi.Account.useAccountMe();
  const authConfigQuery = UserApi.Account.useAuthConfig();
  const linkOAuthProvider = UserApi.Account.useLinkOAuthProvider();
  const unlinkProvider = UserApi.Account.useUnlinkProvider();
  const startEmailProvider = UserApi.Account.useStartEmailProvider();
  const confirmEmailProvider = UserApi.Account.useConfirmEmailProvider();
  const setPassword = UserApi.Account.useSetPassword();
  const changePassword = UserApi.Account.useChangePassword();
  const sendEmailVerification = UserApi.Account.useSendEmailVerification();
  const confirmEmailVerification = UserApi.Account.useConfirmEmailVerification();
  const startEmailChange = UserApi.Account.useStartEmailChange();
  const confirmEmailChange = UserApi.Account.useConfirmEmailChange();

  const [verificationCode, setVerificationCode] = useState("");
  const [emailStart, setEmailStart] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [changeEmail, setChangeEmail] = useState("");
  const [changeEmailCode, setChangeEmailCode] = useState("");

  const account = accountQuery.data;
  const authProviders = account?.authProviders ?? [];
  const enabledProviders =
    authConfigQuery.data?.enabledProviders ??
    account?.enabledAuthProviders ??
    [];
  const connectedCount = authProviders.length;
  const hasEmailProvider = authProviders.some(
    (provider) => provider.provider === "email",
  );
  const isEmailVerified = account?.emailVerified ?? false;
  const hasPassword = account?.hasPassword ?? false;

  const providerLabels = useMemo(
    () => ({
      email: t(messages.dashboard.account.providers.email),
      google: t(messages.dashboard.account.providers.google),
      apple: t(messages.dashboard.account.providers.apple),
      github: t(messages.dashboard.account.providers.github),
    }),
    [t],
  );

  const googleOAuth = useGoogleOAuth({
    clientId: authConfigQuery.data?.oauth?.googleClientId ?? "",
    onCode: async (code) => {
      try {
        await linkOAuthProvider.mutateAsync({
          provider: "google",
          code,
        });
        toast.success(t(messages.notifications.account.providerLinked));
      } catch (error: any) {
        const message =
          error?.response?.data?.message || t(messages.errors.generic);
        toast.error(message);
      }
    },
  });

  const handleDisconnectProvider = async (provider: string) => {
    try {
      await unlinkProvider.mutateAsync(provider);
      toast.success(t(messages.notifications.account.providerUnlinked));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || t(messages.errors.generic);
      toast.error(message);
    }
  };

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification.mutateAsync();
      toast.success(t(messages.notifications.account.codeSent));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || t(messages.errors.generic);
      toast.error(message);
    }
  };

  const handleConfirmVerification = async () => {
    if (!verificationCode.trim()) return;
    try {
      await confirmEmailVerification.mutateAsync({
        code: verificationCode.trim(),
      });
      setVerificationCode("");
      toast.success(t(messages.notifications.account.emailVerified));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || t(messages.errors.generic);
      toast.error(message);
    }
  };

  const handleEmailStart = async () => {
    if (!emailStart.trim()) return;
    try {
      await startEmailProvider.mutateAsync({ email: emailStart.trim() });
      toast.success(t(messages.notifications.account.codeSent));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || t(messages.errors.generic);
      toast.error(message);
    }
  };

  const handleEmailConfirm = async () => {
    if (!emailStart.trim() || !emailCode.trim()) return;
    try {
      await confirmEmailProvider.mutateAsync({
        email: emailStart.trim(),
        code: emailCode.trim(),
      });
      setEmailCode("");
      toast.success(t(messages.notifications.account.emailLinked));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || t(messages.errors.generic);
      toast.error(message);
    }
  };

  const handleSetPassword = async () => {
    if (!passwordNew.trim() || passwordNew !== passwordConfirm) return;
    try {
      await setPassword.mutateAsync({ newPassword: passwordNew });
      setPasswordNew("");
      setPasswordConfirm("");
      toast.success(t(messages.notifications.account.passwordSet));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || t(messages.errors.generic);
      toast.error(message);
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordCurrent.trim() ||
      !passwordNew.trim() ||
      passwordNew !== passwordConfirm
    ) {
      return;
    }
    try {
      await changePassword.mutateAsync({
        currentPassword: passwordCurrent,
        newPassword: passwordNew,
      });
      setPasswordCurrent("");
      setPasswordNew("");
      setPasswordConfirm("");
      toast.success(t(messages.notifications.account.passwordChanged));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || t(messages.errors.generic);
      toast.error(message);
    }
  };

  const handleChangeEmailStart = async () => {
    if (!changeEmail.trim()) return;
    try {
      await startEmailChange.mutateAsync({ newEmail: changeEmail.trim() });
      toast.success(t(messages.notifications.account.codeSent));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || t(messages.errors.generic);
      toast.error(message);
    }
  };

  const handleChangeEmailConfirm = async () => {
    if (!changeEmail.trim() || !changeEmailCode.trim()) return;
    try {
      await confirmEmailChange.mutateAsync({
        newEmail: changeEmail.trim(),
        code: changeEmailCode.trim(),
      });
      setChangeEmailCode("");
      toast.success(t(messages.notifications.account.emailChanged));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || t(messages.errors.generic);
      toast.error(message);
    }
  };

  return (
    <LoadingOverlay loading={accountQuery.isLoading} className="rounded-xl">
      <SectionCard
        title={t(messages.dashboard.account.securityTitle)}
        description={t(messages.dashboard.account.securityDescription)}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <P className="text-sm font-medium">
                  {t(messages.dashboard.account.providersTitle)}
                </P>
                <Small color={TextColorEnum.Muted}>
                  {t(messages.dashboard.account.providersDescription)}
                </Small>
              </div>
            </div>
            {enabledProviders.length === 0 ? (
              <P color={TextColorEnum.Muted} className="text-sm">
                {t(messages.dashboard.account.providersEmpty)}
              </P>
            ) : (
              <ul className="space-y-2">
                {enabledProviders.map((provider) => {
                  const connected = authProviders.some(
                    (item) => item.provider === provider,
                  );
                  const canDisconnect = connected && connectedCount > 1;
                  const isGoogle = provider === "google";
                  const isEmail = provider === "email";
                  return (
                    <li
                      key={provider}
                      className="flex flex-col gap-3 rounded-md border border-border bg-background px-3 py-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="space-y-1">
                        <P className="text-sm font-medium capitalize">
                          {providerLabels[provider] ?? provider}
                        </P>
                        <Small
                          color={
                            connected
                              ? TextColorEnum.Success
                              : TextColorEnum.Muted
                          }
                        >
                          {connected
                            ? t(messages.dashboard.account.providerConnected)
                            : t(messages.dashboard.account.providerNotConnected)}
                        </Small>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {connected ? (
                          <Button
                            type="button"
                            size={ButtonSizeEnum.sm}
                            variant={ButtonVariantEnum.secondary}
                            onClick={() => handleDisconnectProvider(provider)}
                            disabled={!canDisconnect}
                          >
                            {t(messages.dashboard.account.providerDisconnect)}
                          </Button>
                        ) : isGoogle ? (
                          <GoogleButton
                            google={googleOAuth}
                            disabled={!googleOAuth.isReady}
                          />
                        ) : isEmail ? (
                          <Button
                            type="button"
                            size={ButtonSizeEnum.sm}
                            variant={ButtonVariantEnum.secondary}
                            disabled
                          >
                            {t(messages.dashboard.account.providerManageBelow)}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size={ButtonSizeEnum.sm}
                            variant={ButtonVariantEnum.secondary}
                            disabled
                          >
                            {t(messages.dashboard.account.providerComingSoon)}
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {hasEmailProvider && (
            <div className="space-y-3">
              <div>
                <P className="text-sm font-medium">
                  {t(messages.dashboard.account.emailVerificationTitle)}
                </P>
                <Small color={TextColorEnum.Muted}>
                  {isEmailVerified
                    ? t(messages.dashboard.account.emailVerificationVerified)
                    : t(messages.dashboard.account.emailVerificationPending)}
                </Small>
              </div>

              {!isEmailVerified && (
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <Input
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    placeholder={t(messages.dashboard.account.codePlaceholder)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size={ButtonSizeEnum.sm}
                      variant={ButtonVariantEnum.secondary}
                      onClick={handleSendVerification}
                    >
                      {t(messages.dashboard.account.sendCode)}
                    </Button>
                    <Button
                      type="button"
                      size={ButtonSizeEnum.sm}
                      variant={ButtonVariantEnum.primary}
                      onClick={handleConfirmVerification}
                    >
                      {t(messages.dashboard.account.confirmCode)}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!hasEmailProvider && (
            <div className="space-y-3">
              <div>
                <P className="text-sm font-medium">
                  {t(messages.dashboard.account.addEmailTitle)}
                </P>
                <Small color={TextColorEnum.Muted}>
                  {t(messages.dashboard.account.addEmailDescription)}
                </Small>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <Input
                  value={emailStart}
                  onChange={(event) => setEmailStart(event.target.value)}
                  placeholder={t(messages.auth.emailPlaceholder)}
                  type="email"
                />
                <Button
                  type="button"
                  size={ButtonSizeEnum.sm}
                  variant={ButtonVariantEnum.secondary}
                  onClick={handleEmailStart}
                >
                  {t(messages.dashboard.account.sendCode)}
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <Input
                  value={emailCode}
                  onChange={(event) => setEmailCode(event.target.value)}
                  placeholder={t(messages.dashboard.account.codePlaceholder)}
                />
                <Button
                  type="button"
                  size={ButtonSizeEnum.sm}
                  variant={ButtonVariantEnum.primary}
                  onClick={handleEmailConfirm}
                >
                  {t(messages.dashboard.account.confirmCode)}
                </Button>
              </div>
            </div>
          )}

          {hasEmailProvider && !hasPassword && (
            <div className="space-y-3">
              <div>
                <P className="text-sm font-medium">
                  {t(messages.dashboard.account.setPasswordTitle)}
                </P>
                <Small color={TextColorEnum.Muted}>
                  {t(messages.dashboard.account.setPasswordDescription)}
                </Small>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <PasswordInput
                  value={passwordNew}
                  onChange={(event) => setPasswordNew(event.target.value)}
                  placeholder={t(messages.auth.passwordPlaceholder)}
                  autoComplete="new-password"
                  showStrength
                  showGenerateStrength
                />
                <PasswordInput
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  placeholder={t(messages.auth.confirmPassword)}
                  autoComplete="new-password"
                />
              </div>
              <Button
                type="button"
                size={ButtonSizeEnum.sm}
                variant={ButtonVariantEnum.primary}
                onClick={handleSetPassword}
                disabled={
                  !passwordNew ||
                  !passwordConfirm ||
                  passwordNew !== passwordConfirm
                }
              >
                {t(messages.dashboard.account.setPasswordAction)}
              </Button>
            </div>
          )}

          {hasEmailProvider && hasPassword && (
            <div className="space-y-3">
              <div>
                <P className="text-sm font-medium">
                  {t(messages.dashboard.account.changePasswordTitle)}
                </P>
                <Small color={TextColorEnum.Muted}>
                  {t(messages.dashboard.account.changePasswordDescription)}
                </Small>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <PasswordInput
                  value={passwordCurrent}
                  onChange={(event) => setPasswordCurrent(event.target.value)}
                  placeholder={t(messages.dashboard.account.currentPassword)}
                  autoComplete="current-password"
                />
                <PasswordInput
                  value={passwordNew}
                  onChange={(event) => setPasswordNew(event.target.value)}
                  placeholder={t(messages.auth.passwordPlaceholder)}
                  autoComplete="new-password"
                  showStrength
                  showGenerateStrength
                />
                <PasswordInput
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  placeholder={t(messages.auth.confirmPassword)}
                  autoComplete="new-password"
                />
              </div>
              <Button
                type="button"
                size={ButtonSizeEnum.sm}
                variant={ButtonVariantEnum.primary}
                onClick={handleChangePassword}
                disabled={
                  !passwordCurrent ||
                  !passwordNew ||
                  !passwordConfirm ||
                  passwordNew !== passwordConfirm
                }
              >
                {t(messages.dashboard.account.changePasswordAction)}
              </Button>
            </div>
          )}

          {hasEmailProvider && (
            <div className="space-y-3">
              <div>
                <P className="text-sm font-medium">
                  {t(messages.dashboard.account.changeEmailTitle)}
                </P>
                <Small color={TextColorEnum.Muted}>
                  {t(messages.dashboard.account.changeEmailDescription)}
                </Small>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <Input
                  type="email"
                  value={changeEmail}
                  onChange={(event) => setChangeEmail(event.target.value)}
                  placeholder={t(messages.dashboard.account.newEmailPlaceholder)}
                />
                <Button
                  type="button"
                  size={ButtonSizeEnum.sm}
                  variant={ButtonVariantEnum.secondary}
                  onClick={handleChangeEmailStart}
                >
                  {t(messages.dashboard.account.sendCode)}
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <Input
                  value={changeEmailCode}
                  onChange={(event) =>
                    setChangeEmailCode(event.target.value)
                  }
                  placeholder={t(messages.dashboard.account.codePlaceholder)}
                />
                <Button
                  type="button"
                  size={ButtonSizeEnum.sm}
                  variant={ButtonVariantEnum.primary}
                  onClick={handleChangeEmailConfirm}
                >
                  {t(messages.dashboard.account.confirmCode)}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SectionCard>
    </LoadingOverlay>
  );
};
