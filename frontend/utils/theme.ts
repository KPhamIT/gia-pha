import type { ThemeMode } from '@/components/types/family-tree-types';
import { STORAGE_KEYS } from '@/lib/constants/storage-keys';

export function loadStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  return savedTheme === 'dark' ? 'dark' : 'light';
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
