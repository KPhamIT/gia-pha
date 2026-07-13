"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { UpcomingCeremonyItem } from "@/lib/api/modules/notifications";
import { useAuthStore } from "@/store/authStore";

const DEFAULT_LIMIT = 50;
const DEFAULT_MAX_DAYS = 366;

/** Giỗ sắp tới theo auth — dùng chung lịch + danh sách. */
export function useUpcomingCeremonies(options?: {
  limit?: number;
  maxDays?: number;
}) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const authLoaded = useAuthStore((s) => s.loaded);
  const [ceremonies, setCeremonies] = useState<UpcomingCeremonyItem[]>([]);
  const limit = options?.limit ?? DEFAULT_LIMIT;
  const maxDays = options?.maxDays ?? DEFAULT_MAX_DAYS;

  useEffect(() => {
    if (!authLoaded || !isLoggedIn) {
      setCeremonies([]);
      return;
    }
    let cancelled = false;
    api.notifications
      .upcoming({ maxDays, limit })
      .then((items) => {
        if (!cancelled) setCeremonies(items);
      })
      .catch(() => {
        if (!cancelled) setCeremonies([]);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoaded, isLoggedIn, limit, maxDays]);

  return { ceremonies, isLoggedIn: authLoaded && isLoggedIn };
}
