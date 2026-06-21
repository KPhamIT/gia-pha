'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AuthUser } from '@/components/types/family-tree-types';
import { api } from '@/lib/api';
import type { CreateUserInput, UpdateUserInput } from '@/lib/api/modules/users';
import { notify } from '@/lib/notify';
import { UI } from '@/lib/constants/ui-strings';
import { getErrorMessage } from '@/utils/errors';

export function useUsersAdmin() {
  const [items, setItems] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    () =>
      api.users
        .list()
        .then((data) => {
          setItems(data);
          setError(null);
        })
        .catch((err) => {
          setError(getErrorMessage(err, UI.ERR_FETCH_DATA));
        })
        .finally(() => {
          setLoading(false);
        }),
    [],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (data: CreateUserInput) => {
      try {
        await api.users.create(data);
        await reload();
        notify.success(UI.TOAST_USER_CREATED);
      } catch (err) {
        notify.error(err, UI.ERR_SAVE_USER);
        throw err;
      }
    },
    [reload],
  );

  const update = useCallback(
    async (id: number, data: UpdateUserInput) => {
      try {
        await api.users.update(id, data);
        await reload();
        notify.success(UI.TOAST_USER_UPDATED);
      } catch (err) {
        notify.error(err, UI.ERR_SAVE_USER);
        throw err;
      }
    },
    [reload],
  );

  const remove = useCallback(
    async (id: number) => {
      try {
        await api.users.remove(id);
        await reload();
        notify.success(UI.TOAST_USER_DELETED);
      } catch (err) {
        notify.error(err, UI.ERR_DELETE);
        throw err;
      }
    },
    [reload],
  );

  return { items, loading, error, reload, create, update, remove };
}
