'use client';

import { useEffect, useMemo, useState } from 'react';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import IconRoundButton from '@/components/ui/IconRoundButton';
import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { api } from '@/lib/api';
import { notify } from '@/lib/notify';
import type { Person } from '@/components/types/family-tree-types';
import type {
  CreateDonationInput,
  DonationDraftItem,
  EventDonation,
  FamilyEvent,
  FamilyEventDetail,
} from '@/components/types/event-types';
import {
  buildSaveDonationsPayload,
  donationsToDraft,
  isDonationsDraftDirty,
  newDonationDraftKey,
} from './event-donation-draft';
import { formatDonationValue, formatVnd } from './event-format';
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
  const { requireFeature } = useFeatureAccess();
  const [savedDonations, setSavedDonations] = useState<EventDonation[]>([]);
  const [draftDonations, setDraftDonations] = useState<DonationDraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const detail = await api.event.get(event.id);
        if (!cancelled) {
          const donations = detail.donations ?? [];
          setSavedDonations(donations);
          setDraftDonations(donationsToDraft(donations));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [event.id]);

  const editing = useMemo(
    () => draftDonations.find((item) => item.draftKey === editingKey) ?? null,
    [draftDonations, editingKey],
  );

  const isDirty = useMemo(
    () => isDonationsDraftDirty(savedDonations, draftDonations),
    [savedDonations, draftDonations],
  );

  const donationTotal = useMemo(
    () =>
      draftDonations
        .filter((donation) => donation.kind === 'MONEY')
        .reduce((sum, donation) => sum + donation.amount, 0),
    [draftDonations],
  );

  const inKindCount = useMemo(
    () => draftDonations.filter((donation) => donation.kind === 'IN_KIND').length,
    [draftDonations],
  );

  const upsertDraft = (input: CreateDonationInput) => {
    if (editing) {
      setDraftDonations((prev) =>
        prev.map((item) =>
          item.draftKey === editing.draftKey
            ? {
                ...item,
                donorName: input.donorName,
                personId: input.personId,
                kind: input.kind ?? 'MONEY',
                amount: input.amount ?? 0,
                itemDescription: input.itemDescription ?? null,
                note: input.note ?? null,
              }
            : item,
        ),
      );
    } else {
      setDraftDonations((prev) => [
        ...prev,
        {
          draftKey: newDonationDraftKey(),
          donorName: input.donorName,
          personId: input.personId,
          kind: input.kind ?? 'MONEY',
          amount: input.amount ?? 0,
          itemDescription: input.itemDescription ?? null,
          note: input.note ?? null,
        },
      ]);
    }
    setFormOpen(false);
    setEditingKey(null);
  };

  const removeDraft = (draftKey: string) => {
    if (!window.confirm(UI.EVENT_DONATION_DELETE_CONFIRM)) return;
    setDraftDonations((prev) => prev.filter((item) => item.draftKey !== draftKey));
  };

  const handleSave = async () => {
    if (!requireFeature('editEvents')) return;
    if (!isDirty || saving) return;

    const payload = buildSaveDonationsPayload(savedDonations, draftDonations);
    setSaving(true);
    try {
      const detail = await api.event.saveDonations(event.id, payload);
      const donations = detail.donations ?? [];
      setSavedDonations(donations);
      setDraftDonations(donationsToDraft(donations));
      onEventPatched(summaryPatch(detail));
      notify.success(UI.TOAST_DONATIONS_SAVED);
    } catch (error) {
      setDraftDonations(donationsToDraft(savedDonations));
      notify.error(error, UI.ERR_SAVE);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (isDirty && !window.confirm(UI.BOOK_PAGES_DISCARD_CONFIRM)) return;
    onClose();
  };

  const headerActions = (
    <div className="flex shrink-0 items-center gap-2">
      <IconRoundButton
        icon="plus"
        variant="gold"
        label={UI.BTN_CREATE}
        onClick={() => {
          setEditingKey(null);
          setFormOpen(true);
        }}
      />
      <IconRoundButton
        icon="save"
        variant="gold"
        label={UI.SAVE}
        loading={saving}
        disabled={!isDirty || saving}
        onClick={() => void handleSave()}
      />
    </div>
  );

  return (
    <>
      <FullScreenSheet
        title={UI.EVENT_DONATION_SECTION}
        onClose={handleClose}
        headerRight={headerActions}
        tone="book"
      >
        <div className={`border-b border-amber-400/20 bg-white py-3 text-center md:mx-6 md:mt-4 md:rounded-xl md:border md:shadow-sm ${ET.pagePad}`}>
          <div className={`text-xl font-bold ${ET.money}`}>{formatVnd(donationTotal)}</div>
          <div className="text-xs text-slate-500">{UI.EVENT_DONATION_TOTAL}</div>
          {draftDonations.length > 0 ? (
            <div className="mt-1 text-xs text-slate-400">
              {UI.EVENT_DONATION_SUMMARY_SUBTITLE(draftDonations.length, inKindCount)}
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size={36} />
          </div>
        ) : draftDonations.length === 0 ? (
          <p className={`py-12 text-center text-sm text-amber-100/70 ${ET.pagePad}`}>{UI.EVENT_DONATION_EMPTY}</p>
        ) : (
          <div className={ET.pagePad}>
            <ul className={`divide-y divide-neutral-100 ${ET.panel}`}>
            {draftDonations.map((donation) => {
              const isMoney = donation.kind === 'MONEY';
              return (
              <li
                key={donation.draftKey}
                className={`flex gap-3 px-4 py-3 ${isMoney ? 'items-center' : 'items-start'}`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-600 text-sm font-semibold text-white ${
                    isMoney ? '' : 'mt-0.5'
                  }`}
                >
                  {donation.donorName.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`flex justify-between gap-2 ${isMoney ? 'items-center' : 'items-start'}`}>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-medium text-neutral-800">{donation.donorName}</span>
                        {donation.kind === 'IN_KIND' ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                            {UI.EVENT_DONATION_KIND_IN_KIND}
                          </span>
                        ) : null}
                      </div>
                      {donation.kind === 'IN_KIND' && donation.itemDescription ? (
                        <span className="mt-0.5 block text-sm font-semibold text-amber-900">
                          {donation.itemDescription}
                        </span>
                      ) : null}
                      {donation.note ? (
                        <span className="mt-0.5 block text-xs text-neutral-400">{donation.note}</span>
                      ) : null}
                    </div>
                    {donation.kind === 'MONEY' ? (
                      <span className={`shrink-0 text-sm font-bold ${ET.money}`}>
                        {formatDonationValue(donation)}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingKey(donation.draftKey);
                      setFormOpen(true);
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full text-neutral-500 active:bg-neutral-100"
                    aria-label={UI.EVENT_DONATION_EDIT}
                  >
                    <Icon path="edit" size={15} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeDraft(donation.draftKey)}
                    className="grid h-8 w-8 place-items-center rounded-full text-rose-500 active:bg-rose-50"
                    aria-label={UI.DELETE_PERSON}
                  >
                    <Icon path="trash" size={15} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
                  </button>
                </div>
              </li>
              );
            })}
          </ul>
          </div>
        )}
      </FullScreenSheet>

      {formOpen ? (
        <EventDonationFormSheet
          initial={editing}
          persons={persons}
          onSubmit={upsertDraft}
          onClose={() => {
            setFormOpen(false);
            setEditingKey(null);
          }}
        />
      ) : null}
    </>
  );
}
