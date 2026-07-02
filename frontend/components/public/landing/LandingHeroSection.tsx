import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";

export default function LandingHeroSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/landing/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c19]/90 via-[#1c1c19]/40 to-transparent" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 text-white md:px-6">
        <div className="max-w-2xl">
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">
            {UI.LANDING_HERO_TITLE_LINE1} <br />
            {UI.LANDING_HERO_TITLE_LINE2}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#e5e2dd]">{UI.LANDING_HERO_SUBTITLE}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/book" className="rounded-lg bg-[#fc8f34] px-7 py-3 text-sm font-semibold text-[#663100] transition hover:bg-[#e67e22]">
              {UI.LANDING_CTA_BOOK}
            </Link>
            <Link href="/huong-dan" className="rounded-lg border border-[#e5e2dd] px-7 py-3 text-sm font-semibold text-[#f3f0eb] transition hover:bg-white/10">
              {UI.LANDING_CTA_GUIDE}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
