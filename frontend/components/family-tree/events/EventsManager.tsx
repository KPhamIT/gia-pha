"use client";

import { useCallback, useEffect, useState } from "react";
import FullScreenSheet from "@/components/ui/FullScreenSheet";
import IconRoundButton from "@/components/ui/IconRoundButton";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { UI } from "@/lib/constants/ui-strings";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useEvents } from "@/hooks/useEvents";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import type {
  CreateEventInput,
  FamilyEvent,
} from "@/components/types/event-types";
import EventFormSheet from "./EventFormSheet";
import EventContributionView from "./EventContributionView";
import EventDonationsView from "./EventDonationsView";
import EventCard from "./EventCard";
import EventsLandingBoard from "./EventsLandingBoard";
import { ET } from "./event-theme";

type Props = {
  persons: Person[];
  relationships: Relationship[];
  /** Trang riêng `/events` — layout landing mới. */
  standalone?: boolean;
  onClose?: () => void;
  onCreateRef?: (openCreate: () => void) => void;
};

export default function EventsManager({
  persons,
  relationships,
  standalone = false,
  onClose,
  onCreateRef,
}: Props) {
  const { requireFeature, canUseFeature } = useFeatureAccess();
  const {
    events,
    loading,
    error,
    saving,
    reload,
    createEvent,
    updateEvent,
    deleteEvent,
    patchEvent,
  } = useEvents();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FamilyEvent | null>(null);
  const [contributionEvent, setContributionEvent] =
    useState<FamilyEvent | null>(null);
  const [donationEvent, setDonationEvent] = useState<FamilyEvent | null>(null);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  useEffect(() => {
    onCreateRef?.(openCreate);
  }, [onCreateRef, openCreate]);

  const openEdit = (event: FamilyEvent) => {
    setEditing(event);
    setFormOpen(true);
  };

  const handleSubmit = async (input: CreateEventInput) => {
    if (!requireFeature("editEvents")) return;
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
    if (!requireFeature("editEvents")) return;
    if (!window.confirm(UI.EVENT_DELETE_CONFIRM)) return;
    try {
      await deleteEvent(event.id);
    } catch {
      /* toast shown in useEvents */
    }
  };

  const canEdit = canUseFeature("editEvents");

  const addButton = canEdit ? (
    <IconRoundButton
      icon="plus"
      variant="gold"
      label={UI.BTN_CREATE}
      onClick={openCreate}
    />
  ) : null;

  const bookListBody = loading ? (
    <div className="flex justify-center py-12">
      <LoadingSpinner size={36} label={UI.LOADING} />
    </div>
  ) : error ? (
    <div className={`flex flex-col items-center gap-3 py-12 text-center ${ET.pagePad}`}>
      <p className="text-sm text-amber-100/80">{error}</p>
      <IconRoundButton
        icon="refresh"
        variant="onDark"
        label={UI.RETRY}
        onClick={() => void reload()}
      />
    </div>
  ) : events.length === 0 ? (
    <div className={`py-12 text-center ${ET.pagePad}`}>
      <p className="text-sm text-amber-100/70">{UI.EVENTS_EMPTY}</p>
    </div>
  ) : (
    <div className={`${ET.cardGrid} ${ET.pagePad}`}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          canEdit={canEdit}
          variant="book"
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
        <EventsLandingBoard
          events={events}
          loading={loading}
          error={error}
          canEdit={canEdit}
          onReload={() => void reload()}
          onCreate={openCreate}
          onEdit={openEdit}
          onDelete={(event) => void handleDelete(event)}
          onViewContribution={setContributionEvent}
          onViewDonation={setDonationEvent}
        />
      ) : (
        <FullScreenSheet
          title={UI.EVENTS_PAGE_TITLE}
          onClose={onClose!}
          headerRight={addButton}
          tone="book"
        >
          {bookListBody}
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
          canEdit={canEdit}
          onClose={() => setContributionEvent(null)}
          onEventPatched={(patch) => patchEvent(contributionEvent.id, patch)}
        />
      ) : null}

      {donationEvent ? (
        <EventDonationsView
          event={donationEvent}
          persons={persons}
          canEdit={canEdit}
          onClose={() => setDonationEvent(null)}
          onEventPatched={(patch) => patchEvent(donationEvent.id, patch)}
        />
      ) : null}
    </>
  );
}
