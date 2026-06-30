import { api } from "@/lib/api";
import { getStoredOrgAccessToken } from "@/lib/org/org-access";
import { buildJoinLinkUrl } from "@/lib/site-url";

/** Link join mặc định trên landing: org đang đăng nhập hoặc org demo. */
export async function fetchDefaultJoinLinkUrl(options: {
  isLoggedIn: boolean;
  isDemo: boolean;
}): Promise<string | null> {
  const { isLoggedIn, isDemo } = options;

  if (isLoggedIn && !isDemo) {
    const stored = getStoredOrgAccessToken();
    if (stored) return buildJoinLinkUrl(stored);

    try {
      const me = await api.auth.me();
      const token = me.orgAccessToken ?? getStoredOrgAccessToken();
      if (token) return buildJoinLinkUrl(token);
    } catch {
      /* thử org demo bên dưới */
    }
  }

  try {
    const demo = await api.organizations.getDemo();
    if (demo?.accessToken) return buildJoinLinkUrl(demo.accessToken);
  } catch {
    /* không có org demo */
  }

  return null;
}
