"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ensureDemoLogin,
  shouldAttemptDemoLogin,
} from "@/hooks/useDemoLogin";
import { useAuthStore } from "@/store/authStore";

/** Trang đăng nhập thật — không tự gắn session demo. */
function skipDemoAutoLogin(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/login" || pathname.startsWith("/login/");
}

/**
 * Gọi auth/me khi mount; khách chưa login thì tự đăng nhập tài khoản demo
 * (trừ trang /login). Dùng cho header / menu trên mọi trang kể cả landing.
 */
export function useAuthBootstrap() {
  const pathname = usePathname();
  const loaded = useAuthStore((s) => s.loaded);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isDemo = useAuthStore((s) => s.isDemo);
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await refresh();
      if (cancelled) return;
      if (skipDemoAutoLogin(pathname)) return;
      if (useAuthStore.getState().isLoggedIn) return;
      if (!(await shouldAttemptDemoLogin())) return;
      if (cancelled) return;
      await ensureDemoLogin();
    })();

    return () => {
      cancelled = true;
    };
  }, [refresh, pathname]);

  return { loaded, isLoggedIn, isDemo };
}
