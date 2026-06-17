import { STORAGE_KEYS } from '@/lib/constants/storage-keys';
import { API_ROUTES } from '@/lib/constants/api-routes';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function getZaloLoginUrl(): string {
  return `${API_URL}${API_ROUTES.AUTH_ZALO}`;
}

export function loginWithZalo(): void {
  window.location.href = getZaloLoginUrl();
}

export function logout(): void {
  clearToken();
  window.location.href = '/login';
}
