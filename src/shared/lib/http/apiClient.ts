import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { I18N, ENV } from "@/shared/config";
import { getCookie } from "@/shared/lib/cookies";
import { notifySessionExpired } from "@/shared/lib/auth/session";

declare module "axios" {
  export interface AxiosRequestConfig {
    __skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

const AUTH_PUBLIC = [
  /^\/api\/auth\/login/,
  /^\/api\/auth\/register/,
  /^\/api\/auth\/oauth\//,
  /^\/api\/auth\/forgot-password/,
  /^\/api\/auth\/reset-password/,
];
const AUTH_ANY = [/^\/api\/auth\//];

export const apiClient: AxiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const url = (config.url || "").replace(ENV.API_URL || "", "");

  // i18n locale from cookie
  const lng = getCookie(I18N.LOCALE_COOKIE_KEY) || I18N.DEFAULT_LOCALE;
  config.headers = config.headers ?? {};
  config.headers["Accept-Language"] = lng;

  const isAuthPublic = AUTH_PUBLIC.some((re) => re.test(url));
  config.__skipAuthRefresh = isAuthPublic;
  return config;
});

// refresh on 401 except auth endpoints or opted-out requests
let isRefreshing = false;
type FailedQueueItem = {
  resolve: (t: string | null) => void;
  reject: (error: Error) => void;
};
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
      return;
    }
    p.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }
    const originalRequest = error.config;
    const url = (originalRequest.url || "").replace(ENV.API_URL || "", "");

    const skip =
      originalRequest.__skipAuthRefresh || AUTH_ANY.some((re) => re.test(url));

    const isMeRequest = /^\/api\/me/.test(url);

    if (!skip && error.response?.status === 401 && originalRequest._retry) {
      if (isMeRequest) {
        return Promise.reject(error);
      }
      notifySessionExpired();
      return Promise.reject(error);
    }

    if (!skip && error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (token) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          cache: "no-store",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`REFRESH_${res.status}`);
        }

        processQueue(null, null);
        return apiClient(originalRequest);
      } catch (err) {
        const errorToHandle =
          err instanceof Error ? err : new Error("Failed to refresh session");
        processQueue(errorToHandle, null);
        notifySessionExpired();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
