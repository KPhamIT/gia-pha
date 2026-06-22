"use client";

import { useEffect, useState } from "react";
import type { ThemeMode } from "@/components/types/family-tree-types";
import { applyTheme, loadStoredTheme } from "@/utils/theme";

/** SSR-safe default; real preference loads in useEffect after hydration. */
const INITIAL_THEME: ThemeMode = "light";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(INITIAL_THEME);

  useEffect(() => {
    // Đọc theme đã lưu sau khi hydrate: localStorage chỉ có ở client, nên phải
    // sync trong effect để tránh hydration mismatch (SSR luôn render 'light').
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(loadStoredTheme());
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return { theme, setTheme, toggleTheme };
}
