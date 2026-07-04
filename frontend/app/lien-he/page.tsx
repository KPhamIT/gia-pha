import type { Metadata } from "next";
import LandingScrollArea from "@/components/public/LandingScrollArea";
import ContactFaq from "@/components/public/contact/ContactFaq";
import ContactForm from "@/components/public/contact/ContactForm";
import ContactInfoCards from "@/components/public/contact/ContactInfoCards";
import ContactMapSection from "@/components/public/contact/ContactMapSection";
import LandingHeader from "@/components/public/landing/LandingHeader";
import LandingSiteFooter from "@/components/public/landing/LandingSiteFooter";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { SITE } from "@/config/site";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.CONTACT_PAGE_TITLE,
  description: UI.CONTACT_PAGE_HERO_DESC,
  path: "/lien-he",
  keywords: ["liên hệ", "hỗ trợ", "gia phả", "Cội Nguồn"],
  pageType: "contact",
});

export default function ContactPage() {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#fcf9f4] text-[#1c1c19]">
      <SeoSchemas
        path="/lien-he"
        title={UI.CONTACT_PAGE_TITLE}
        description={UI.CONTACT_PAGE_HERO_DESC}
        pageType="contact"
      />
      <LandingHeader brandName={SITE.brandName} />
      <LandingScrollArea>
        <main>
          <section className="relative overflow-hidden py-16 md:py-20">
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
              <h1 className="font-serif text-4xl font-bold leading-tight text-[#321716] md:text-5xl">
                {UI.CONTACT_PAGE_HERO_TITLE}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-[#504443]">
                {UI.CONTACT_PAGE_HERO_DESC}
              </p>
            </div>
          </section>

          <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <ContactInfoCards />
              </div>
              <div className="lg:col-span-7">
                <ContactForm />
              </div>
            </div>
          </section>

          <ContactMapSection />
          <ContactFaq />
          <LandingSiteFooter />
        </main>
      </LandingScrollArea>
    </div>
  );
}
