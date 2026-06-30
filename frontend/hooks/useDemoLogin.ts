"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth/session";
import { saveLandingScrollFromDocument } from "@/lib/landing-scroll";
import { useAuthStore } from "@/store/authStore";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";

const DEMO_USERNAME = "demo";
const DEMO_PASSWORD = "123";

/**
 * Đăng nhập tài khoản demo (chỉ xem) rồi điều hướng tới trang chức năng thật.
 * Dùng cho nút "Xem demo" ở trang chủ — khách không cần tự nhập mật khẩu.
 */
export function useDemoLogin() {
  const router = useRouter();
  const refreshAuth = useAuthStore((s) => s.refresh);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  const openDemo = useCallback(
    async (path: string) => {
      setLoadingPath(path);
      try {
        const result = await api.auth.login(DEMO_USERNAME, DEMO_PASSWORD);
        setToken(result.accessToken);
        await refreshAuth();
        saveLandingScrollFromDocument();
        router.push(path);
      } catch {
        notify.error(null, UI.LANDING_DEMO_UNAVAILABLE);
      } finally {
        setLoadingPath(null);
      }
    },
    [refreshAuth, router],
  );

  return { openDemo, loadingPath };
}
