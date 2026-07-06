"use client";

import type { ReactNode } from "react";
import GuidePageHero from "@/components/guide/GuidePageHero";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  children: ReactNode;
};

export default function GuidePageView({ children }: Props) {
  return (
    <ResponsiveAppPageLayout title={UI.GUIDE_PAGE_TITLE} backHref="/">
      <GuidePageHero />
      {children}
    </ResponsiveAppPageLayout>
  );
}
