import { api } from "@/lib/api";
import type { UserSettings } from "@/lib/api/modules/settings";

/** undefined = chưa load; null = đã load, không có dữ liệu. */
let cache: UserSettings | null | undefined;
let inflight: Promise<UserSettings | null> | null = null;

/** Một request GET /settings dùng chung cho toàn app (dedupe khi mount song song). */
export function fetchUserSettings(): Promise<UserSettings | null> {
  if (cache !== undefined) return Promise.resolve(cache);
  if (inflight) return inflight;

  inflight = api.settings
    .getMine()
    .then((data) => {
      cache = data;
      return data;
    })
    .finally(() => {
      inflight = null;
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
}
