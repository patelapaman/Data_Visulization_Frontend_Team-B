import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "infosys-soc-theme";

function getSystemPreference() {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  // `theme` is the user's preference: "dark" | "light" | "system".
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || "dark");
  // `resolvedTheme` is what's actually applied to the DOM ("dark" | "light").
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    theme === "system" ? getSystemPreference() : theme
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);

    if (theme !== "system") {
      setResolvedTheme(theme);
      return;
    }

    // Follow the OS preference live while "System" is selected.
    setResolvedTheme(getSystemPreference());
    if (!window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setResolvedTheme(e.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      isDark: resolvedTheme === "dark",
      // Toggling flips between dark/light directly (used by the navbar's
      // quick-toggle button); the Settings page also offers "System".
      toggleTheme: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      setTheme,
    }),
    [theme, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
