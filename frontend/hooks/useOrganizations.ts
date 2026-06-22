"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { OrganizationWithAccess } from "@/lib/api/modules/organizations";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import { getErrorMessage } from "@/utils/errors";

export function useOrganizations() {
  const [items, setItems] = useState<OrganizationWithAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    () =>
      api.organizations
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
    async (name: string) => {
      try {
        await api.organizations.create(name);
        await reload();
        notify.success(UI.TOAST_ORG_CREATED);
      } catch (err) {
        notify.error(err, UI.ERR_SAVE);
        throw err;
      }
    },
    [reload],
  );

  const update = useCallback(
    async (id: number, name: string) => {
      try {
        await api.organizations.update(id, name);
        await reload();
        notify.success(UI.TOAST_ORG_UPDATED);
      } catch (err) {
        notify.error(err, UI.ERR_SAVE);
        throw err;
      }
    },
    [reload],
  );

  const remove = useCallback(
    async (id: number) => {
      try {
        await api.organizations.remove(id);
        await reload();
        notify.success(UI.TOAST_ORG_DELETED);
      } catch (err) {
        notify.error(err, UI.ERR_DELETE);
        throw err;
      }
    },
    [reload],
  );

  return { items, loading, error, reload, create, update, remove };
}
