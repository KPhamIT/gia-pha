"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getToken, setToken } from "@/lib/auth/session";
import {
  getStoredOrgAccessToken,
} from "@/lib/org/org-access";
import { useAuthStore } from "@/store/authStore";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";

const DEMO_USERNAME = "demo";
const DEMO_PASSWORD = "123";

let demoLoginInflight: Promise<boolean> | null = null;

/** Chờ refresh xong; nếu token mới gắn giữa chừng thì refresh lại. */
async function refreshAuthWithToken(): Promise<boolean> {
  await useAuthStore.getState().refresh();
  if (useAuthStore.getState().isLoggedIn) return true;
  if (!getToken()) return false;
  // Inflight trước đó có thể đã chạy khi chưa có token — gọi lại.
  await useAuthStore.getState().refresh();
  return useAuthStore.getState().isLoggedIn;
}

/**
 * Khách chưa login → nên thử tài khoản demo khi:
 * - chưa có org token, hoặc
 * - org token đang là của org demo (link mặc định trên landing).
 * Không ghi đè khách vào bằng join link của dòng họ thật.
 */
export async function shouldAttemptDemoLogin(): Promise<boolean> {
  if (useAuthStore.getState().isLoggedIn) return false;
  const stored = getStoredOrgAccessToken();
  if (!stored) return true;
  try {
    const demo = await api.organizations.getDemo();
    return Boolean(demo?.accessToken && demo.accessToken === stored);
  } catch {
    return false;
  }
}

/** Đăng nhập tài khoản demo (chỉ xem). Trả về false nếu demo chưa sẵn sàng. */
export async function ensureDemoLogin(): Promise<boolean> {
  if (getToken()) {
    if (await refreshAuthWithToken()) return true;
  }
  if (demoLoginInflight) return demoLoginInflight;

  demoLoginInflight = (async () => {
    try {
      const result = await api.auth.login(DEMO_USERNAME, DEMO_PASSWORD);
      setToken(result.accessToken);
      return await refreshAuthWithToken();
    } catch {
      return false;
    } finally {
      demoLoginInflight = null;
    }
  })();

  return demoLoginInflight;
}

/**
 * Đăng nhập tài khoản demo (chỉ xem) rồi điều hướng tới trang chức năng thật.
 * Dùng cho nút "Xem demo" ở trang chủ — khách không cần tự nhập mật khẩu.
 */
export function useDemoLogin() {
  const router = useRouter();
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  const openDemo = useCallback(
    async (path: string) => {
      setLoadingPath(path);
      try {
        const ok = await ensureDemoLogin();
        if (!ok) {
          notify.error(null, UI.LANDING_DEMO_UNAVAILABLE);
          return;
        }
        router.push(path);
      } finally {
        setLoadingPath(null);
      }
    },
    [router],
  );

  return { openDemo, loadingPath };
}
