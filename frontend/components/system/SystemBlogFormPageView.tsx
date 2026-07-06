"use client";

import { useRouter } from "next/navigation";
import { AC } from "@/components/auth/account-theme";
import BlogPostAdminForm from "@/components/system/BlogPostAdminForm";
import SystemSubpageShell from "@/components/system/SystemSubpageShell";
import { useBlogAdmin } from "@/hooks/useBlogAdmin";
import { UI } from "@/lib/constants/ui-strings";
import type { BlogPostAdmin } from "@/lib/blog/types";

type Props = {
  initial?: BlogPostAdmin;
  loadError?: string | null;
};

export default function SystemBlogFormPageView({ initial, loadError }: Props) {
  const router = useRouter();
  const blog = useBlogAdmin();
  const isEdit = initial != null;

  if (loadError) {
    return (
      <SystemSubpageShell
        layoutTitle={UI.BLOG_ADMIN_EDIT}
        backHref="/system/blog"
        title={UI.BLOG_ADMIN_EDIT}
        subtitle={UI.BLOG_ADMIN_TAB}
      >
        <p className="rounded-lg bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]">
          {loadError}
        </p>
      </SystemSubpageShell>
    );
  }

  return (
    <SystemSubpageShell
      layoutTitle={isEdit ? UI.BLOG_ADMIN_EDIT : UI.BLOG_ADMIN_CREATE}
      backHref="/system/blog"
      title={isEdit ? UI.BLOG_ADMIN_EDIT : UI.BLOG_ADMIN_CREATE}
      subtitle={isEdit ? (initial?.title ?? UI.BLOG_ADMIN_TAB) : UI.BLOG_ADMIN_TAB}
    >
      <div className={`${AC.card} p-4 md:p-6`}>
        <BlogPostAdminForm
          variant="landing"
          initial={initial}
          onCancel={() => router.push("/system/blog")}
          onSubmit={async (data) => {
            if (isEdit && initial) {
              await blog.update(initial.id, data);
            } else {
              await blog.create(data);
            }
            router.push("/system/blog");
          }}
        />
      </div>
    </SystemSubpageShell>
  );
}
