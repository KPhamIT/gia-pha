"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import {
  formatLandingUpdateTime,
  getLandingLunarInfo,
} from "@/utils/landing-lunar";

const DEMO_DEATH_DAYS = 12;

export default function LandingTodayCarousel() {
  const lunar = useMemo(() => getLandingLunarInfo(), []);
  const updatedAt = useMemo(() => formatLandingUpdateTime(), []);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: true }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  return (
    <section className="overflow-hidden bg-[#faf7f2] px-4 py-6 md:hidden">
      <div className="relative rounded-xl border border-[#d4c3c1] bg-[#f6f3ee] p-4 shadow-sm">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            <div className="min-w-0 shrink-0 grow-0 basis-full space-y-4 px-1">
              <LunarSlide lunar={lunar} />
            </div>
            <div className="min-w-0 shrink-0 grow-0 basis-full space-y-4 px-1">
              <EventsSlide updatedAt={updatedAt} />
            </div>
            <div className="min-w-0 shrink-0 grow-0 basis-full space-y-4 px-1">
              <InfoSlide />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-1.5">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              type="button"
              aria-label={`Slide ${index + 1}`}
              onClick={() => scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? "w-4 bg-[#321716]"
                  : "w-1.5 bg-[#d4c3c1]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function LunarSlide({
  lunar,
}: {
  lunar: ReturnType<typeof getLandingLunarInfo>;
}) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-[#d4c3c1] pb-3">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-[#944a00]">
            {UI.LANDING_TODAY_LUNAR_LABEL}
          </span>
          <span className="font-serif text-2xl font-semibold leading-tight text-[#321716]">
            {lunar.dayLabel} Tháng {lunar.monthLabel}
          </span>
          <span className="text-xs text-[#504443]">{lunar.yearLabel}</span>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-[#321716]">
            <SunIcon />
            <span className="text-sm font-bold">{lunar.solarTermLabel}</span>
          </div>
          {lunar.isAuspiciousHour ? (
            <div className="mt-1 inline-block rounded-full bg-[#fc8f34] px-2 py-0.5 text-[10px] font-bold text-[#663100]">
              {UI.LANDING_TODAY_AUSPICIOUS_BADGE}
            </div>
          ) : null}
        </div>
      </div>
      <div className="pt-2 text-center">
        <p className="font-serif text-sm italic leading-relaxed text-[#321716]">
          &ldquo;{UI.LANDING_TODAY_PROVERB}&rdquo;
        </p>
        <div className="mx-auto mt-2 h-px w-8 bg-[#d4c3c1]" />
      </div>
    </>
  );
}

function EventsSlide({ updatedAt }: { updatedAt: string }) {
  return (
    <>
      <div className="mb-2 flex items-center gap-2">
        <BellIcon />
        <span className="text-sm font-bold text-[#321716]">
          {UI.LANDING_TODAY_EVENTS_TITLE}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <EventCard
          icon="calendar"
          label={UI.LANDING_TODAY_DEATH_LABEL}
          value={UI.LANDING_TODAY_DEATH_COUNTDOWN(DEMO_DEATH_DAYS)}
          subtitle={UI.LANDING_TODAY_DEMO_DEATH_NAME}
        />
        <EventCard
          icon="cake"
          label={UI.LANDING_TODAY_BIRTHDAY_LABEL}
          value={UI.LANDING_TODAY_BIRTHDAY_TODAY}
          subtitle={UI.LANDING_TODAY_DEMO_BIRTHDAY_NAME}
        />
      </div>
      <p className="text-center text-[11px] text-[#504443]/60">
        {UI.LANDING_TODAY_UPDATED_AT(updatedAt)}
      </p>
      <p className="text-center text-[10px] text-[#504443]/70">
        {UI.LANDING_TODAY_DEMO_NOTE}
      </p>
    </>
  );
}

function InfoSlide() {
  const stat = UI.LANDING_STATS_ITEMS[1];

  return (
    <>
      <div className="mb-2 flex items-center gap-2">
        <InfoIcon />
        <span className="text-sm font-bold text-[#321716]">
          {UI.LANDING_TODAY_INFO_TITLE}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-[#d4c3c1]/50 bg-white/40 p-4 text-center">
        <span className="text-xs text-[#504443]">{UI.LANDING_TODAY_INFO_LABEL}</span>
        <span className="font-serif text-5xl font-bold leading-tight text-[#321716]">
          {stat.value}
        </span>
        <span className="mt-1 text-xs text-[#504443]">{stat.label}</span>
        <Link
          href="/family-tree"
          className="mt-2 flex items-center gap-1 text-xs font-bold text-[#944a00]"
        >
          {UI.LANDING_TODAY_INFO_CTA}
          <Icon path="chevronRight" size={14} pointer={false} />
        </Link>
      </div>
    </>
  );
}

function EventCard({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: "calendar" | "cake";
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-lg border border-[#d4c3c1]/50 bg-white/50 p-3">
      <div className="mb-1 flex items-center gap-2">
        {icon === "calendar" ? <CalendarIcon /> : <CakeIcon />}
        <span className="text-xs font-bold text-[#321716]">{label}</span>
      </div>
      <p className="text-base font-bold text-[#944a00]">{value}</p>
      <p className="truncate text-[10px] text-[#504443]">{subtitle}</p>
    </div>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden className="text-[#944a00]">
      <path
        fill="currentColor"
        d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9.24-8.16l1.79-1.8-1.41-1.41-1.8 1.79 1.42 1.42zM20 13h3v-2h-3v2zM4 19.24l1.79 1.8 1.41-1.41-1.8-1.79L4 19.24zM12 6a6 6 0 1 0 .001 12.001A6 6 0 0 0 12 6z"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden className="text-[#944a00]">
      <path
        fill="currentColor"
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5-6.71V3a2 2 0 1 0-4 0v1.29A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2z"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden className="text-[#321716]">
      <path
        fill="currentColor"
        d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"
      />
    </svg>
  );
}

function CakeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden className="text-[#321716]">
      <path
        fill="currentColor"
        d="M12 6a3 3 0 0 0 3-3 2.99 2.99 0 0 0-2.82 2H12a3 3 0 0 0-3 3c0 1.31.84 2.42 2 2.83V19H7v2h10v-2h-4v-8.17A3.001 3.001 0 0 0 12 6z"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden className="text-[#944a00]">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
      />
    </svg>
  );
}
