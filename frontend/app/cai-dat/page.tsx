import type { Metadata } from "next";
import InstallPageView from "@/components/install/InstallPageView";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.INSTALL_PAGE_TITLE,
  description: UI.INSTALL_PAGE_HERO_SUBTITLE,
  path: "/cai-dat",
  keywords: ["cài đặt", "PWA", "màn hình chính", "gia phả", "Cội Nguồn"],
  pageType: "guide",
});

export default function InstallAppPage() {
  return (
    <>
      <SeoSchemas
        path="/cai-dat"
        title={UI.INSTALL_PAGE_TITLE}
        description={UI.INSTALL_PAGE_HERO_SUBTITLE}
        pageType="guide"
      />
      <InstallPageView />
    </>
  );
}
