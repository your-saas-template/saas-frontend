"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { getTimeZones } from "@vvo/tzdb";
import countries from "i18n-iso-countries";

import { useAuth, UserApi } from "@/entities/identity";
import { messages } from "@/i18n/messages";
import { useI18n } from "@/shared/lib/i18n";
import type { MediaItem } from "@/entities/content/media";

import Spinner from "@/shared/ui/loading/Spinner";
import { P, Small, TextColorEnum } from "@/shared/ui/Typography";
import { Button, ButtonSizeEnum, ButtonVariantEnum } from "@/shared/ui/Button";
import Field from "@/shared/ui/forms/Field";
import Input from "@/shared/ui/forms/Input";
import { LoadingOverlay } from "@/shared/ui/loading/LoadingOverlay";
import { SectionCard } from "@/shared/ui/section/SectionCard";
import { Select } from "@/shared/ui/forms/Select";
import {
  MediaUploadField,
  type MediaUploadSelection,
} from "@/features/media/upload";
import { MediaApi } from "@/entities/content/media";
import { resolveMediaName } from "@/shared/lib/media";
import { toast } from "@/shared/ui/toast/toast";

const normalizeNullable = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

export const DashboardAccountProfilePage = () => {
  const { t, i18n } = useI18n();
  const { user, refreshUser } = useAuth();
  const updateUser = UserApi.User.useUpdateUser();
  const accountQuery = UserApi.Account.useAccountMe();
  const updateAccountProfile = UserApi.Account.useUpdateAccountProfile();

  const [name, setName] = useState<string>(user?.name ?? "");
  const [avatar, setAvatar] = useState<MediaItem | null>(user?.avatar ?? null);
  const [avatarSelection, setAvatarSelection] =
    useState<MediaUploadSelection | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [countryLocale, setCountryLocale] = useState("en");

  const uploadMedia = MediaApi.useUploadMedia();

  const account = accountQuery.data;

  const handleNameSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const hasNameChange = name !== (user?.name ?? "");
    const hasAvatarChange =
      avatar?.id !== user?.avatar?.id || Boolean(avatarSelection);
    const hasProfileChange =
      country !== (account?.country ?? "") ||
      timezone !== (account?.timezone ?? "");

    if (!hasNameChange && !hasAvatarChange && !hasProfileChange) {
      return;
    }

    setUploadError(null);
    setProfileError(null);
    setLoading(true);

    let avatarId = avatar?.id;

    if (avatarSelection) {
      try {
        const inferredName = resolveMediaName(
          avatarSelection,
          avatarSelection.name || name,
        );
        const { media } = await uploadMedia.mutateAsync({
          file:
            avatarSelection.type === "file" ? avatarSelection.file : undefined,
          url: avatarSelection.type === "url" ? avatarSelection.url : undefined,
          name: inferredName || undefined,
        });
        avatarId = media.id;
        setAvatar(media);
        setAvatarSelection(null);
      } catch (err: any) {
        const message = err?.response?.data?.message as string;
        setUploadError(message || t(messages.errors.generic));
        toast.error(message || t(messages.errors.generic));
        setLoading(false);
        return;
      }
    }

    try {
      if (hasNameChange || hasAvatarChange) {
        await updateUser.mutateAsync({
          userId: user?.id || "",
          body: { name, avatar: avatarId },
        });
        await refreshUser();
      }

      if (hasProfileChange) {
        await updateAccountProfile.mutateAsync({
          country: normalizeNullable(country),
          timezone: normalizeNullable(timezone),
        });
      }

      toast.success(t(messages.notifications.account.profileSaved));
    } catch (error: any) {
      const message =
        error?.response?.data?.message || t(messages.errors.generic);
      setProfileError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAvatar(user?.avatar ?? null);
    setAvatarSelection(null);
  }, [user?.avatar]);

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user?.name]);

  useEffect(() => {
    if (!account) return;
    setCountry(account.country ?? "");
    setTimezone(
      account.timezone ??
        (typeof Intl !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""
          : ""),
    );
  }, [account]);

  useEffect(() => {
    let isActive = true;
    const baseLocale = (user?.settings?.locale ?? i18n.language ?? "en")
      .split("-")[0]
      .toLowerCase();
    const loadLocale = (locale: string) =>
      import(`i18n-iso-countries/langs/${locale}.json`).then((module) => {
        if (!isActive) return;
        countries.registerLocale(module.default ?? module);
        setCountryLocale(locale);
      });

    loadLocale(baseLocale).catch(() => {
      if (baseLocale === "en") return;
      loadLocale("en");
    });

    return () => {
      isActive = false;
    };
  }, [i18n.language, user?.settings?.locale]);

  const countryOptions = useMemo(() => {
    const countryNames = countries.getNames(countryLocale, { select: "official" });
    const options = Object.entries(countryNames)
      .map(([code, label]) => ({
        value: code,
        label,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    return [{ value: "", label: t(messages.common.actions.select) }, ...options];
  }, [countryLocale, t]);

  const timezoneOptions = useMemo(() => {
    const rawLocale = user?.settings?.locale ?? i18n.language ?? "en";
    const locale = rawLocale.startsWith("ru") ? "ru" : "en";
    const displayNames =
      typeof Intl !== "undefined" && "DisplayNames" in Intl
        ? new Intl.DisplayNames([locale], { type: "timeZone" })
        : null;
    const options = getTimeZones()
      .map((zone) => ({
        value: zone.name,
        label: displayNames?.of(zone.name) ?? zone.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    return [{ value: "", label: t(messages.common.actions.select) }, ...options];
  }, [i18n.language, t, user?.settings?.locale]);

  const hasProfileChanges = useMemo(() => {
    const hasNameChange = name !== (user?.name ?? "");
    const hasAvatarChange =
      avatar?.id !== user?.avatar?.id || Boolean(avatarSelection);
    const hasProfileChange =
      country !== (account?.country ?? "") ||
      timezone !== (account?.timezone ?? "");
    return hasNameChange || hasAvatarChange || hasProfileChange;
  }, [
    name,
    user?.name,
    avatar?.id,
    user?.avatar?.id,
    avatarSelection,
    country,
    account?.country,
    timezone,
    account?.timezone,
  ]);

  return (
    <LoadingOverlay
      loading={loading || accountQuery.isLoading}
      className="rounded-xl"
    >
      <SectionCard
        title={t(messages.dashboard.account.profileTitle)}
        description={t(messages.dashboard.account.profileDescription)}
      >
        <form onSubmit={handleNameSubmit} className="space-y-4">
          <Field id="name" label={t(messages.validation.nameLabel)}>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t(messages.validation.namePlaceholder)}
            />
          </Field>

          <MediaUploadField
            label={t(messages.media.fields.avatarLabel)}
            savedMedia={avatar}
            onSavedChange={(media) => {
              setAvatar(media);
              setAvatarSelection(null);
            }}
            onSelectionChange={(selection) => {
              setAvatarSelection(selection);
              setUploadError(null);
            }}
            error={uploadError}
            disabled={loading || uploadMedia.isPending}
            isUploading={uploadMedia.isPending}
          />

          <div className="space-y-1">
            <Small className="uppercase tracking-wide font-medium">
              {t(messages.auth.email)}
            </Small>
            <P className="text-sm font-medium">{user?.email}</P>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field id="country" label={t(messages.dashboard.account.countryLabel)}>
              <Select
                id="country"
                value={country}
                onChange={(value) => setCountry(value as string)}
                options={countryOptions}
                isSearchable
              />
            </Field>

            <Field
              id="timezone"
              label={t(messages.dashboard.account.timezoneLabel)}
            >
              <Select
                id="timezone"
                value={timezone}
                onChange={(value) => setTimezone(value as string)}
                options={timezoneOptions}
                isSearchable
              />
            </Field>
          </div>

          {profileError && (
            <Small color={TextColorEnum.Danger}>{profileError}</Small>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              size={ButtonSizeEnum.md}
              variant={ButtonVariantEnum.primary}
              disabled={loading || !hasProfileChanges}
              className="flex items-center gap-2"
            >
              {loading && <Spinner size={16} />}
              <span>{t(messages.common.actions.saveChanges)}</span>
            </Button>
          </div>
        </form>
      </SectionCard>
    </LoadingOverlay>
  );
};
