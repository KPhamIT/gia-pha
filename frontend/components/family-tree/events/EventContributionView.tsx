'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { getBranchLabel } from '@/lib/constants/branches';
import { api } from '@/lib/api';
import type { Person, Relationship } from '@/components/types/family-tree-types';
import type { EventContribution, FamilyEvent, FamilyEventDetail } from '@/components/types/event-types';
import { groupLivingByFamily } from './event-grouping';
import { formatVnd, parseVndInput } from './event-format';
import { ET } from './event-theme';

type Props = {
  event: FamilyEvent;
  persons: Person[];
  relationships: Relationship[];
  onClose: () => void;
  onEventPatched: (patch: Partial<FamilyEvent>) => void;
};

function personMeta(person: Person): string {
  return [
    person.generation != null ? UI.GENERATION_SHORT(person.generation) : null,
    person.branch != null ? getBranchLabel(person.branch) : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

function amountsFromContributions(
  contributions: EventContribution[],
  amountPerPerson: number,
): Map<number, number> {
  const map = new Map<number, number>();
  for (const contribution of contributions) {
    const amount =
      contribution.amountPaid > 0
        ? contribution.amountPaid
        : contribution.paid && amountPerPerson > 0
          ? amountPerPerson
          : 0;
    if (amount > 0) map.set(contribution.personId, amount);
  }
  return map;
}

function isFullyPaid(amount: number, amountPerPerson: number): boolean {
  if (amountPerPerson <= 0) return amount > 0;
  return amount >= amountPerPerson;
}

function mapsEqual(a: Map<number, number>, b: Map<number, number>): boolean {
  if (a.size !== b.size) return false;
  for (const [key, value] of a) {
    if (b.get(key) !== value) return false;
  }
  return true;
}

/** Merge parsed money inputs into the draft before compare/save. */
function resolveDraftAmounts(
  draft: Map<number, number>,
  inputs: Map<number, string>,
): Map<number, number> {
  const resolved = new Map(draft);
  for (const [personId, raw] of inputs) {
    const amount = parseVndInput(raw);
    if (amount <= 0) resolved.delete(personId);
    else resolved.set(personId, amount);
  }
  return resolved;
}

const summaryPatch = (detail: FamilyEventDetail): Partial<FamilyEvent> => ({
  paidCount: detail.paidCount,
  totalCollected: detail.totalCollected,
  donationTotal: detail.donationTotal,
  grandTotal: detail.grandTotal,
});

export default function EventContributionView({ event, persons, relationships, onClose, onEventPatched }: Props) {
  const [savedAmounts, setSavedAmounts] = useState<Map<number, number>>(new Map());
  const [draftAmounts, setDraftAmounts] = useState<Map<number, number>>(new Map());
  const [inputTexts, setInputTexts] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const groups = useMemo(
    () => groupLivingByFamily(persons, relationships, { malesOnly: event.maleOnly }),
    [persons, relationships, event.maleOnly],
  );
  const livingCount = useMemo(() => groups.reduce((n, g) => n + g.members.length, 0), [groups]);
  const livingIds = useMemo(() => groups.flatMap((g) => g.members.map((m) => m.id)), [groups]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const detail = await api.event.get(event.id);
        if (!cancelled) {
          const initial = amountsFromContributions(detail.contributions ?? [], event.amountPerPerson);
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

  const isDirty = useMemo(() => !mapsEqual(resolvedDraft, savedAmounts), [resolvedDraft, savedAmounts]);

  const getAmount = useCallback(
    (personId: number) => {
      const raw = inputTexts.get(personId);
      if (raw != null) return parseVndInput(raw);
      return draftAmounts.get(personId) ?? 0;
    },
    [draftAmounts, inputTexts],
  );

  const livingPaidCount = useMemo(
    () =>
      groups.reduce(
        (n, g) => n + g.members.filter((m) => isFullyPaid(getAmount(m.id), event.amountPerPerson)).length,
        0,
      ),
    [groups, getAmount, event.amountPerPerson],
  );

  const contributionTotal = useMemo(
    () => groups.reduce((n, g) => n + g.members.reduce((sum, m) => sum + getAmount(m.id), 0), 0),
    [groups, getAmount],
  );

  const toggleFullPaid = (personId: number) => {
    const current = getAmount(personId);
    const nextAmount = isFullyPaid(current, event.amountPerPerson)
      ? 0
      : event.amountPerPerson > 0
        ? event.amountPerPerson
        : current > 0
          ? 0
          : 1;

    setInputTexts((prev) => {
      const next = new Map(prev);
      next.delete(personId);
      return next;
    });
    setDraftAmounts((prev) => {
      const next = new Map(prev);
      if (nextAmount <= 0) next.delete(personId);
      else next.set(personId, nextAmount);
      return next;
    });
  };

  const commitInput = (personId: number) => {
    const raw = inputTexts.get(personId);
    if (raw == null) return;
    const amount = parseVndInput(raw);
    setDraftAmounts((prev) => {
      const next = new Map(prev);
      if (amount <= 0) next.delete(personId);
      else next.set(personId, amount);
      return next;
    });
    setInputTexts((prev) => {
      const next = new Map(prev);
      next.delete(personId);
      return next;
    });
  };

  const handleSave = async () => {
    if (!isDirty || saving) return;

    const nextDraft = resolveDraftAmounts(draftAmounts, inputTexts);
    const changedIds = livingIds.filter((id) => (nextDraft.get(id) ?? 0) !== (savedAmounts.get(id) ?? 0));
    if (changedIds.length === 0) return;

    setSaving(true);
    setDraftAmounts(nextDraft);
    setInputTexts(new Map());

    try {
      const contributions = changedIds.map((personId) => ({
        personId,
        amountPaid: nextDraft.get(personId) ?? 0,
      }));
      const detail = await api.event.saveContributions(event.id, { contributions });
      const synced = amountsFromContributions(detail.contributions ?? [], event.amountPerPerson);
      setSavedAmounts(synced);
      setDraftAmounts(new Map(synced));
      onEventPatched(summaryPatch(detail));
    } catch {
      setDraftAmounts(new Map(savedAmounts));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (isDirty && !window.confirm(UI.BOOK_PAGES_DISCARD_CONFIRM)) return;
    onClose();
  };

  const saveButton = (
    <button
      type="button"
      onClick={() => void handleSave()}
      disabled={!isDirty || saving}
      className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-950 active:bg-amber-200 disabled:bg-white/10 disabled:text-amber-100/40"
      aria-label={UI.BOOK_PAGES_SAVE}
      title={isDirty ? UI.BOOK_PAGES_SAVE : UI.BOOK_PAGES_SAVED}
    >
      {saving ? (
        <LoadingSpinner size={20} />
      ) : (
        <Icon path="save" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
      )}
    </button>
  );

  return (
    <FullScreenSheet title={event.title} onClose={handleClose} headerRight={saveButton} tone="book">
      <div className="grid grid-cols-3 gap-px border-b border-amber-300/30 bg-amber-200/50 text-center">
        <div className="bg-white py-3">
          <div className="text-lg font-bold text-amber-700">{livingPaidCount}</div>
          <div className="text-xs text-slate-500">{UI.EVENT_PAID}</div>
        </div>
        <div className="bg-white py-3">
          <div className="text-lg font-bold text-slate-400">{livingCount - livingPaidCount}</div>
          <div className="text-xs text-slate-500">{UI.EVENT_UNPAID}</div>
        </div>
        <div className="bg-white py-3">
          <div className={`text-base font-bold ${ET.money}`}>{formatVnd(contributionTotal)}</div>
          <div className="text-xs text-slate-500">{UI.EVENT_TOTAL_COLLECTED}</div>
        </div>
      </div>

      {event.amountPerPerson > 0 ? (
        <p className="px-4 pt-3 text-xs text-amber-100/80">
          {UI.EVENT_AMOUNT_PER_PERSON(formatVnd(event.amountPerPerson))}
        </p>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size={36} />
        </div>
      ) : livingCount === 0 ? (
        <p className="px-4 py-12 text-center text-sm text-amber-100/70">{UI.EVENT_NO_MEMBERS}</p>
      ) : (
        <div className="space-y-4 p-4">
          {groups.map((group) => {
            const groupPaid = group.members.filter((m) =>
              isFullyPaid(getAmount(m.id), event.amountPerPerson),
            ).length;
            return (
              <section key={group.key} className={ET.panel}>
                <header className={`flex items-center justify-between gap-2 px-3 py-2 ${ET.bandHeader}`}>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-amber-900">
                      {group.head ? UI.EVENT_FAMILY_OF(group.head.fullName) : UI.EVENT_ROOT_GROUP}
                    </h3>
                    {group.head ? <p className="truncate text-xs text-amber-800/70">{personMeta(group.head)}</p> : null}
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-amber-800">
                    {groupPaid}/{group.members.length}
                  </span>
                </header>
                <ul className="divide-y divide-neutral-100">
                  {group.members.map((member) => {
                    const amount = getAmount(member.id);
                    const paid = isFullyPaid(amount, event.amountPerPerson);
                    const partial = amount > 0 && !paid;
                    const inputValue =
                      inputTexts.get(member.id) ?? (draftAmounts.get(member.id) ? String(draftAmounts.get(member.id)) : '');

                    return (
                      <li key={member.id}>
                        <div className="flex items-center gap-2 px-3 py-2.5">
                          <button
                            type="button"
                            onClick={() => toggleFullPaid(member.id)}
                            disabled={saving}
                            className="flex min-w-0 flex-1 items-center gap-3 text-left active:bg-amber-50 disabled:opacity-60"
                          >
                            <span
                              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                                paid ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300 text-transparent'
                              }`}
                            >
                              <Icon path="check" size={14} fill="none" stroke="currentColor" strokeWidth={3} pointer={false} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-slate-800">{member.fullName}</span>
                              {personMeta(member) ? (
                                <span className="block truncate text-xs text-slate-400">{personMeta(member)}</span>
                              ) : null}
                            </span>
                            <span
                              className={`shrink-0 text-xs font-semibold ${
                                paid ? 'text-amber-700' : partial ? 'text-amber-700' : 'text-slate-400'
                              }`}
                            >
                              {paid
                                ? UI.EVENT_PAID
                                : partial
                                  ? event.amountPerPerson > 0
                                    ? `${formatVnd(amount)} / ${formatVnd(event.amountPerPerson)}`
                                    : formatVnd(amount)
                                  : UI.EVENT_UNPAID}
                            </span>
                          </button>
                          {!paid ? (
                            <input
                              type="text"
                              inputMode="numeric"
                              value={inputValue}
                              disabled={saving}
                              placeholder={UI.EVENT_AMOUNT_PAID_PLACEHOLDER}
                              onChange={(e) =>
                                setInputTexts((prev) => {
                                  const next = new Map(prev);
                                  next.set(member.id, e.target.value);
                                  return next;
                                })
                              }
                              onBlur={() => commitInput(member.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-24 shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-right text-xs text-slate-800 outline-none focus:border-amber-400 disabled:opacity-60"
                            />
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </FullScreenSheet>
  );
}
