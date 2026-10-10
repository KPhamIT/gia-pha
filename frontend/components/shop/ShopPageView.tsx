"use client";

import type { ReactNode } from "react";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import { UI } from "@/lib/constants/ui-strings";

/** Shell trang bán sách — cùng khung với trang văn khấn / bài viết. */
export default function ShopPageView({ children }: { children: ReactNode }) {
  return (
    <ResponsiveAppPageLayout
      title={UI.SHOP_BREADCRUMB}
      backHref="/"
      mobileTitleAsHeading={false}
      contentClassName="w-full pb-32 pt-0 md:pb-0 md:pt-0"
    >
      {children}
    </ResponsiveAppPageLayout>
  );
}
