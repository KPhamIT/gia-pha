'use client';

import { useState } from 'react';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import IconRoundButton from '@/components/ui/IconRoundButton';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useEvents } from '@/hooks/useEvents';
import type { Person, Relationship } from '@/components/types/family-tree-types';
import type { CreateEventInput, FamilyEvent } from '@/components/types/event-types';
import EventFormSheet from './EventFormSheet';
import EventContributionView from './EventContributionView';
import EventDonationsView from './EventDonationsView';
import { formatVnd } from './event-format';
import { ET } from './event-theme';

type Props = {
  persons: Person[];
  relationships: Relationship[];
  /** Trang riêng `/events` — không bọc FullScreenSheet. */
  standalone?: boolean;
  onClose?: () => void;
};

function formatDate(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('vi-VN');
}

export default function EventsManager({
  persons,
  relationships,
  standalone = false,
  onClose,
}: Props) {
  const { requireFeature, canUseFeature } = useFeatureAccess();
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
    if (!requireFeature('editEvents')) return;
    try {
      if (editing) await updateEvent(editing.id, input);
      else await createEvent(input);
      setFormOpen(false);
      setEditing(null);
    } catch {
      /* toast shown in useEvents */
    }
  };

  const handleDelete = async (event: FamilyEvent) => {
    if (!requireFeature('editEvents')) return;
    if (!window.confirm(UI.EVENT_DELETE_CONFIRM)) return;
    try {
      await deleteEvent(event.id);
    } catch {
      /* toast shown in useEvents */
    }
  };

  const addButton = canUseFeature('editEvents') ? (
    <IconRoundButton icon="plus" variant="gold" label={UI.BTN_CREATE} onClick={openCreate} />
  ) : null;

  const body = loading ? (
    <div className="flex justify-center py-12">
      <LoadingSpinner size={36} />
    </div>
  ) : error ? (
    <p className="px-4 py-12 text-center text-sm text-rose-300">{error}</p>
  ) : events.length === 0 ? (
    <p className={`py-12 text-center text-sm text-amber-100/70 ${standalone ? '' : ET.pagePad}`}>
      {UI.EVENTS_EMPTY}
    </p>
  ) : (
    <div className={`${ET.cardGrid} ${standalone ? '' : ET.pagePad}`}>
      {events.map((event) => {
        const date = formatDate(event.eventDate);
        const isContribution = event.type === 'CONTRIBUTION';
        return (
          <article
            key={event.id}
            className={`${ET.card} flex flex-col p-4 transition-shadow md:p-5 md:hover:shadow-xl`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      isContribution ? 'bg-amber-700 text-amber-50' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isContribution ? UI.EVENT_BADGE_CONTRIBUTION : UI.EVENT_BADGE_INFO}
                  </span>
                  {isContribution && event.maleOnly ? (
                    <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                      {UI.EVENT_MALE_ONLY_BADGE}
                    </span>
                  ) : null}
                  {date ? <span className="text-xs text-neutral-400">{date}</span> : null}
                </div>
                <h2 className="mt-1.5 text-base font-semibold text-neutral-900 md:text-lg">{event.title}</h2>
              </div>
              {canUseFeature('editEvents') ? (
                <div className="flex shrink-0 gap-1">
                  <IconRoundButton
                    icon="edit"
                    variant="outline"
                    iconSize={14}
                    label={UI.BTN_EDIT}
                    onClick={() => openEdit(event)}
                  />
                  <IconRoundButton
                    icon="trash"
                    variant="danger"
                    iconSize={14}
                    label={UI.DELETE_PERSON}
                    onClick={() => void handleDelete(event)}
                  />
                </div>
              ) : null}
            </div>

            {event.description ? (
              <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-neutral-600 md:line-clamp-4">
                {event.description}
              </p>
            ) : null}

            <div className="mt-auto border-t border-amber-200/60 pt-3 md:pt-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-neutral-500">
                  {isContribution ? UI.EVENT_PAID_COUNT_SHORT(event.paidCount) : UI.EVENT_DONATION_TOTAL}
                </span>
                <span className={`font-bold tabular-nums ${ET.money}`}>{formatVnd(event.grandTotal)}</span>
              </div>
              <div className="mt-3 flex gap-2">
                {isContribution ? (
                  <IconRoundButton
                    icon="list"
                    variant="primary"
                    label={UI.EVENT_VIEW_CONTRIBUTION}
                    compact={false}
                    className="flex-1"
                    onClick={() => setContributionEvent(event)}
                  />
                ) : null}
                <IconRoundButton
                  icon="userPlus"
                  variant="outline"
                  label={UI.EVENT_VIEW_DONATION}
                  compact={false}
                  className={isContribution ? 'flex-1' : 'w-full'}
                  onClick={() => setDonationEvent(event)}
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <>
      {standalone ? (
        <div>
          {addButton ? <div className="mb-4 flex justify-end">{addButton}</div> : null}
          {body}
        </div>
      ) : (
        <FullScreenSheet title={UI.EVENTS_TITLE} onClose={onClose!} headerRight={addButton} tone="book">
          {body}
        </FullScreenSheet>
      )}

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
