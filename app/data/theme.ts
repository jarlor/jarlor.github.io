export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "jarlor-theme";
export const THEME_EVENT = "jarlor-theme-change";
export const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";
export const THEME_COLORS: Record<Theme, string> = {
  light: "#f6f8f8",
  dark: "#0d171b",
};
