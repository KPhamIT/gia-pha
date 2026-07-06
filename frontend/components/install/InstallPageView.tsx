"use client";

import InstallPageContent from "@/components/install/InstallPageContent";
import InstallPageHero from "@/components/install/InstallPageHero";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import { UI } from "@/lib/constants/ui-strings";

export default function InstallPageView() {
  return (
    <ResponsiveAppPageLayout title={UI.INSTALL_PAGE_TITLE} backHref="/">
      <InstallPageHero />
      <InstallPageContent />
    </ResponsiveAppPageLayout>
  );
}
