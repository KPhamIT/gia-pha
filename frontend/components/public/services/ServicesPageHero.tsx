import { SERVICES_PAGE_UI } from "@/lib/constants/ui-strings/services-page";

const cardShadow =
  "shadow-[0_4px_20px_-2px_rgba(69,26,3,0.04)] transition-all duration-300 hover:-translate-y-1";

export default function ServicesPageHero() {
  return (
    <section className="mb-12">
      <div
        className={`group relative mb-8 h-64 overflow-hidden rounded-xl md:h-80 ${cardShadow}`}
      >
        <div className="absolute inset-0 z-10 bg-[#321716]/40 transition-colors duration-500 group-hover:bg-[#321716]/30" />
        <img
          src="/images/about/hero.webp"
          alt={SERVICES_PAGE_UI.HERO_IMAGE_ALT}
          className="h-full w-full scale-105 object-cover transition-transform duration-700 group-hover:scale-100"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
          <span className="mb-4 w-fit rounded-xl bg-[#fc8f34] px-3 py-1 text-sm font-semibold text-[#663100]">
            {SERVICES_PAGE_UI.HERO_BADGE}
          </span>
          <h1 className="mb-2 font-serif text-2xl font-semibold text-white md:text-[32px]">
            {SERVICES_PAGE_UI.HERO_TITLE}
          </h1>
          <p className="max-w-xl text-base text-white/90">
            {SERVICES_PAGE_UI.HERO_SUBTITLE}
          </p>
        </div>
      </div>
    </section>
  );
}
