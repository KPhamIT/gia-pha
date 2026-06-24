import { api } from "@/lib/api";
import { getToken } from "@/lib/auth/session";
import { getStoredOrgAccessToken } from "@/lib/org/org-access";
import type { OrgBookContext } from "@/lib/settings/default-user-settings";

/** undefined = chưa load; null = đã load, không có dữ liệu. */
let cache: OrgBookContext | undefined;
let inflight: Promise<OrgBookContext> | null = null;

const EMPTY_ORG_CONTEXT: OrgBookContext = {
  name: null,
  createdAt: null,
  establishedYear: null,
  clanAddress: null,
};

export function invalidateOrgBookContext(): void {
  cache = undefined;
  inflight = null;
}

/** Org book fields (năm lập, địa chỉ) — luôn từ bảng Organization. */
export async function fetchOrgBookContext(
  force = false,
): Promise<OrgBookContext> {
  if (!force && cache !== undefined) return cache;
  if (!force && inflight) return inflight;

  const token = getStoredOrgAccessToken();
  if (!force && !token && !getToken()) {
    cache = EMPTY_ORG_CONTEXT;
    return cache;
  }

  inflight = api.organizations
    .getBookContext()
    .then((org) => {
      cache = {
        name: org.name,
        createdAt: org.createdAt,
        establishedYear: org.establishedYear ?? null,
        clanAddress: org.clanAddress ?? null,
      };
      return cache;
    })
    .catch(() => {
      cache = EMPTY_ORG_CONTEXT;
      return cache;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function getCachedOrgBookContext(): OrgBookContext | undefined {
  return cache;
}
