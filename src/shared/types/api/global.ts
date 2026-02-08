/**
 * Standard API envelope used across the app.
 */
export type ApiResponse<T, M = undefined> = {
  data: T;
  meta?: M;
  error?: string;
  status?: number;
};
