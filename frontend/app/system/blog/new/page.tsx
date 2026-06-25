"use client";

import { useRouter } from "next/navigation";
import BookPageShell from "@/components/ui/BookPageShell";
import BlogPostAdminForm from "@/components/system/BlogPostAdminForm";
import { useSystemAccess } from "@/hooks/useSystemAccess";
import { useBlogAdmin } from "@/hooks/useBlogAdmin";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export default function SystemBlogCreatePage() {
  const router = useRouter();
  const { ready } = useSystemAccess();
  const blog = useBlogAdmin();

  if (!ready) {
    return (
      <div
        className={`flex min-h-dvh items-center justify-center text-sm ${BT.mutedOnDark}`}
      >
        {UI.LOADING}
      </div>
    );
  }

  return (
    <BookPageShell title={UI.BLOG_ADMIN_CREATE} subtitle={UI.BLOG_ADMIN_TAB}>
      <div className={`${BT.card} p-4`}>
        <BlogPostAdminForm
          onCancel={() => router.push("/system/blog")}
          onSubmit={async (data) => {
            await blog.create(data);
            router.push("/system/blog");
          }}
        />
      </div>
    </BookPageShell>
  );
}
