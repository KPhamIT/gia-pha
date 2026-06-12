'use client';

import { useCallback, useEffect } from 'react';
import { usePersonDetailStore } from '@/store/personDetailStore';
import { UI } from '@/lib/constants/ui-strings';

export function usePersonDetail(personId: number | null) {
  const { details, status, loadAll, reloadOne } = usePersonDetailStore();

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const detail = personId != null ? (details[personId] ?? null) : null;
  const loading = (status === 'idle' || status === 'loading') && detail == null;
  const error = status === 'error' ? UI.ERR_FETCH_DETAIL : null;

  const reload = useCallback(() => {
    if (personId != null) void reloadOne(personId);
  }, [personId, reloadOne]);

  return { detail, loading, error, reload };
}
