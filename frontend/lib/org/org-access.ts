import { STORAGE_KEYS } from "@/lib/constants/storage-keys";

export function getStoredOrgAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.ORG_ACCESS_TOKEN);
}

export function setStoredOrgAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ORG_ACCESS_TOKEN, token);
}

export function clearStoredOrgAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ORG_ACCESS_TOKEN);
}

export function buildOrgJoinUrl(token: string): string {
  if (typeof window === "undefined") return `/join/${encodeURIComponent(token)}`;
  return `${window.location.origin}/join/${encodeURIComponent(token)}`;
}

export function hasOrgAccess(isLoggedIn: boolean): boolean {
  return isLoggedIn || Boolean(getStoredOrgAccessToken());
}
