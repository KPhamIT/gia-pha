"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { BlogPostAdminSummary, BlogPostInput } from "@/lib/blog/types";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import { getErrorMessage } from "@/utils/errors";

export function useBlogAdmin() {
  const [items, setItems] = useState<BlogPostAdminSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    () =>
      api.blog
        .listAdmin()
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
    async (body: BlogPostInput) => {
      try {
        await api.blog.create(body);
        notify.success(UI.TOAST_BLOG_CREATED);
      } catch (err) {
        notify.error(err, UI.ERR_SAVE);
        throw err;
      }
    },
    [],
  );

  const update = useCallback(async (id: number, body: Partial<BlogPostInput>) => {
    try {
      await api.blog.update(id, body);
      notify.success(UI.TOAST_BLOG_UPDATED);
    } catch (err) {
      notify.error(err, UI.ERR_SAVE);
      throw err;
    }
  }, []);

  const remove = useCallback(
    async (id: number) => {
      try {
        await api.blog.remove(id);
        await reload();
        notify.success(UI.TOAST_BLOG_DELETED);
      } catch (err) {
        notify.error(err, UI.ERR_DELETE);
        throw err;
      }
    },
    [reload],
  );

  const loadFull = useCallback((id: number) => api.blog.getAdmin(id), []);

  return { items, loading, error, reload, create, update, remove, loadFull };
}
