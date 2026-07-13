"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import type { UpcomingCeremonyItem } from "@/lib/api/modules/notifications";
import type { FamilyEvent } from "@/components/types/event-types";
import {
  WEEKDAY_LABELS,
  buildMonthCalendar,
  dateKey,
  formatLunarDayMonthFullLabel,
  formatLunarYearBadge,
  formatSolarDayMonthYearLabel,
  groupCeremoniesBySolarDate,
  groupEventsByDate,
  monthGridRange,
  sameCalendarDay,
} from "@/utils/events-calendar";

type Props = {
  events: FamilyEvent[];
  ceremonies?: UpcomingCeremonyItem[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  viewMonth?: Date;
};

export default function EventsMonthCalendar({
  events,
  ceremonies = [],
  selectedDate,
  onSelectDate,
  viewMonth: viewMonthProp,
}: Props) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const activeViewMonth = viewMonthProp ?? viewDate;
  const displayYear = activeViewMonth.getFullYear();
  const displayMonth = activeViewMonth.getMonth();

  useEffect(() => {
    if (!viewMonthProp) return;
    setViewDate(
      new Date(viewMonthProp.getFullYear(), viewMonthProp.getMonth(), 1),
    );
  }, [viewMonthProp]);

  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);

  const ceremoniesByDate = useMemo(() => {
    const { start, end } = monthGridRange(displayYear, displayMonth);
    return groupCeremoniesBySolarDate(ceremonies, start, end);
  }, [ceremonies, displayYear, displayMonth]);

  const cells = useMemo(
    () =>
      buildMonthCalendar(
        displayYear,
        displayMonth,
        eventsByDate,
        ceremoniesByDate,
        today,
      ),
    [displayYear, displayMonth, eventsByDate, ceremoniesByDate, today],
  );

  const shiftMonth = (delta: number) => {
    setViewDate(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + delta, 1),
    );
  };

  const monthBadge = formatLunarYearBadge(
    new Date(displayYear, displayMonth, 1),
  );
  const focusDate = selectedDate ?? today;
  const solarDayLabel = formatSolarDayMonthYearLabel(focusDate);
  const lunarDayLabel = formatLunarDayMonthFullLabel(focusDate);

  return (
    <div className="overflow-hidden rounded-xl border border-[#d4c3c1] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#d4c3c1] bg-[#FAF7F2] p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0">
            <h2 className="font-serif text-xl font-semibold text-[#321716] md:text-2xl">
              {solarDayLabel}
            </h2>
            <p className="mt-0.5 text-sm text-[#827472]">{lunarDayLabel}</p>
          </div>
          <span className="rounded-full bg-[#ffdcc5] px-3 py-1 text-sm font-semibold italic text-[#301400]">
            {monthBadge}
          </span>
        </div>
        <div className="flex gap-1">
          <NavButton label={UI.PAGE_PREV} onClick={() => shiftMonth(-1)}>
            <Icon
              path="chevronLeft"
              size={22}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
          </NavButton>
          <NavButton label={UI.PAGE_NEXT} onClick={() => shiftMonth(1)}>
            <Icon
              path="chevronRight"
              size={22}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
          </NavButton>
        </div>
      </div>

      <div className="p-3 md:p-4">
        <div className="mb-2 grid grid-cols-7 text-center">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="py-2 text-sm font-semibold text-[#827472]"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-[#d4c3c1] bg-[#d4c3c1]">
          {cells.map((cell) => {
            const hasEvents = cell.events.length > 0;
            const hasCeremonies = cell.ceremonies.length > 0;
            const isSelected =
              selectedDate != null && sameCalendarDay(cell.date, selectedDate);
            const primaryEvent = cell.events[0];
            const primaryCeremony = cell.ceremonies[0];

            return (
              <button
                key={dateKey(cell.date)}
                type="button"
                onClick={() => {
                  if (!cell.inMonth) return;
                  onSelectDate(cell.date);
                }}
                aria-pressed={isSelected}
                className={`relative min-h-16 p-1.5 text-left transition-all md:min-h-24 md:p-2 ${
                  cell.inMonth
                    ? "cursor-pointer bg-white hover:bg-[#FEF3C7]"
                    : "cursor-default bg-[#f6f3ee] text-[#827472] opacity-50"
                } ${cell.isToday && !isSelected ? "ring-2 ring-inset ring-[#944a00]/60" : ""} ${
                  isSelected
                    ? "z-[1] bg-[#FEF3C7] ring-2 ring-[#944a00] ring-offset-1"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span
                    className={`text-sm font-semibold ${
                      cell.isToday ? "font-bold text-[#944a00]" : "text-[#321716]"
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>
                  <span className="text-[0.65rem] font-semibold text-[#944a00]">
                    {cell.lunarDayLabel}
                  </span>
                </div>
                {primaryCeremony ? (
                  <div className="mt-1 truncate rounded border border-[#7f1d1d]/25 bg-[#7f1d1d]/10 p-0.5 text-[10px] font-semibold text-[#7f1d1d]">
                    {UI.EVENTS_CALENDAR_CEREMONY_MARK} {primaryCeremony.fullName}
                  </div>
                ) : null}
                {primaryEvent ? (
                  <div className="mt-1 truncate rounded border border-[#944a00]/20 bg-[#944a00]/10 p-0.5 text-[10px] font-semibold text-[#944a00]">
                    {primaryEvent.title}
                  </div>
                ) : null}
                {hasEvents || hasCeremonies ? (
                  <span className="absolute bottom-1 right-1 flex gap-0.5">
                    {hasCeremonies ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#7f1d1d]" />
                    ) : null}
                    {hasEvents ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#944a00]" />
                    ) : null}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="rounded-lg p-2 transition-colors hover:bg-[#f0ede9]"
    >
      {children}
    </button>
  );
}
