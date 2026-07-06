"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { UI } from "@/lib/constants/ui-strings";
import type { FamilyEvent } from "@/components/types/event-types";
import {
  formatSelectedDayLabel,
  getEventsInMonth,
  getEventsOnDate,
  getUpcomingEvents,
  parseEventDate,
  sameCalendarDay,
} from "@/utils/events-calendar";
import EventsPageHero from "./EventsPageHero";
import EventsMonthCalendar from "./EventsMonthCalendar";
import EventBentoCard from "./EventBentoCard";
import EventsUpcomingList from "./EventsUpcomingList";
import EventsDonationPromo from "./EventsDonationPromo";
import EventsLocationCard from "./EventsLocationCard";
import EventCard from "./EventCard";

type Props = {
  events: FamilyEvent[];
  loading: boolean;
  error: string | null;
  canEdit: boolean;
  onReload: () => void;
  onCreate: () => void;
  onEdit: (event: FamilyEvent) => void;
  onDelete: (event: FamilyEvent) => void;
  onViewContribution: (event: FamilyEvent) => void;
  onViewDonation: (event: FamilyEvent) => void;
};

export default function EventsLandingBoard({
  events,
  loading,
  error,
  canEdit,
  onReload,
  onCreate,
  onEdit,
  onDelete,
  onViewContribution,
  onViewDonation,
}: Props) {
  const allEventsRef = useRef<HTMLDivElement>(null);
  const featuredSectionRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [focusEventId, setFocusEventId] = useState<number | null>(null);

  const today = useMemo(() => new Date(), []);
  const viewMonth = selectedDate ?? today;

  const monthEvents = useMemo(
    () =>
      getEventsInMonth(
        events,
        viewMonth.getFullYear(),
        viewMonth.getMonth(),
      ),
    [events, viewMonth],
  );

  const featuredEvents = useMemo(() => {
    if (selectedDate) return getEventsOnDate(events, selectedDate);
    return monthEvents.slice(0, 2);
  }, [events, monthEvents, selectedDate]);

  const upcomingEvents = useMemo(
    () => getUpcomingEvents(events, 3, today),
    [events, today],
  );

  const donationTarget =
    events.find((event) => event.type === "CONTRIBUTION") ?? events[0] ?? null;

  const scrollToFeatured = useCallback(() => {
    requestAnimationFrame(() => {
      featuredSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }, []);

  const handleSelectDate = useCallback(
    (date: Date) => {
      setSelectedDate((current) => {
        const next = current && sameCalendarDay(current, date) ? null : date;
        return next;
      });
      scrollToFeatured();
    },
    [scrollToFeatured],
  );

  const scrollToAllEvents = () => {
    setShowAllEvents(true);
    requestAnimationFrame(() => {
      allEventsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const focusEvent = (event: FamilyEvent) => {
    setFocusEventId(event.id);
    const parsed = parseEventDate(event.eventDate);
    if (parsed) {
      setSelectedDate(parsed);
      scrollToFeatured();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size={36} label={UI.EVENTS_LOADING} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-[#504443]">{error}</p>
        <button
          type="button"
          onClick={onReload}
          className="rounded-xl border border-[#d4c3c1] px-4 py-2 text-sm font-semibold text-[#321716]"
        >
          {UI.RETRY}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] pb-6">
      <EventsPageHero canEdit={canEdit} onCreate={onCreate} />

      {!canEdit ? (
        <p className="mb-6 rounded-xl border border-[#d4c3c1] bg-[#f6f3ee] px-4 py-3 text-sm text-[#504443]">
          {UI.EVENTS_READONLY_HINT}
        </p>
      ) : null}

      {events.length === 0 ? (
        <EmptyState canEdit={canEdit} onCreate={onCreate} />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <EventsMonthCalendar
              events={events}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />

            <section ref={featuredSectionRef} className="space-y-4 scroll-mt-24">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-xl font-semibold text-[#321716] md:text-2xl">
                  {selectedDate
                    ? UI.EVENTS_DAY_SELECTED(formatSelectedDayLabel(selectedDate))
                    : UI.EVENTS_MONTH_HIGHLIGHT}
                </h2>
                {selectedDate ? (
                  <button
                    type="button"
                    onClick={() => setSelectedDate(null)}
                    className="text-sm font-semibold text-[#944a00] hover:underline"
                  >
                    {UI.EVENTS_CLEAR_DAY_FILTER}
                  </button>
                ) : null}
              </div>

              {featuredEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {featuredEvents.map((event) => (
                    <EventBentoCard
                      key={event.id}
                      event={event}
                      canEdit={canEdit}
                      onEdit={() => onEdit(event)}
                      onViewContribution={() => onViewContribution(event)}
                      onViewDonation={() => onViewDonation(event)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-[#d4c3c1] bg-white p-6 text-center shadow-sm">
                  <p className="text-sm text-[#504443]">
                    {selectedDate ? UI.EVENTS_DAY_EMPTY : UI.EVENTS_EMPTY}
                  </p>
                  {selectedDate && canEdit ? (
                    <button
                      type="button"
                      onClick={onCreate}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      {UI.EVENTS_EMPTY_CTA}
                    </button>
                  ) : null}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <EventsUpcomingList
              events={upcomingEvents}
              highlightEventId={focusEventId}
              onSelectEvent={focusEvent}
              onViewAll={scrollToAllEvents}
            />
            <EventsDonationPromo
              disabled={!donationTarget}
              onDonate={() => {
                if (donationTarget) onViewDonation(donationTarget);
              }}
            />
            <EventsLocationCard />
          </aside>
        </div>
      )}

      {showAllEvents && events.length > 0 ? (
        <section ref={allEventsRef} className="mt-10">
          <h2 className="mb-4 font-serif text-2xl font-semibold text-[#321716]">
            {UI.EVENTS_PAGE_TITLE}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                canEdit={canEdit}
                variant="landing"
                onEdit={() => onEdit(event)}
                onDelete={() => onDelete(event)}
                onViewContribution={() => onViewContribution(event)}
                onViewDonation={() => onViewDonation(event)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EmptyState({
  canEdit,
  onCreate,
}: {
  canEdit: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#d4c3c1] bg-white p-10 text-center shadow-sm">
      <p className="text-sm text-[#504443]">{UI.EVENTS_EMPTY}</p>
      {canEdit ? (
        <button
          type="button"
          onClick={onCreate}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white"
        >
          {UI.EVENTS_EMPTY_CTA}
        </button>
      ) : null}
    </div>
  );
}
