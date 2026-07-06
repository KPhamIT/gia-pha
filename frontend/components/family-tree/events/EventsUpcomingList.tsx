"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import type { FamilyEvent } from "@/components/types/event-types";
import { formatShortMonthDay } from "@/utils/events-calendar";

type Props = {
  events: FamilyEvent[];
  highlightEventId?: number | null;
  onSelectEvent: (event: FamilyEvent) => void;
  onViewAll: () => void;
};

export default function EventsUpcomingList({
  events,
  highlightEventId,
  onSelectEvent,
  onViewAll,
}: Props) {
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
  const date = event.eventDate ? new Date(event.eventDate) : null;
  const dateParts = date ? formatShortMonthDay(date) : null;
  const subtitle =
    event.description?.trim().split("\n")[0] ??
    (event.type === "CONTRIBUTION"
      ? UI.EVENT_BADGE_CONTRIBUTION
      : UI.EVENT_BADGE_INFO);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full gap-4 rounded-lg p-3 text-left transition-colors hover:bg-white ${
        highlighted ? "bg-white ring-1 ring-[#944a00]/30" : ""
      } ${showDivider ? "border-b border-[#d4c3c1]/30 pb-4" : "pb-2"}`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl font-bold ${
          highlighted
            ? "bg-[#ffdcc5] text-[#301400]"
            : "bg-[#ebe8e3] text-[#504443]"
        }`}
      >
        <span className="text-xs font-semibold uppercase">
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
