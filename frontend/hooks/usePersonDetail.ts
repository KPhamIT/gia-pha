"use client";

import { useCallback, useEffect } from "react";
import { usePersonDetailStore } from "@/store/personDetailStore";
import { UI } from "@/lib/constants/ui-strings";

export function usePersonDetail(personId: number | null) {
  const detail = usePersonDetailStore((s) =>
    personId != null ? (s.details[personId] ?? null) : null,
  );
  const status = usePersonDetailStore((s) => s.status);
  const reloadOne = usePersonDetailStore((s) => s.reloadOne);

  useEffect(() => {
    if (personId == null || detail != null) return;
    void reloadOne(personId);
  }, [personId, detail, reloadOne]);

  const loading = personId != null && detail == null && status !== "error";
  const error =
    status === "error" && personId != null && detail == null
      ? UI.ERR_FETCH_DETAIL
      : null;

  const reload = useCallback(() => {
    if (personId != null) void reloadOne(personId);
  }, [personId, reloadOne]);

  return { detail, loading, error, reload };
}
