'use client';

import { useEffect, useMemo, useState } from 'react';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { api } from '@/lib/api';
import type { Person } from '@/components/types/family-tree-types';
import type {
  CreateDonationInput,
  EventDonation,
  FamilyEvent,
  FamilyEventDetail,
} from '@/components/types/event-types';
import { formatVnd } from './event-format';
import { ET } from './event-theme';
import EventDonationFormSheet from './EventDonationFormSheet';

type Props = {
  event: FamilyEvent;
  persons: Person[];
  onClose: () => void;
  onEventPatched: (patch: Partial<FamilyEvent>) => void;
};

const summaryPatch = (detail: FamilyEventDetail): Partial<FamilyEvent> => ({
  paidCount: detail.paidCount,
  totalCollected: detail.totalCollected,
  donationTotal: detail.donationTotal,
  grandTotal: detail.grandTotal,
});

/** Full-screen list of free-form merit donations (công đức) for one event. */
export default function EventDonationsView({ event, persons, onClose, onEventPatched }: Props) {
  const [donations, setDonations] = useState<EventDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EventDonation | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const detail = await api.event.get(event.id);
        if (!cancelled) setDonations(detail.donations ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [event.id]);

  const donationTotal = useMemo(() => donations.reduce((sum, d) => sum + d.amount, 0), [donations]);

  const apply = (detail: FamilyEventDetail) => {
    setDonations(detail.donations ?? []);
    onEventPatched(summaryPatch(detail));
  };

  const submit = async (input: CreateDonationInput) => {
    setSaving(true);
    try {
      const detail = editing
        ? await api.event.updateDonation(event.id, editing.id, input)
        : await api.event.addDonation(event.id, input);
      apply(detail);
      setFormOpen(false);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (donation: EventDonation) => {
    if (!window.confirm(UI.EVENT_DONATION_DELETE_CONFIRM)) return;
    apply(await api.event.removeDonation(event.id, donation.id));
  };

  const addButton = (
    <button
      type="button"
      onClick={() => {
        setEditing(null);
        setFormOpen(true);
      }}
      className={`grid h-10 w-10 place-items-center rounded-full ${ET.roundBtn}`}
      aria-label={UI.EVENT_DONATION_ADD}
    >
      <Icon path="plus" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
    </button>
  );

  return (
    <>
      <FullScreenSheet title={UI.EVENT_DONATION_SECTION} onClose={onClose} headerRight={addButton} tone="book">
        <div className="border-b border-amber-400/20 bg-white px-4 py-3 text-center">
          <div className={`text-xl font-bold ${ET.money}`}>{formatVnd(donationTotal)}</div>
          <div className="text-xs text-slate-500">
            {UI.EVENT_DONATION_TOTAL} · {donations.length}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size={36} />
          </div>
        ) : donations.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-amber-100/70">{UI.EVENT_DONATION_EMPTY}</p>
        ) : (
          <ul className={`m-4 divide-y divide-neutral-100 ${ET.panel}`}>
            {donations.map((donation) => (
              <li key={donation.id} className="flex items-center gap-3 px-4 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-600 text-sm font-semibold text-white">
                  {donation.donorName.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-neutral-800">{donation.donorName}</span>
                  {donation.note ? <span className="block truncate text-xs text-neutral-400">{donation.note}</span> : null}
                </div>
                <span className={`shrink-0 text-sm font-bold ${ET.money}`}>{formatVnd(donation.amount)}</span>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(donation);
                      setFormOpen(true);
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full text-neutral-500 active:bg-neutral-100"
                    aria-label={UI.EVENT_DONATION_EDIT}
                  >
                    <Icon path="edit" size={15} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(donation)}
                    className="grid h-8 w-8 place-items-center rounded-full text-rose-500 active:bg-rose-50"
                    aria-label={UI.DELETE_PERSON}
                  >
                    <Icon path="trash" size={15} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </FullScreenSheet>

      {formOpen ? (
        <EventDonationFormSheet
          initial={editing}
          persons={persons}
          saving={saving}
          onSubmit={submit}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      ) : null}
    </>
  );
}
