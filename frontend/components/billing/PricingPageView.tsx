"use client";

import type { ReactNode } from "react";
import PricingPageHero from "@/components/billing/PricingPageHero";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  children: ReactNode;
};

export default function PricingPageView({ children }: Props) {
  return (
    <ResponsiveAppPageLayout title={UI.PRICING_PAGE_TITLE} backHref="/">
      <PricingPageHero />
      {children}
    </ResponsiveAppPageLayout>
  );
}
