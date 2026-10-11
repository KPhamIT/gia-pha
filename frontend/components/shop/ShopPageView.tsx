"use client";

import type { ReactNode } from "react";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import { UI } from "@/lib/constants/ui-strings";

/** Shell trang công khai (sách in, công cụ…) — cùng khung với trang văn khấn / bài viết. */
export default function ShopPageView({
  children,
  title = UI.SHOP_BREADCRUMB,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <ResponsiveAppPageLayout
      title={title}
      backHref="/"
      mobileTitleAsHeading={false}
      contentClassName="w-full pb-32 pt-0 md:pb-0 md:pt-0"
    >
      {children}
    </ResponsiveAppPageLayout>
  );
}
