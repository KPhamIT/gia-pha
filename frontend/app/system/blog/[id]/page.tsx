"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BookPageShell from "@/components/ui/BookPageShell";
import BlogPostAdminForm from "@/components/system/BlogPostAdminForm";
import { useSystemAccess } from "@/hooks/useSystemAccess";
import { useBlogAdmin } from "@/hooks/useBlogAdmin";
import type { BlogPostAdmin } from "@/lib/blog/types";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { getErrorMessage } from "@/utils/errors";

export default function SystemBlogEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { ready } = useSystemAccess();
  const { loadFull, update } = useBlogAdmin();
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
    return (
      <div
        className={`flex min-h-dvh items-center justify-center text-sm ${BT.mutedOnDark}`}
      >
        {UI.LOADING}
      </div>
    );
  }

  if (!item) {
    return (
      <BookPageShell title={UI.BLOG_ADMIN_EDIT} subtitle={UI.BLOG_ADMIN_TAB}>
        <p className={BT.errorBg}>{loadError ?? UI.ERR_FETCH_DATA}</p>
      </BookPageShell>
    );
  }

  return (
    <BookPageShell title={UI.BLOG_ADMIN_EDIT} subtitle={item.title}>
      <div className={`${BT.card} p-4`}>
        <BlogPostAdminForm
          initial={item}
          onCancel={() => router.push("/system/blog")}
          onSubmit={async (data) => {
            await update(item.id, data);
            router.push("/system/blog");
          }}
        />
      </div>
    </BookPageShell>
  );
}
