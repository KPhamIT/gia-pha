import type { Metadata } from "next";
import LandingScrollArea from "@/components/public/LandingScrollArea";
import LandingHeader from "@/components/public/landing/LandingHeader";
import LandingSiteFooter from "@/components/public/landing/LandingSiteFooter";
import ServicesBentoGrid from "@/components/public/services/ServicesBentoGrid";
import ServicesPageHero from "@/components/public/services/ServicesPageHero";
import ServicesTrustSection from "@/components/public/services/ServicesTrustSection";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { SITE } from "@/config/site";
import { SERVICES_PAGE_UI } from "@/lib/constants/ui-strings/services-page";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: SERVICES_PAGE_UI.META_TITLE,
  description: SERVICES_PAGE_UI.META_DESC,
  path: "/dich-vu",
  keywords: ["dịch vụ gia phả", "số hóa gia phả", "phả đồ", "dòng họ"],
});

export default function ServicesPage() {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#fcf9f4] text-[#1c1c19]">
      <SeoSchemas
        path="/dich-vu"
        title={SERVICES_PAGE_UI.META_TITLE}
        description={SERVICES_PAGE_UI.META_DESC}
      />
      <LandingHeader brandName={SITE.brandName} />
      <LandingScrollArea>
        <main className="flex min-h-full w-full flex-col">
          <div className="w-full flex-1 px-4 py-8 pb-16 md:px-12 md:py-12">
            <div className="mx-auto w-full max-w-[1280px]">
              <ServicesPageHero />
              <ServicesBentoGrid />
              <ServicesTrustSection />
            </div>
          </div>
          <div className="mt-auto w-full shrink-0">
            <LandingSiteFooter />
          </div>
        </main>
      </LandingScrollArea>
    </div>
  );
}
