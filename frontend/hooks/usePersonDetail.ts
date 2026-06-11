'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PersonDetail } from '@/components/types/family-tree-types';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/utils/errors';
import { UI } from '@/lib/constants/ui-strings';

export function usePersonDetail(personId: number | null) {
  const [detail, setDetail] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.person.getDetail(id);
      setDetail(data);
    } catch (err) {
      setError(getErrorMessage(err, UI.ERR_FETCH_DETAIL));
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (personId == null) {
      setDetail(null);
      setError(null);
      return;
    }
    void load(personId);
  }, [personId, load]);

  return { detail, loading, error, reload: () => personId != null && load(personId) };
}
