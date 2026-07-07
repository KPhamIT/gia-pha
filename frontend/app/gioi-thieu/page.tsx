import type { Metadata } from "next";
import Link from "next/link";
import LandingScrollArea from "@/components/public/LandingScrollArea";
import LandingHeader from "@/components/public/landing/LandingHeader";
import LandingSiteFooter from "@/components/public/landing/LandingSiteFooter";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { SITE } from "@/config/site";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.ABOUT_PAGE_META_TITLE,
  description: UI.ABOUT_PAGE_META_DESC,
  path: "/gioi-thieu",
  keywords: [...UI.ABOUT_PAGE_KEYWORDS],
});

export default function AboutPage() {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#fcf9f4] text-[#1c1c19]">
      <SeoSchemas
        path="/gioi-thieu"
        title={UI.ABOUT_PAGE_META_TITLE}
        description={UI.ABOUT_PAGE_META_DESC}
      />
      <LandingHeader brandName={SITE.brandName} />
      <LandingScrollArea>
        <main>
          <section className="relative flex h-[716px] items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-top"
              style={{
                backgroundImage: "url('/images/about/hero.webp')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f4]/72 via-[#fcf9f4]/20 to-transparent" />
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
              <h1 className="font-serif text-4xl font-bold leading-tight text-[#321716] md:text-6xl">
                {UI.ABOUT_PAGE_HERO_TITLE}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg italic text-[#504443]">
                {UI.ABOUT_PAGE_HERO_QUOTE}
              </p>
              <div className="mt-12">
                <Link
                  href="/book"
                  className="rounded-xl bg-[#944a00] px-10 py-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  {UI.ABOUT_PAGE_HERO_CTA}
                </Link>
              </div>
            </div>
          </section>

          <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-4 py-24 md:grid-cols-2 md:px-6">
            <div className="space-y-8">
              <span className="inline-block rounded-full bg-[#fef3c7] px-4 py-1 text-xs uppercase tracking-widest text-[#944a00]">
                {UI.ABOUT_PAGE_STORY_BADGE}
              </span>
              <h2 className="font-serif text-4xl font-semibold text-[#321716]">
                {UI.ABOUT_PAGE_STORY_TITLE}
              </h2>
              {UI.ABOUT_PAGE_STORY_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph} className="text-[#504443]">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rotate-2 overflow-hidden rounded-2xl shadow-2xl">
                <img
                  className="h-full w-full object-cover"
                  src="/images/about/story-main.webp"
                  alt=""
                />
              </div>
            </div>
          </section>

          <section className="bg-[#f6f3ee] px-4 py-24 md:px-6">
            <div className="mx-auto w-full max-w-6xl">
              <div className="mb-16 text-center">
                <h2 className="font-serif text-4xl font-semibold text-[#321716]">
                  {UI.ABOUT_PAGE_VALUES_TITLE}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {UI.ABOUT_PAGE_VALUES.map((value) => (
                  <article
                    key={value.title}
                    className="rounded-2xl border border-[#d4c3c1] bg-white p-10 shadow-sm"
                  >
                    <h3 className="font-serif text-2xl font-semibold text-[#321716]">
                      {value.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-[#504443]">
                      {value.desc}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-6xl px-4 py-24 md:px-6">
            <div className="rounded-[2rem] bg-[#4a2c2a] p-10 text-white md:p-16">
              <h2 className="font-serif text-4xl font-semibold">
                {UI.ABOUT_PAGE_VISION_TITLE}
              </h2>
              <p className="mt-6 max-w-3xl text-[#f3f0eb]">
                {UI.ABOUT_PAGE_VISION_DESC}
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {UI.ABOUT_PAGE_VISION_BULLETS.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="px-4 py-24 text-center md:px-6">
            <h2 className="font-serif text-4xl font-semibold text-[#321716]">
              {UI.ABOUT_PAGE_CTA_TITLE}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[#504443]">
              {UI.ABOUT_PAGE_CTA_DESC}
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 md:flex-row">
              <Link
                href="/tao-dong-ho"
                className="rounded-xl bg-[#321716] px-10 py-4 font-semibold text-white transition hover:bg-[#4a2c2a]"
              >
                {UI.LANDING_START_NEW_ORG_CTA}
              </Link>
              <Link
                href="/lien-he"
                className="rounded-xl border-2 border-[#321716] px-10 py-4 font-semibold text-[#321716] transition hover:bg-[#321716] hover:text-white"
              >
                {UI.LANDING_SERVICES_CTA}
              </Link>
            </div>
          </section>

          <LandingSiteFooter />
        </main>
      </LandingScrollArea>
    </div>
  );
}
