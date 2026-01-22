"use client";

import type { Users } from "@/entities/identity";
import * as React from "react";
import clsx from "clsx";

export type UserAvatarVariant = "header" | "sidebar";

export type UserAvatarProps = {
  user?: Users.User | null;
  /** Fallback initials when user is missing. */
  fallback?: string;
  /** Extra classes for container. */
  className?: string;
  /** aria-label override for accessibility. */
  "aria-label"?: string;
  variant?: UserAvatarVariant;
};

/** Build initials from name or email. */
export function getUserInitials(
  user?: Users.User | null,
  fallback = "U",
): string {
  if (!user) return fallback.toUpperCase();
  const src = user.name?.trim() || user.email || "";
  if (!src) return fallback.toUpperCase();

  // Prefer first + last token from name/email-like string
  const tokens = src.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (tokens.length >= 2) return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase();
  return tokens[0]?.slice(0, 2).toUpperCase() || fallback.toUpperCase();
}

/** Reusable avatar with initials. Fixed look to match UserMenu. */
export function UserAvatar({
  user,
  fallback = "U",
  className,
  variant = "header",
  ...rest
}: UserAvatarProps) {
  const label =
    rest["aria-label"] ||
    (user?.name || user?.email ? `User: ${user?.name || user?.email}` : "User");
  const sizeClassName =
    variant === "sidebar"
      ? "min-h-12 min-w-12 h-12 w-12"
      : "min-h-10 min-w-10 h-10 w-10";
  
  if (user?.avatar) {
    return (
      <img
        src={user?.avatar.url}
        alt={user?.avatar.name}
        className={clsx(
          sizeClassName,
          "object-cover rounded-full inline-flex select-none items-center justify-center text-sm font-semibold uppercase bg-primary text-onPrimary",
          className,
        )}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={[
        sizeClassName,
        "rounded-full",
        "inline-flex select-none items-center justify-center",
        "text-sm font-semibold uppercase",
        "bg-primary text-onPrimary",
        className || "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {getUserInitials(user, fallback)}
    </div>
  );
}

export default UserAvatar;
