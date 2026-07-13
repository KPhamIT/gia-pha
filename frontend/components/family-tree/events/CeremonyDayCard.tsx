"use client";

import Link from "next/link";
import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import type { CalendarCeremonyMark } from "@/utils/events-calendar";

type Props = {
  ceremony: CalendarCeremonyMark;
};

/** Card giỗ trong phần nổi bật theo ngày đã chọn. */
export default function CeremonyDayCard({ ceremony }: Props) {
  const meta = UI.EVENTS_CEREMONY_META(
    ceremony.branch ?? null,
    ceremony.generation ?? null,
  );

  return (
    <Link
      href={`/ceremonies/upcoming?personId=${ceremony.personId}`}
      className="group block rounded-xl border border-[#d4c3c1] bg-[#FAF7F2] p-5 transition-shadow hover:shadow-md md:p-6"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="rounded-full bg-[#7f1d1d]/10 px-3 py-1 text-[10px] font-semibold uppercase text-[#7f1d1d]">
          {UI.EVENTS_CALENDAR_CEREMONY_MARK}
        </span>
        <Icon
          path="calendar"
          size={22}
          fill="none"
          stroke="#7f1d1d"
          strokeWidth={1.75}
          pointer={false}
          className="transition-transform group-hover:rotate-12"
        />
      </div>
      <h3 className="font-serif text-xl font-semibold text-[#321716] md:text-2xl">
        {ceremony.fullName}
      </h3>
      <p className="mt-3 text-sm text-[#504443]">{ceremony.lunarDateLabel}</p>
      {meta ? <p className="mt-1 text-xs text-[#827472]">{meta}</p> : null}
    </Link>
  );
}
