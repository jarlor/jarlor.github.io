"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const storageKey = "jarlor-theme";
const themeEvent = "jarlor-theme-change";
const systemThemeQuery = "(prefers-color-scheme: dark)";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#0d171e" : "#f8fafb");
}

function subscribe(onChange: () => void) {
  const systemTheme = window.matchMedia(systemThemeQuery);

  const handleSystemTheme = () => {
    if (window.localStorage.getItem(storageKey)) return;
    applyTheme(systemTheme.matches ? "dark" : "light");
    onChange();
  };

  window.addEventListener(themeEvent, onChange);
  systemTheme.addEventListener("change", handleSystemTheme);

  return () => {
    window.removeEventListener(themeEvent, onChange);
    systemTheme.removeEventListener("change", handleSystemTheme);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "light");
  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  const toggleTheme = () => {
    const commitTheme = () => {
      applyTheme(nextTheme);
      window.localStorage.setItem(storageKey, nextTheme);
      window.dispatchEvent(new Event(themeEvent));
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
