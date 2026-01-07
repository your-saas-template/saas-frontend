import { Theme } from "@/shared/ui";

/**
 * User settings shape returned by the backend.
 * Mirrors OpenAPI schema "UserSettings".
 */
export interface UserSettings {
  locale: string;
  theme: Theme; // "light" | "dark" | "system"
}