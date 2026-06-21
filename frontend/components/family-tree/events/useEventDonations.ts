'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { notify } from '@/lib/notify';
import { UI } from '@/lib/constants/ui-strings';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import type { CreateDonationInput, DonationDraftItem, EventDonation, FamilyEvent } from '@/components/types/event-types';
import {
  buildSaveDonationsPayload,
  donationsToDraft,
  draftFromInput,
  isDonationsDraftDirty,
  newDonationDraftKey,
} from './event-donation-draft';
import { summaryPatch } from './event-contribution-utils';

type Args = {
  event: FamilyEvent;
  onEventPatched: (patch: Partial<FamilyEvent>) => void;
};

export function useEventDonations({ event, onEventPatched }: Args) {
  const { requireFeature } = useFeatureAccess();
  const [savedDonations, setSavedDonations] = useState<EventDonation[]>([]);
  const [draftDonations, setDraftDonations] = useState<DonationDraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const isDirty = useMemo(
    () => isDonationsDraftDirty(savedDonations, draftDonations),
    [savedDonations, draftDonations],
  );
  const donationTotal = useMemo(
    () => draftDonations.filter((d) => d.kind === 'MONEY').reduce((sum, d) => sum + d.amount, 0),
    [draftDonations],
  );
  const inKindCount = useMemo(
    () => draftDonations.filter((d) => d.kind === 'IN_KIND').length,
    [draftDonations],
  );

  const upsertDraft = useCallback((input: CreateDonationInput, editingKey: string | null) => {
    setDraftDonations((prev) => {
      if (editingKey && prev.some((item) => item.draftKey === editingKey)) {
        return prev.map((item) =>
          item.draftKey === editingKey
            ? { ...item, ...draftFromInput(input, editingKey) }
            : item,
        );
      }
      return [...prev, draftFromInput(input, newDonationDraftKey())];
    });
  }, []);

  const removeDraft = useCallback((draftKey: string) => {
    if (!window.confirm(UI.EVENT_DONATION_DELETE_CONFIRM)) return;
    setDraftDonations((prev) => prev.filter((item) => item.draftKey !== draftKey));
  }, []);

  const handleSave = useCallback(async () => {
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
  }, [requireFeature, isDirty, saving, savedDonations, draftDonations, event.id, onEventPatched]);

  return {
    draftDonations,
    isDirty,
    donationTotal,
    inKindCount,
    loading,
    saving,
    upsertDraft,
    removeDraft,
    handleSave,
  };
}
