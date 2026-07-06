import Image from "next/image";
import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";

export default function LandingHeroSection() {
  return (
    <>
      {/* Mobile — design stitch: ảnh cao, chữ căn giữa phía dưới */}
      <section className="relative flex min-h-[85vh] flex-col justify-end overflow-hidden px-4 pb-12 pt-8 md:hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/landing/hero-mobile.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fcf9f4]/0 via-[#fcf9f4]/20 to-[#fcf9f4]/95" />
        </div>
        <div className="relative z-10 space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-serif text-[28px] font-semibold leading-tight text-[#321716]">
              {UI.LANDING_HERO_TITLE_LINE1}
              <br />
              {UI.LANDING_HERO_TITLE_LINE2}
            </h1>
            <p className="mx-auto max-w-[280px] text-base text-[#504443]">
              {UI.LANDING_HERO_SUBTITLE}
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/book"
              className="rounded-full bg-gradient-to-b from-[#fc8f34] to-[#944a00] px-8 py-4 text-sm font-semibold text-white shadow-lg transition active:scale-95"
            >
              {UI.LANDING_CTA_BOOK}
            </Link>
            <Link
              href="/cai-dat"
              className="rounded-full border border-[#321716] bg-white px-8 py-4 text-sm font-semibold text-[#321716] transition active:scale-95"
            >
              {UI.LANDING_CTA_INSTALL}
            </Link>
            <Link
              href="/huong-dan"
              className="rounded-full border border-[#d4c3c1] bg-[#f6f3ee] px-8 py-4 text-sm font-semibold text-[#504443] transition active:scale-95"
            >
              {UI.LANDING_CTA_GUIDE}
            </Link>
          </div>
        </div>
      </section>

      {/* Desktop — layout ngang, ảnh hero.webp */}
      <section className="relative hidden min-h-[80vh] items-center overflow-hidden bg-[#1c1c19] md:flex">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/landing/hero.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c19]/65 via-[#1c1c19]/22 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 text-white">
          <div className="max-w-2xl">
            <h1 className="mt-4 font-serif text-6xl font-bold leading-tight">
              {UI.LANDING_HERO_TITLE_LINE1} <br />
              {UI.LANDING_HERO_TITLE_LINE2}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#e5e2dd]">
              {UI.LANDING_HERO_SUBTITLE}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="rounded-lg bg-[#fc8f34] px-7 py-3 text-sm font-semibold text-[#663100] transition hover:bg-[#e67e22]"
              >
                {UI.LANDING_CTA_BOOK}
              </Link>
              <Link
                href="/cai-dat"
                className="rounded-lg border border-[#e5e2dd] px-7 py-3 text-sm font-semibold text-[#f3f0eb] transition hover:bg-white/10"
              >
                {UI.LANDING_CTA_INSTALL}
              </Link>
              <Link
                href="/huong-dan"
                className="rounded-lg border border-[#e5e2dd]/60 px-7 py-3 text-sm font-semibold text-[#e5e2dd] transition hover:bg-white/10"
              >
                {UI.LANDING_CTA_GUIDE}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
