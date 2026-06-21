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
import EventCard from './EventCard';
import { ET } from './event-theme';

type Props = {
  persons: Person[];
  relationships: Relationship[];
  /** Trang riêng `/events` — không bọc FullScreenSheet. */
  standalone?: boolean;
  onClose?: () => void;
};

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
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          canEdit={canUseFeature('editEvents')}
          onEdit={() => openEdit(event)}
          onDelete={() => void handleDelete(event)}
          onViewContribution={() => setContributionEvent(event)}
          onViewDonation={() => setDonationEvent(event)}
        />
      ))}
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
