"use client";

import { useSyncExternalStore } from "react";
import {
  SYSTEM_THEME_QUERY,
  THEME_COLORS,
  THEME_EVENT,
  THEME_STORAGE_KEY,
  type Theme,
} from "../data/theme";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}

function subscribe(onChange: () => void) {
  const systemTheme = window.matchMedia(SYSTEM_THEME_QUERY);

  const handleSystemTheme = () => {
    if (window.localStorage.getItem(THEME_STORAGE_KEY)) return;
    applyTheme(systemTheme.matches ? "dark" : "light");
    onChange();
  };

  window.addEventListener(THEME_EVENT, onChange);
  systemTheme.addEventListener("change", handleSystemTheme);

  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    systemTheme.removeEventListener("change", handleSystemTheme);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "light");
  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  const toggleTheme = () => {
    const commitTheme = () => {
      applyTheme(nextTheme);
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      window.dispatchEvent(new Event(THEME_EVENT));
    };
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const themeDocument = document as Document & {
      startViewTransition?: (update: () => void) => void;
    };

    if (!reducedMotion && themeDocument.startViewTransition) {
      themeDocument.startViewTransition(commitTheme);
    } else {
      commitTheme();
    }
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-mark" aria-hidden="true" />
    </button>
  );
}
