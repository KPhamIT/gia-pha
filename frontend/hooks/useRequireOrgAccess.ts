"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasOrgAccess } from "@/lib/org/org-access";
import { useAuthStore } from "@/store/authStore";

/** Chuyển sang /join nếu khách chưa có org token và chưa đăng nhập. */
export function useRequireOrgAccess() {
  const router = useRouter();
  const authLoaded = useAuthStore((s) => s.loaded);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!authLoaded) return;
    if (hasOrgAccess(isLoggedIn)) {
      setReady(true);
      return;
    }
    router.replace("/join");
  }, [authLoaded, isLoggedIn, router]);

  return { ready: ready && authLoaded, authLoaded };
}
