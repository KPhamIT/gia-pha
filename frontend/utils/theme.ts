import type { ThemeMode } from '@/components/types/family-tree-types';
import { STORAGE_KEYS } from '@/lib/constants/storage-keys';

export function loadStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  return savedTheme === 'dark' ? 'dark' : 'light';
}

/** Inline script for layout — applies `dark` on <html> before React hydrates. */
export function themeInitScript(): string {
  return `(function(){try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEYS.THEME)});if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;
}

export function applyTheme(theme: ThemeMode): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function getPageShellClass(theme: ThemeMode): string {
  return theme === 'dark'
    ? 'bg-slate-950 text-slate-100'
    : 'bg-slate-50 text-slate-900';
}

export function getMutedTextClass(theme: ThemeMode): string {
  return theme === 'dark' ? 'text-slate-100' : 'text-slate-600';
}
