import { api } from "@/lib/api";
import { getStoredOrgAccessToken } from "@/lib/org/org-access";
import type { UserSettings } from "@/lib/api/modules/settings";

/** undefined = chưa load; null = đã load, không có dữ liệu. */
let cache: UserSettings | null | undefined;
let cacheScope: string | undefined;
let inflight: Promise<UserSettings | null> | null = null;
let inflightScope: string | undefined;

function scopeKey(): string {
  const orgToken =
    typeof window !== "undefined" ? getStoredOrgAccessToken() : null;
  return orgToken ? `guest:${orgToken}` : "auth";
}

/** Một request GET /settings dùng chung cho toàn app (dedupe khi mount song song). */
export function fetchUserSettings(): Promise<UserSettings | null> {
  const scope = scopeKey();
  if (cache !== undefined && cacheScope === scope) {
    return Promise.resolve(cache);
  }
  if (inflight && inflightScope === scope) return inflight;

  inflightScope = scope;
  inflight = api.settings
    .getMine()
    .then((data) => {
      cache = data;
      cacheScope = scope;
      return data;
    })
    .finally(() => {
      inflight = null;
      inflightScope = undefined;
    });

  return inflight;
}

export function getCachedUserSettings(): UserSettings | null | undefined {
  return cache;
}

export function patchUserSettingsCache(patch: UserSettings): void {
  cache = { ...(cache ?? {}), ...patch };
}

export function invalidateUserSettingsCache(): void {
  cache = undefined;
  cacheScope = undefined;
}
