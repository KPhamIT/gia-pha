"use client";

import type { ReactNode } from "react";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import { UI } from "@/lib/constants/ui-strings";

type BlogArticlePageViewProps = {
  children: ReactNode;
};

/** Shell trang chi tiết bài viết — đồng bộ với danh sách /bai-viet. */
export default function BlogArticlePageView({
  children,
}: BlogArticlePageViewProps) {
  return (
    <ResponsiveAppPageLayout
      title={UI.BLOG_LIST_TITLE}
      backHref="/bai-viet"
      contentClassName="w-full pb-32 pt-0 md:pb-0 md:pt-0"
    >
      {children}
    </ResponsiveAppPageLayout>
  );
}
