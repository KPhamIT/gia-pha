import { api } from "@/lib/api";
import { getToken } from "@/lib/auth/session";
import { getStoredOrgAccessToken } from "@/lib/org/org-access";
import type { OrgBookContext } from "@/lib/settings/default-user-settings";

/** undefined = chưa load; null = đã load, không có dữ liệu. */
let cache: OrgBookContext | undefined;
let cacheScope: string | undefined;
let inflight: Promise<OrgBookContext> | null = null;
let inflightScope: string | undefined;

const EMPTY_ORG_CONTEXT: OrgBookContext = {
  name: null,
  createdAt: null,
  establishedYear: null,
  clanAddress: null,
};

function scopeKey(): string {
  const orgToken = getStoredOrgAccessToken();
  if (orgToken) return `guest:${orgToken}`;
  if (getToken()) return "auth";
  return "anon";
}

export function invalidateOrgBookContext(): void {
  cache = undefined;
  cacheScope = undefined;
  inflight = null;
  inflightScope = undefined;
}

/** Org book fields (năm lập, địa chỉ) — luôn từ bảng Organization. */
export async function fetchOrgBookContext(
  force = false,
): Promise<OrgBookContext> {
  const scope = scopeKey();
  if (!force && cache !== undefined && cacheScope === scope) return cache;
  if (!force && inflight && inflightScope === scope) return inflight;

  if (!force && scope === "anon") {
    cache = EMPTY_ORG_CONTEXT;
    cacheScope = scope;
    return cache;
  }

  inflightScope = scope;
  inflight = api.organizations
    .getBookContext()
    .then((org) => {
      cache = {
        name: org.name,
        createdAt: org.createdAt,
        establishedYear: org.establishedYear ?? null,
        clanAddress: org.clanAddress ?? null,
      };
      cacheScope = scope;
      return cache;
    })
    .catch(() => {
      cache = EMPTY_ORG_CONTEXT;
      cacheScope = scope;
      return cache;
    })
    .finally(() => {
      inflight = null;
      inflightScope = undefined;
    });

  return inflight;
}

export function getCachedOrgBookContext(): OrgBookContext | undefined {
  return cache;
}
