"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasOrgAccess } from "@/lib/org/org-access";
import { useAuthStore } from "@/store/authStore";
import {
  ensureDemoLogin,
  shouldAttemptDemoLogin,
} from "@/hooks/useDemoLogin";

/**
 * Đảm bảo có quyền xem org: đã login, tự login demo (khi phù hợp), hoặc org token.
 * Nếu không có cách nào → /join.
 */
export function useRequireOrgAccess(options: { skip?: boolean } = {}) {
  const skip = options.skip ?? false;
  const router = useRouter();
  const authLoaded = useAuthStore((s) => s.loaded);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const refresh = useAuthStore((s) => s.refresh);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (skip) {
      setReady(true);
      return;
    }
    if (!authLoaded) return;
    if (isLoggedIn) {
      setReady(true);
      return;
    }

    let cancelled = false;

    void (async () => {
      const tryDemo = await shouldAttemptDemoLogin();
      if (cancelled) return;

      if (tryDemo) {
        const ok = await ensureDemoLogin();
        if (cancelled) return;
        if (ok) {
          setReady(true);
          return;
        }
      }

      if (hasOrgAccess(false)) {
        setReady(true);
        return;
      }

      router.replace("/join");
    })();

    return () => {
      cancelled = true;
    };
  }, [skip, authLoaded, isLoggedIn, router]);

  return { ready: skip ? true : ready && authLoaded, authLoaded };
}
