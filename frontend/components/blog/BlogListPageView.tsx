"use client";

import type { ReactNode } from "react";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import { UI } from "@/lib/constants/ui-strings";

type BlogListPageViewProps = {
  children: ReactNode;
};

export default function BlogListPageView({ children }: BlogListPageViewProps) {
  return (
    <ResponsiveAppPageLayout
      title={UI.BLOG_LIST_TITLE}
      backHref="/"
      contentClassName="w-full pb-32 pt-20 md:pb-0 md:pt-0"
    >
      {children}
    </ResponsiveAppPageLayout>
  );
}
