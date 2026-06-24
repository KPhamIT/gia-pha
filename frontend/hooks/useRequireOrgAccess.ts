"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasOrgAccess } from "@/lib/org/org-access";
import { useAuthStore } from "@/store/authStore";

/** Chuyển sang /join nếu khách chưa có org token và chưa đăng nhập. */
export function useRequireOrgAccess(options: { skip?: boolean } = {}) {
  const skip = options.skip ?? false;
  const router = useRouter();
  const authLoaded = useAuthStore((s) => s.loaded);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (skip) {
      setReady(true);
      return;
    }
    if (!authLoaded) return;
    if (hasOrgAccess(isLoggedIn)) {
      setReady(true);
      return;
    }
    router.replace("/join");
  }, [skip, authLoaded, isLoggedIn, router]);

  return { ready: skip ? true : ready && authLoaded, authLoaded };
}
