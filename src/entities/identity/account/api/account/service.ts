import { apiClient } from "@/shared/lib/http/apiClient";
import { ApiResponse } from "@/shared/types/api/global";
import {
  AccountProfile,
  AuthConfig,
  EmailChangeConfirmRequest,
  EmailChangeStartRequest,
  EmailConfirmRequest,
  EmailStartRequest,
  OAuthLinkRequest,
  PasswordChangeRequest,
  PasswordSetRequest,
  UpdateAccountProfileRequest,
  VerificationConfirmRequest,
} from "@/entities/identity/account/model/types";

const unwrap = <T>(payload: ApiResponse<T> | T): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
};

export const accountService = {
  me: async () => {
    const { data } = await apiClient.get<ApiResponse<AccountProfile> | AccountProfile>(
      "/api/account/me",
    );
    return unwrap<AccountProfile>(data);
  },

  updateProfile: async (body: UpdateAccountProfileRequest) => {
    const { data } = await apiClient.patch<ApiResponse<AccountProfile> | AccountProfile>(
      "/api/account/profile",
      body,
    );
    return unwrap<AccountProfile>(data);
  },

  authConfig: async () => {
    const { data } = await apiClient.get<AuthConfig>("/api/auth/config");
    return data;
  },

  linkOAuthProvider: (body: OAuthLinkRequest) =>
    apiClient.post("/api/account/providers/oauth/link", body),

  unlinkProvider: (provider: string) =>
    apiClient.delete(`/api/account/providers/${provider}`),

  startEmailProvider: (body: EmailStartRequest) =>
    apiClient.post("/api/account/providers/email/start", body),

  confirmEmailProvider: (body: EmailConfirmRequest) =>
    apiClient.post("/api/account/providers/email/confirm", body),

  setPassword: (body: PasswordSetRequest) =>
    apiClient.post("/api/account/password/set", body),

  changePassword: (body: PasswordChangeRequest) =>
    apiClient.post("/api/account/password/change", body),

  sendEmailVerification: () =>
    apiClient.post("/api/account/email/verification/send"),

  confirmEmailVerification: (body: VerificationConfirmRequest) =>
    apiClient.post("/api/account/email/verification/confirm", body),

  startEmailChange: (body: EmailChangeStartRequest) =>
    apiClient.post("/api/account/email/change/start", body),

  confirmEmailChange: (body: EmailChangeConfirmRequest) =>
    apiClient.post("/api/account/email/change/confirm", body),

  deleteAccount: () => apiClient.delete("/api/account"),
};
