"use client";

import { useCallback, useEffect, useState } from "react";
import type { OrgBookContext } from "@/lib/settings/default-user-settings";
import { fetchOrgBookContext } from "@/lib/org/org-book-context";

/** Nạp năm lập / địa chỉ từ Organization (refetch mỗi lần mở bìa). */
export function useOrgBookContext() {
  const [context, setContext] = useState<OrgBookContext | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const next = await fetchOrgBookContext(true);
    setContext(next);
    return next;
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchOrgBookContext()
      .then((next) => {
        if (!cancelled) setContext(next);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { context, loading, reload };
}
