import type { Metadata } from "next";
import LandingScrollArea from "@/components/public/LandingScrollArea";
import LandingBentoSection from "@/components/public/landing/LandingBentoSection";
import LandingBottomSection from "@/components/public/landing/LandingBottomSection";
import LandingHeader from "@/components/public/landing/LandingHeader";
import LandingHeroSection from "@/components/public/landing/LandingHeroSection";
import LandingStartSection from "@/components/public/landing/LandingStartSection";
import LandingStatsSection from "@/components/public/landing/LandingStatsSection";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { SITE } from "@/config/site";
import { createMetadata } from "@/lib/seo";
import { UI } from "@/lib/constants/ui-strings";

export const metadata: Metadata = createMetadata({
  title: SITE.title,
  titleAbsolute: true,
  description: SITE.description,
  path: "/",
  keywords: [...SITE.keywords],
  pageType: "home",
});

const REGISTER_START = {
  title: UI.LANDING_START_NEW_ORG_TITLE,
  steps: UI.LANDING_START_NEW_ORG_STEPS,
  href: "/tao-dong-ho",
  cta: UI.LANDING_START_NEW_ORG_CTA,
};

export default function LandingPage() {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#fcf9f4] text-[#1c1c19]">
      <SeoSchemas
        path="/"
        title={SITE.title}
        description={SITE.description}
        pageType="home"
      />
      <LandingHeader brandName={SITE.brandName} />

      <LandingScrollArea>
        <main>
          <LandingHeroSection />
          <LandingStatsSection />
          <LandingStartSection
            registerTitle={REGISTER_START.title}
            registerSteps={REGISTER_START.steps}
            registerHref={REGISTER_START.href}
            registerCta={REGISTER_START.cta}
          />
          <LandingBentoSection />
          <LandingBottomSection />
        </main>
      </LandingScrollArea>
    </div>
  );
}
