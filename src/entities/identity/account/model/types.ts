export type AccountProviderName = "email" | "google" | "apple" | "github";

export type AccountAuthProvider = {
  provider: AccountProviderName;
  providerId?: string;
  email?: string;
  addedAt?: string;
  lastUsedAt?: string;
};

export type AccountProfile = {
  _id?: string;
  email?: string;
  name?: string;
  birthday?: string | null;
  phone?: string | null;
  country?: string | null;
  timezone?: string | null;
  authProviders?: AccountAuthProvider[];
  emailVerified?: boolean;
  hasPassword?: boolean;
  enabledAuthProviders?: AccountProviderName[];
};

export type UpdateAccountProfileRequest = {
  birthday?: string | null;
  phone?: string | null;
  country?: string | null;
  timezone?: string | null;
};

export type AuthConfig = {
  enabledProviders: AccountProviderName[];
  oauth?: {
    googleClientId?: string | null;
  };
};

export type OAuthLinkRequest = {
  provider: AccountProviderName;
  idToken?: string;
  code?: string;
  redirect_uri?: string;
  code_verifier?: string;
};

export type EmailStartRequest = {
  email: string;
};

export type EmailConfirmRequest = {
  email: string;
  code: string;
};

export type PasswordSetRequest = {
  newPassword: string;
};

export type PasswordChangeRequest = {
  currentPassword: string;
  newPassword: string;
};

export type VerificationConfirmRequest = {
  code: string;
};

export type EmailChangeStartRequest = {
  newEmail: string;
};

export type EmailChangeConfirmRequest = {
  newEmail: string;
  code: string;
};
