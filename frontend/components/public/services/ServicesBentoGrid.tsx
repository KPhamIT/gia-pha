import Link from "next/link";
import ServicesIcon from "@/components/public/services/ServicesIcon";
import { SERVICES_PAGE_UI } from "@/lib/constants/ui-strings/services-page";

const cardShadow =
  "shadow-[0_4px_20px_-2px_rgba(69,26,3,0.04)] transition-all duration-300 hover:-translate-y-1";

export default function ServicesBentoGrid() {
  return (
    <div className="grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
      <DigitizeCard />
      <CloudCard />
      <TreeCard />
      <EventsCard />
    </div>
  );
}

function DigitizeCard() {
  return (
    <div
      className={`group col-span-4 flex flex-col justify-between rounded-xl border border-[#d4c3c1]/30 bg-white p-8 md:col-span-7 ${cardShadow} hover:border-[#944a00]`}
    >
      <div>
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#ffdcc5] transition-transform group-hover:scale-110">
          <ServicesIcon name="book" size={28} className="text-[#663100]" />
        </div>
        <h2 className="mb-4 font-serif text-2xl font-semibold text-[#321716]">
          {SERVICES_PAGE_UI.DIGITIZE_TITLE}
        </h2>
        <p className="mb-6 text-base leading-relaxed text-[#504443]">
          {SERVICES_PAGE_UI.DIGITIZE_DESC}
        </p>
      </div>
      <Link
        href="/lien-he"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#944a00] transition-transform hover:translate-x-2"
      >
        {SERVICES_PAGE_UI.DIGITIZE_CTA}
        <ServicesIcon name="arrow" size={18} />
      </Link>
    </div>
  );
}

function CloudCard() {
  return (
    <div
      className={`col-span-4 flex flex-col justify-between rounded-xl bg-[#4a2c2a] p-8 text-white md:col-span-5 ${cardShadow} hover:opacity-95`}
    >
      <div>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#bd928f]/20">
          <ServicesIcon name="cloud" size={24} className="text-[#ffb783]" />
        </div>
        <h2 className="mb-4 font-serif text-2xl font-semibold">
          {SERVICES_PAGE_UI.CLOUD_TITLE}
        </h2>
        <p className="text-base leading-relaxed text-white/80">
          {SERVICES_PAGE_UI.CLOUD_DESC}
        </p>
      </div>
      <div className="mt-8 border-t border-[#bd928f]/30 pt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-white/70">
          {SERVICES_PAGE_UI.CLOUD_FOOTER}
        </p>
      </div>
    </div>
  );
}

function TreeCard() {
  return (
    <div
      className={`col-span-4 flex gap-6 rounded-xl border border-[#d4c3c1]/30 bg-[#FAF7F2] p-8 md:col-span-6 ${cardShadow} hover:shadow-lg`}
    >
      <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-full border border-[#944a00]/20 bg-[#f0ede9] sm:flex">
        <ServicesIcon name="tree" size={36} className="text-[#944a00]" />
      </div>
      <div>
        <h2 className="mb-2 font-serif text-2xl font-semibold text-[#321716]">
          {SERVICES_PAGE_UI.TREE_TITLE}
        </h2>
        <p className="mb-4 text-base text-[#504443]">
          {SERVICES_PAGE_UI.TREE_DESC}
        </p>
        <Link
          href="/lien-he"
          className="inline-flex rounded-lg bg-[#944a00] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#713700]"
        >
          {SERVICES_PAGE_UI.TREE_CTA}
        </Link>
      </div>
    </div>
  );
}

function EventsCard() {
  return (
    <div
      className={`col-span-4 flex flex-col items-center gap-6 rounded-xl border border-[#d4c3c1]/30 bg-[#ebe8e3] p-8 md:col-span-6 md:flex-row ${cardShadow}`}
    >
      <div className="order-2 flex-1 md:order-1">
        <h2 className="mb-2 text-center font-serif text-2xl font-semibold text-[#321716] md:text-left">
          {SERVICES_PAGE_UI.EVENTS_TITLE}
        </h2>
        <p className="text-center text-base text-[#504443] md:text-left">
          {SERVICES_PAGE_UI.EVENTS_DESC}
        </p>
      </div>
      <div className="order-1 h-32 w-32 overflow-hidden rounded-xl border-2 border-white shadow-md md:order-2 md:h-40 md:w-40">
        <img
          src="/images/about/story-main.jpg"
          alt={SERVICES_PAGE_UI.EVENTS_IMAGE_ALT}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
