"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import type { FamilyEvent } from "@/components/types/event-types";
import { formatEventDateWithLunar } from "@/utils/events-calendar";

type Props = {
  event: FamilyEvent;
  canEdit: boolean;
  onViewContribution: () => void;
  onViewDonation: () => void;
  onEdit: () => void;
};

export default function EventBentoCard({
  event,
  canEdit,
  onViewContribution,
  onViewDonation,
  onEdit,
}: Props) {
  const isContribution = event.type === "CONTRIBUTION";
  const dateLabel = formatEventDateWithLunar(event.eventDate);
  const locationHint = event.description?.trim().split("\n")[0] ?? null;

  return (
    <article className="group rounded-xl border border-[#d4c3c1] bg-[#FAF7F2] p-5 transition-shadow hover:shadow-md md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${
            isContribution
              ? "bg-[#592500] text-[#ee7f38]"
              : "bg-[#4a2c2a] text-[#bd928f]"
          }`}
        >
          {isContribution ? UI.EVENT_BADGE_CONTRIBUTION : UI.EVENT_BADGE_INFO}
        </span>
        <Icon
          path="calendar"
          size={22}
          fill="none"
          stroke="#944a00"
          strokeWidth={1.75}
          pointer={false}
          className="transition-transform group-hover:rotate-12"
        />
      </div>

      <h3 className="font-serif text-xl font-semibold text-[#321716] md:text-2xl">
        {event.title}
      </h3>

      <div className="mt-4 space-y-2 text-sm text-[#504443]">
        <MetaRow
          icon="calendar"
          label={dateLabel ?? UI.EVENTS_NO_DATE}
        />
        {locationHint ? (
          <MetaRow icon="book" label={locationHint} />
        ) : null}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={isContribution ? onViewContribution : onViewDonation}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 ${
            isContribution ? "bg-[#944a00]" : "bg-[#321716]"
          }`}
        >
          {isContribution
            ? UI.EVENTS_BENTO_CTA_CONTRIBUTION
            : UI.EVENTS_BENTO_CTA_DONATION}
        </button>
        {canEdit ? (
          <button
            type="button"
            onClick={onEdit}
            aria-label={UI.BTN_EDIT}
            className="rounded-lg border border-[#827472] px-3 transition-colors hover:bg-[#f0ede9]"
          >
            <Icon
              path="edit"
              size={20}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={onViewDonation}
            aria-label={UI.EVENT_VIEW_DONATION}
            className="rounded-lg border border-[#827472] px-3 transition-colors hover:bg-[#f0ede9]"
          >
            <Icon
              path="list"
              size={20}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
          </button>
        )}
      </div>
    </article>
  );
}

function MetaRow({
  icon,
  label,
}: {
  icon: "calendar" | "book";
  label: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon
        path={icon}
        size={16}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        pointer={false}
        className="mt-0.5 shrink-0 text-[#827472]"
      />
      <span>{label}</span>
    </div>
  );
}
