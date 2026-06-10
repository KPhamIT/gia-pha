'use client';

import { useEffect, useState } from 'react';
import type { ThemeMode } from '@/components/types/family-tree-types';
import { applyTheme, loadStoredTheme } from '@/utils/theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(loadStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return { theme, setTheme, toggleTheme };
}
