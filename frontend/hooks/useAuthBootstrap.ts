"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

/** Gọi auth/me một lần khi mount — dùng cho page độc lập ngoài /family-tree. */
export function useAuthBootstrap() {
  const loaded = useAuthStore((s) => s.loaded);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isDemo = useAuthStore((s) => s.isDemo);
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { loaded, isLoggedIn, isDemo };
}
