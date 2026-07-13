"use client";

import type { ReactNode } from "react";
import Icon from "@/components/icons/Icon";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { UI } from "@/lib/constants/ui-strings";
import type { FamilyEvent } from "@/components/types/event-types";
import { formatVnd } from "./event-format";
import { formatEventDateWithLunar } from "@/utils/events-calendar";
import { ET } from "./event-theme";

type Props = {
  event: FamilyEvent;
  canEdit: boolean;
  variant?: "book" | "landing";
  onEdit: () => void;
  onDelete: () => void;
  onViewContribution: () => void;
  onViewDonation: () => void;
};

export default function EventCard({
  event,
  canEdit,
  variant = "book",
  onEdit,
  onDelete,
  onViewContribution,
  onViewDonation,
}: Props) {
  const date = formatEventDateWithLunar(event.eventDate, event.isLunar);
  const isContribution = event.type === "CONTRIBUTION";

  if (variant === "landing") {
    return (
      <article className="group flex flex-col overflow-hidden rounded-xl border border-amber-100/50 bg-white p-4 shadow-[0_2px_12px_rgba(69,26,3,0.06)] transition-shadow hover:shadow-md md:p-5">
        <EventCardHeader
          event={event}
          date={date}
          isContribution={isContribution}
          canEdit={canEdit}
          onEdit={onEdit}
          onDelete={onDelete}
          landing
        />
        <EventCardDescription event={event} landing />
        <EventCardFooter
          event={event}
          isContribution={isContribution}
          onViewContribution={onViewContribution}
          onViewDonation={onViewDonation}
          landing
        />
      </article>
    );
  }

  return (
    <article
      className={`${ET.card} flex flex-col p-4 transition-shadow md:p-5 md:hover:shadow-xl`}
    >
      <EventCardHeader
        event={event}
        date={date}
        isContribution={isContribution}
        canEdit={canEdit}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <EventCardDescription event={event} />
      <EventCardFooter
        event={event}
        isContribution={isContribution}
        onViewContribution={onViewContribution}
        onViewDonation={onViewDonation}
      />
    </article>
  );
}

function EventCardHeader({
  event,
  date,
  isContribution,
  canEdit,
  onEdit,
  onDelete,
  landing = false,
}: {
  event: FamilyEvent;
  date: string | null;
  isContribution: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  landing?: boolean;
}) {
  const badgeContribution = landing
    ? "bg-[#fef3c7] text-[#944a00]"
    : "bg-amber-700 text-amber-50";
  const badgeInfo = landing
    ? "bg-[#f0ede9] text-[#504443]"
    : "bg-amber-100 text-amber-800";
  const badgeMale = landing
    ? "border-[#d4c3c1] bg-[#f6f3ee] text-[#504443]"
    : "border-amber-300 bg-amber-50 text-amber-800";

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              isContribution ? badgeContribution : badgeInfo
            }`}
          >
            {isContribution
              ? UI.EVENT_BADGE_CONTRIBUTION
              : UI.EVENT_BADGE_INFO}
          </span>
          {isContribution && event.maleOnly ? (
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badgeMale}`}
            >
              {UI.EVENT_MALE_ONLY_BADGE}
            </span>
          ) : null}
          {date ? (
            <span
              className={
                landing ? "text-xs text-[#827472]" : "text-xs text-neutral-400"
              }
            >
              {date}
            </span>
          ) : null}
        </div>
        <h2
          className={
            landing
              ? "mt-1.5 font-serif text-xl font-semibold leading-tight text-[#321716]"
              : "mt-1.5 text-base font-semibold text-neutral-900 md:text-lg"
          }
        >
          {event.title}
        </h2>
      </div>
      {canEdit ? (
        landing ? (
          <div className="flex shrink-0 gap-1">
            <IconActionButton label={UI.BTN_EDIT} onClick={onEdit}>
              <Icon
                path="edit"
                size={20}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                pointer={false}
              />
            </IconActionButton>
            <IconActionButton
              label={UI.DELETE_PERSON}
              onClick={onDelete}
              className="text-[#ba1a1a] hover:bg-[#ffdad6]/40"
            >
              <Icon
                path="trash"
                size={20}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                pointer={false}
              />
            </IconActionButton>
          </div>
        ) : (
          <div className="flex shrink-0 gap-1">
            <IconRoundButton
              icon="edit"
              variant="outline"
              iconSize={14}
              label={UI.BTN_EDIT}
              onClick={onEdit}
            />
            <IconRoundButton
              icon="trash"
              variant="danger"
              iconSize={14}
              label={UI.DELETE_PERSON}
              onClick={onDelete}
            />
          </div>
        )
      ) : null}
    </div>
  );
}

function EventCardDescription({
  event,
  landing = false,
}: {
  event: FamilyEvent;
  landing?: boolean;
}) {
  if (!event.description) return null;
  return (
    <p
      className={
        landing
          ? "mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-[#504443] md:line-clamp-4"
          : "mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-neutral-600 md:line-clamp-4"
      }
    >
      {event.description}
    </p>
  );
}

function EventCardFooter({
  event,
  isContribution,
  onViewContribution,
  onViewDonation,
  landing = false,
}: {
  event: FamilyEvent;
  isContribution: boolean;
  onViewContribution: () => void;
  onViewDonation: () => void;
  landing?: boolean;
}) {
  const borderClass = landing
    ? "border-[#d4c3c1]/20"
    : "border-amber-200/60";
  const labelClass = landing ? "text-[#504443]" : "text-neutral-500";
  const moneyClass = landing ? "text-[#944a00]" : ET.money;

  return (
    <div className={`mt-auto border-t ${borderClass} pt-3 md:pt-4`}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className={labelClass}>
          {isContribution
            ? UI.EVENT_PAID_COUNT_SHORT(event.paidCount)
            : UI.EVENT_DONATION_TOTAL}
        </span>
        <span className={`font-bold tabular-nums ${moneyClass}`}>
          {formatVnd(event.grandTotal)}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        {isContribution ? (
          landing ? (
            <button
              type="button"
              onClick={onViewContribution}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#944a00] px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform active:scale-95"
            >
              {UI.EVENT_VIEW_CONTRIBUTION}
            </button>
          ) : (
            <IconRoundButton
              icon="list"
              variant="primary"
              label={UI.EVENT_VIEW_CONTRIBUTION}
              compact={false}
              className="flex-1"
              onClick={onViewContribution}
            />
          )
        ) : null}
        {landing ? (
          <button
            type="button"
            onClick={onViewDonation}
            className={`flex items-center justify-center gap-2 rounded-xl border border-[#d4c3c1] bg-white px-4 py-2 text-sm font-semibold text-[#321716] transition-colors hover:bg-[#f0ede9] ${
              isContribution ? "flex-1" : "w-full"
            }`}
          >
            {UI.EVENT_VIEW_DONATION}
          </button>
        ) : (
          <IconRoundButton
            icon="userPlus"
            variant="outline"
            label={UI.EVENT_VIEW_DONATION}
            compact={false}
            className={isContribution ? "flex-1" : "w-full"}
            onClick={onViewDonation}
          />
        )}
      </div>
    </div>
  );
}

function IconActionButton({
  label,
  onClick,
  children,
  className = "text-[#504443] hover:bg-[#f0ede9]",
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
