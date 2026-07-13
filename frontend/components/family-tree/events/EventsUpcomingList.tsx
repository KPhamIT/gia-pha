"use client";

import Link from "next/link";
import Icon from "@/components/icons/Icon";
import type { UpcomingCeremonyItem } from "@/lib/api/modules/notifications";
import { UI } from "@/lib/constants/ui-strings";
import type { FamilyEvent } from "@/components/types/event-types";
import {
  formatLunarDayMonthLabel,
  formatShortMonthDay,
  parseEventDate,
  solarDateFromDaysUntil,
} from "@/utils/events-calendar";

const LIST_CEREMONY_LIMIT = 3;

type Props = {
  events: FamilyEvent[];
  ceremonies: UpcomingCeremonyItem[];
  isLoggedIn: boolean;
  highlightEventId?: number | null;
  onSelectEvent: (event: FamilyEvent) => void;
  onViewAll: () => void;
};

export default function EventsUpcomingList({
  events,
  ceremonies,
  isLoggedIn,
  highlightEventId,
  onSelectEvent,
  onViewAll,
}: Props) {
  const listCeremonies = ceremonies.slice(0, LIST_CEREMONY_LIMIT);

  return (
    <div className="rounded-xl border border-[#d4c3c1] bg-[#f6f3ee] p-5 md:p-6">
      <h3 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold text-[#321716]">
        <Icon
          path="calendar"
          size={22}
          fill="none"
          stroke="#944a00"
          strokeWidth={2}
          pointer={false}
        />
        {UI.EVENTS_UPCOMING_TITLE}
      </h3>

      {events.length === 0 ? (
        <p className="text-sm text-[#504443]">{UI.EVENTS_EMPTY}</p>
      ) : (
        <div className="space-y-1">
          {events.map((event, index) => (
            <UpcomingRow
              key={event.id}
              event={event}
              highlighted={event.id === highlightEventId}
              showDivider={index < events.length - 1}
              onSelect={() => onSelectEvent(event)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onViewAll}
        className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-semibold text-[#944a00] hover:underline"
      >
        {UI.EVENTS_VIEW_ALL}
        <Icon
          path="chevronRight"
          size={16}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
        />
      </button>

      {isLoggedIn ? (
        <UpcomingCeremoniesSection ceremonies={listCeremonies} />
      ) : null}
    </div>
  );
}

function UpcomingCeremoniesSection({
  ceremonies,
}: {
  ceremonies: UpcomingCeremonyItem[];
}) {
  return (
    <div className="mt-6 border-t border-[#d4c3c1]/60 pt-5">
      <h4 className="mb-3 font-serif text-base font-semibold text-[#321716]">
        {UI.EVENTS_UPCOMING_CEREMONIES_TITLE}
      </h4>
      {ceremonies.length === 0 ? (
        <p className="text-sm text-[#504443]">
          {UI.EVENTS_UPCOMING_CEREMONIES_EMPTY}
        </p>
      ) : (
        <div className="space-y-1">
          {ceremonies.map((item, index) => (
            <CeremonyRow
              key={item.personId}
              item={item}
              showDivider={index < ceremonies.length - 1}
            />
          ))}
        </div>
      )}
      <Link
        href="/ceremonies/upcoming"
        className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-semibold text-[#944a00] hover:underline"
      >
        {UI.EVENTS_UPCOMING_CEREMONIES_VIEW_ALL}
        <Icon
          path="chevronRight"
          size={16}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
        />
      </Link>
    </div>
  );
}

function UpcomingRow({
  event,
  highlighted,
  showDivider,
  onSelect,
}: {
  event: FamilyEvent;
  highlighted: boolean;
  showDivider: boolean;
  onSelect: () => void;
}) {
  const date = parseEventDate(event.eventDate);
  const dateParts = date ? formatShortMonthDay(date) : null;
  const lunarLabel = date ? formatLunarDayMonthLabel(date) : null;
  const baseSubtitle =
    event.description?.trim().split("\n")[0] ??
    (event.type === "CONTRIBUTION"
      ? UI.EVENT_BADGE_CONTRIBUTION
      : UI.EVENT_BADGE_INFO);
  const subtitle = [lunarLabel, baseSubtitle].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full gap-4 rounded-lg p-3 text-left transition-colors hover:bg-white ${
        highlighted ? "bg-white ring-1 ring-[#944a00]/30" : ""
      } ${showDivider ? "border-b border-[#d4c3c1]/30 pb-4" : "pb-2"}`}
    >
      <div
        className={`flex h-12 min-w-12 shrink-0 flex-col items-center justify-center rounded-xl px-1.5 font-bold ${
          highlighted
            ? "bg-[#ffdcc5] text-[#301400]"
            : "bg-[#ebe8e3] text-[#504443]"
        }`}
      >
        <span className="text-[10px] font-semibold uppercase leading-tight">
          {dateParts?.month ?? "—"}
        </span>
        <span className="text-lg leading-none">{dateParts?.day ?? "—"}</span>
      </div>
      <div className="min-w-0">
        <h4 className="truncate text-sm font-semibold text-[#321716]">
          {event.title}
        </h4>
        <p className="mt-0.5 line-clamp-2 text-xs text-[#504443]">{subtitle}</p>
      </div>
    </button>
  );
}

function CeremonyRow({
  item,
  showDivider,
}: {
  item: UpcomingCeremonyItem;
  showDivider: boolean;
}) {
  const meta = UI.EVENTS_CEREMONY_META(
    item.branch ?? null,
    item.generation ?? null,
  );
  const solarParts = formatShortMonthDay(
    solarDateFromDaysUntil(item.daysUntil),
  );

  return (
    <Link
      href={`/ceremonies/upcoming?personId=${item.personId}`}
      className={`flex w-full gap-4 rounded-lg p-3 text-left transition-colors hover:bg-white ${
        showDivider ? "border-b border-[#d4c3c1]/30 pb-4" : "pb-2"
      }`}
    >
      <div className="flex h-12 min-w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#ebe8e3] px-1.5 font-bold text-[#504443]">
        <span className="text-[10px] font-semibold uppercase leading-tight">
          {solarParts.month}
        </span>
        <span className="text-lg leading-none">{solarParts.day}</span>
      </div>
      <div className="min-w-0">
        <h4 className="truncate text-sm font-semibold text-[#321716]">
          {item.fullName}
        </h4>
        <p className="mt-0.5 text-xs text-[#504443]">
          {meta ? `${meta} · ` : ""}
          {item.lunarDateLabel}
        </p>
        <p className="mt-0.5 text-xs font-medium text-[#944a00]">
          {UI.CEREMONIES_DAYS_UNTIL(item.daysUntil)}
        </p>
      </div>
    </Link>
  );
}
