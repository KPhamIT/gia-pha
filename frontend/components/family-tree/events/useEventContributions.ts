"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import type { FamilyEvent } from "@/components/types/event-types";
import { groupLivingByFamily } from "./event-grouping";
import { parseVndInput } from "./event-format";
import {
  amountsFromContributions,
  changedContributions,
  isFullyPaid,
  mapsEqual,
  resolveDraftAmounts,
  summaryPatch,
  withAmount,
  withoutKey,
} from "./event-contribution-utils";

type Args = {
  event: FamilyEvent;
  persons: Person[];
  relationships: Relationship[];
  onEventPatched: (patch: Partial<FamilyEvent>) => void;
};

export function useEventContributions({
  event,
  persons,
  relationships,
  onEventPatched,
}: Args) {
  const { requireFeature } = useFeatureAccess();
  const [savedAmounts, setSavedAmounts] = useState<Map<number, number>>(
    new Map(),
  );
  const [draftAmounts, setDraftAmounts] = useState<Map<number, number>>(
    new Map(),
  );
  const [inputTexts, setInputTexts] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const groups = useMemo(
    () =>
      groupLivingByFamily(persons, relationships, {
        malesOnly: event.maleOnly,
      }),
    [persons, relationships, event.maleOnly],
  );
  const livingCount = useMemo(
    () => groups.reduce((n, g) => n + g.members.length, 0),
    [groups],
  );
  const livingIds = useMemo(
    () => groups.flatMap((g) => g.members.map((m) => m.id)),
    [groups],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const detail = await api.event.get(event.id);
        if (!cancelled) {
          const initial = amountsFromContributions(
            detail.contributions ?? [],
            event.amountPerPerson,
          );
          setSavedAmounts(initial);
          setDraftAmounts(new Map(initial));
          setInputTexts(new Map());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [event.id, event.amountPerPerson]);

  const resolvedDraft = useMemo(
    () => resolveDraftAmounts(draftAmounts, inputTexts),
    [draftAmounts, inputTexts],
  );
  const isDirty = useMemo(
    () => !mapsEqual(resolvedDraft, savedAmounts),
    [resolvedDraft, savedAmounts],
  );

  const getAmount = useCallback(
    (personId: number) => {
      const raw = inputTexts.get(personId);
      return raw != null
        ? parseVndInput(raw)
        : (draftAmounts.get(personId) ?? 0);
    },
    [draftAmounts, inputTexts],
  );

  const { livingPaidCount, contributionTotal } = useMemo(() => {
    let paid = 0;
    let total = 0;
    for (const g of groups) {
      for (const m of g.members) {
        const amount = getAmount(m.id);
        total += amount;
        if (isFullyPaid(amount, event.amountPerPerson)) paid += 1;
      }
    }
    return { livingPaidCount: paid, contributionTotal: total };
  }, [groups, getAmount, event.amountPerPerson]);

  const inputValueFor = useCallback(
    (personId: number) =>
      inputTexts.get(personId) ??
      (draftAmounts.get(personId) ? String(draftAmounts.get(personId)) : ""),
    [inputTexts, draftAmounts],
  );

  const setInputText = useCallback((personId: number, value: string) => {
    setInputTexts((prev) => new Map(prev).set(personId, value));
  }, []);

  const toggleFullPaid = useCallback(
    (personId: number) => {
      const current = getAmount(personId);
      const nextAmount = isFullyPaid(current, event.amountPerPerson)
        ? 0
        : event.amountPerPerson > 0
          ? event.amountPerPerson
          : current > 0
            ? 0
            : 1;
      setInputTexts((prev) => withoutKey(prev, personId));
      setDraftAmounts((prev) => withAmount(prev, personId, nextAmount));
    },
    [getAmount, event.amountPerPerson],
  );

  const commitInput = useCallback(
    (personId: number) => {
      const raw = inputTexts.get(personId);
      if (raw == null) return;
      const amount = parseVndInput(raw);
      setDraftAmounts((prev) => withAmount(prev, personId, amount));
      setInputTexts((prev) => withoutKey(prev, personId));
    },
    [inputTexts],
  );

  const handleSave = useCallback(async () => {
    if (!requireFeature("editEvents")) return;
    if (!isDirty || saving) return;

    const nextDraft = resolveDraftAmounts(draftAmounts, inputTexts);
    const contributions = changedContributions(
      livingIds,
      nextDraft,
      savedAmounts,
    );
    if (contributions.length === 0) return;

    setSaving(true);
    setDraftAmounts(nextDraft);
    setInputTexts(new Map());

    try {
      const detail = await api.event.saveContributions(event.id, {
        contributions,
      });
      const synced = amountsFromContributions(
        detail.contributions ?? [],
        event.amountPerPerson,
      );
      setSavedAmounts(synced);
      setDraftAmounts(new Map(synced));
      onEventPatched(summaryPatch(detail));
      notify.success(UI.TOAST_CONTRIBUTIONS_SAVED);
    } catch (error) {
      setDraftAmounts(new Map(savedAmounts));
      notify.error(error, UI.ERR_SAVE);
    } finally {
      setSaving(false);
    }
  }, [
    requireFeature,
    isDirty,
    saving,
    draftAmounts,
    inputTexts,
    livingIds,
    savedAmounts,
    event.id,
    event.amountPerPerson,
    onEventPatched,
  ]);

  return {
    groups,
    livingCount,
    livingPaidCount,
    contributionTotal,
    loading,
    saving,
    isDirty,
    getAmount,
    inputValueFor,
    setInputText,
    toggleFullPaid,
    commitInput,
    handleSave,
  };
}
