"use client";

import type { ReactNode } from "react";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import { UI } from "@/lib/constants/ui-strings";

type VanKhanPageViewProps = {
  children: ReactNode;
  backHref?: string;
};

/** Shell trang văn khấn — cùng khung với trang bài viết. */
export default function VanKhanPageView({
  children,
  backHref = "/",
}: VanKhanPageViewProps) {
  return (
    <ResponsiveAppPageLayout
      title={UI.VAN_KHAN_LIST_TITLE}
      backHref={backHref}
      mobileTitleAsHeading={false}
      contentClassName="w-full pb-32 pt-0 md:pb-0 md:pt-0"
    >
      {children}
    </ResponsiveAppPageLayout>
  );
}
