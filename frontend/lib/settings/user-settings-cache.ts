import { api } from "@/lib/api";
import { getStoredOrgAccessToken } from "@/lib/org/org-access";
import { resolveUserSettings } from "@/lib/settings/default-user-settings";
import type { UserSettings } from "@/lib/api/modules/settings";

/** undefined = chưa load; null = đã load, không có dữ liệu. */
let cache: UserSettings | null | undefined;
let cacheScope: string | undefined;
let inflight: Promise<UserSettings | null> | null = null;
let inflightScope: string | undefined;
let orgNameCache: string | null | undefined;
let orgNameInflight: Promise<string | null> | null;

function scopeKey(): string {
  const orgToken =
    typeof window !== "undefined" ? getStoredOrgAccessToken() : null;
  return orgToken ? `guest:${orgToken}` : "auth";
}

async function fetchOrgDisplayName(): Promise<string | null> {
  if (orgNameCache !== undefined) return orgNameCache;
  if (orgNameInflight) return orgNameInflight;

  const token = getStoredOrgAccessToken();
  if (!token) {
    orgNameCache = null;
    return null;
  }

  orgNameInflight = api.organizations
    .resolvePublic(token)
    .then((org) => {
      orgNameCache = org.name;
      return org.name;
    })
    .catch(() => {
      orgNameCache = null;
      return null;
    })
    .finally(() => {
      orgNameInflight = null;
    });

  return orgNameInflight;
}

/** Một request GET /settings dùng chung cho toàn app (dedupe khi mount song song). */
export function fetchUserSettings(): Promise<UserSettings | null> {
  const scope = scopeKey();
  if (cache !== undefined && cacheScope === scope) {
    return Promise.resolve(cache);
  }
  if (inflight && inflightScope === scope) return inflight;

  inflightScope = scope;
  inflight = Promise.all([api.settings.getMine(), fetchOrgDisplayName()])
    .then(([data, orgName]) => {
      const resolved = resolveUserSettings(data, orgName);
      cache = resolved;
      cacheScope = scope;
      return resolved;
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
  orgNameCache = undefined;
}
