import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountService } from "./service";
import {
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

export const useAccountMe = () =>
  useQuery({
    queryKey: ["account", "me"],
    queryFn: () => accountService.me(),
  });

export const useAuthConfig = () =>
  useQuery({
    queryKey: ["auth", "config"],
    queryFn: () => accountService.authConfig(),
  });

export const useUpdateAccountProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateAccountProfileRequest) =>
      accountService.updateProfile(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
    },
  });
};

export const useLinkOAuthProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: OAuthLinkRequest) =>
      accountService.linkOAuthProvider(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
    },
  });
};

export const useUnlinkProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (provider: string) => accountService.unlinkProvider(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
    },
  });
};

export const useStartEmailProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: EmailStartRequest) =>
      accountService.startEmailProvider(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
    },
  });
};

export const useConfirmEmailProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: EmailConfirmRequest) =>
      accountService.confirmEmailProvider(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
    },
  });
};

export const useSetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PasswordSetRequest) => accountService.setPassword(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PasswordChangeRequest) =>
      accountService.changePassword(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
    },
  });
};

export const useSendEmailVerification = () =>
  useMutation({
    mutationFn: () => accountService.sendEmailVerification(),
  });

export const useConfirmEmailVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: VerificationConfirmRequest) =>
      accountService.confirmEmailVerification(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
    },
  });
};

export const useStartEmailChange = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: EmailChangeStartRequest) =>
      accountService.startEmailChange(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
    },
  });
};

export const useConfirmEmailChange = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: EmailChangeConfirmRequest) =>
      accountService.confirmEmailChange(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
    },
  });
};

export const useDeleteAccount = () =>
  useMutation({
    mutationFn: () => accountService.deleteAccount(),
  });
