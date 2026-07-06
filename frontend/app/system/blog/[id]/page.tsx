"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SystemBlogFormPageView from "@/components/system/SystemBlogFormPageView";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import { useSystemAccess } from "@/hooks/useSystemAccess";
import { useBlogAdmin } from "@/hooks/useBlogAdmin";
import type { BlogPostAdmin } from "@/lib/blog/types";
import { UI } from "@/lib/constants/ui-strings";
import { getErrorMessage } from "@/utils/errors";

export default function SystemBlogEditPage() {
  const params = useParams<{ id: string }>();
  const { ready } = useSystemAccess();
  const { loadFull } = useBlogAdmin();
  const [item, setItem] = useState<BlogPostAdmin | null>(null);
  const [loadingItem, setLoadingItem] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      setLoadError(UI.ERR_FETCH_DATA);
      setLoadingItem(false);
      return;
    }
    loadFull(id)
      .then((data) => {
        setItem(data);
        setLoadError(null);
      })
      .catch((err) => {
        setLoadError(getErrorMessage(err, UI.ERR_FETCH_DATA));
      })
      .finally(() => {
        setLoadingItem(false);
      });
  }, [loadFull, params.id]);

  if (!ready || loadingItem) {
    return <AuthPageLoading message={UI.SYSTEM_LOADING} />;
  }

  if (!item) {
    return <SystemBlogFormPageView loadError={loadError ?? UI.ERR_FETCH_DATA} />;
  }

  return <SystemBlogFormPageView initial={item} />;
}
