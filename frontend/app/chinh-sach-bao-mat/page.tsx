import type { Metadata } from "next";
import LandingScrollArea from "@/components/public/LandingScrollArea";
import LandingHeader from "@/components/public/landing/LandingHeader";
import LandingSiteFooter from "@/components/public/landing/LandingSiteFooter";
import { PrivacyPageContent } from "@/components/public/privacy/PrivacyPageContent";
import PrivacyPageHero from "@/components/public/privacy/PrivacyPageHero";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { SITE } from "@/config/site";
import { PRIVACY_DOCUMENT } from "@/lib/constants/ui-strings/public";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: PRIVACY_DOCUMENT.title,
  description: PRIVACY_DOCUMENT.subtitle,
  path: "/chinh-sach-bao-mat",
});

export default function PrivacyPage() {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#fcf9f4] text-[#1c1c19]">
      <SeoSchemas
        path="/chinh-sach-bao-mat"
        title={PRIVACY_DOCUMENT.title}
        description={PRIVACY_DOCUMENT.subtitle}
      />
      <LandingHeader brandName={SITE.brandName} />
      <LandingScrollArea>
        <main className="flex min-h-full w-full flex-col">
          <div className="w-full flex-1 px-4 py-12 md:px-10 md:py-16 lg:px-16">
            <div className="mx-auto w-full max-w-4xl">
              <PrivacyPageHero />
              <PrivacyPageContent />
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
