'use client';

import { useState } from 'react';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { useEvents } from '@/hooks/useEvents';
import type { Person, Relationship } from '@/components/types/family-tree-types';
import type { CreateEventInput, FamilyEvent } from '@/components/types/event-types';
import EventFormSheet from './EventFormSheet';
import EventContributionView from './EventContributionView';
import EventDonationsView from './EventDonationsView';
import { formatVnd } from './event-format';

type Props = {
  persons: Person[];
  relationships: Relationship[];
  onClose: () => void;
};

function formatDate(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('vi-VN');
}

export default function EventsManager({ persons, relationships, onClose }: Props) {
  const { events, loading, error, saving, createEvent, updateEvent, deleteEvent, patchEvent } = useEvents();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FamilyEvent | null>(null);
  const [contributionEvent, setContributionEvent] = useState<FamilyEvent | null>(null);
  const [donationEvent, setDonationEvent] = useState<FamilyEvent | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (event: FamilyEvent) => {
    setEditing(event);
    setFormOpen(true);
  };

  const handleSubmit = async (input: CreateEventInput) => {
    if (editing) await updateEvent(editing.id, input);
    else await createEvent(input);
    setFormOpen(false);
    setEditing(null);
  };

  const handleDelete = async (event: FamilyEvent) => {
    if (!window.confirm(UI.EVENT_DELETE_CONFIRM)) return;
    await deleteEvent(event.id);
  };

  const addButton = (
    <button
      type="button"
      onClick={openCreate}
      className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white active:bg-blue-700"
      aria-label={UI.EVENT_ADD}
    >
      <Icon path="plus" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
    </button>
  );

  return (
    <>
      <FullScreenSheet title={UI.EVENTS_TITLE} onClose={onClose} headerRight={addButton} tone="book">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size={36} />
          </div>
        ) : error ? (
          <p className="px-4 py-12 text-center text-sm text-rose-300">{error}</p>
        ) : events.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-amber-100/70">{UI.EVENTS_EMPTY}</p>
        ) : (
          <div className="space-y-3 p-4">
            {events.map((event) => {
              const date = formatDate(event.eventDate);
              const isContribution = event.type === 'CONTRIBUTION';
              return (
                <article key={event.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            isContribution ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isContribution ? UI.EVENT_BADGE_CONTRIBUTION : UI.EVENT_BADGE_INFO}
                        </span>
                        {date ? <span className="text-xs text-slate-400">{date}</span> : null}
                      </div>
                      <h2 className="mt-1 truncate text-base font-semibold text-slate-900">{event.title}</h2>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(event)}
                        className="grid h-8 w-8 place-items-center rounded-full text-slate-500 active:bg-slate-100"
                        aria-label={UI.EVENT_EDIT}
                      >
                        <Icon path="edit" size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(event)}
                        className="grid h-8 w-8 place-items-center rounded-full text-rose-500 active:bg-rose-50"
                        aria-label={UI.DELETE_PERSON}
                      >
                        <Icon path="trash" size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
                      </button>
                    </div>
                  </div>

                  {event.description ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{event.description}</p>
                  ) : null}

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        {isContribution ? UI.EVENT_PAID_COUNT_SHORT(event.paidCount) : UI.EVENT_DONATION_TOTAL}
                      </span>
                      <span className="font-semibold text-blue-600">{formatVnd(event.grandTotal)}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {isContribution ? (
                        <button
                          type="button"
                          onClick={() => setContributionEvent(event)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-50 py-2.5 text-sm font-semibold text-blue-700 active:bg-blue-100"
                        >
                          <Icon path="list" size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
                          {UI.EVENT_VIEW_CONTRIBUTION}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setDonationEvent(event)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-50 py-2.5 text-sm font-semibold text-amber-700 active:bg-amber-100"
                      >
                        <Icon path="userPlus" size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
                        {UI.EVENT_VIEW_DONATION}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </FullScreenSheet>

      {formOpen ? (
        <EventFormSheet
          initial={editing}
          saving={saving}
          onSubmit={handleSubmit}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      ) : null}

      {contributionEvent ? (
        <EventContributionView
          event={contributionEvent}
          persons={persons}
          relationships={relationships}
          onClose={() => setContributionEvent(null)}
          onEventPatched={(patch) => patchEvent(contributionEvent.id, patch)}
        />
      ) : null}

      {donationEvent ? (
        <EventDonationsView
          event={donationEvent}
          persons={persons}
          onClose={() => setDonationEvent(null)}
          onEventPatched={(patch) => patchEvent(donationEvent.id, patch)}
        />
      ) : null}
    </>
  );
}
