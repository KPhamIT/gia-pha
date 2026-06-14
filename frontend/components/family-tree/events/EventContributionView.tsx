'use client';

import { useEffect, useMemo, useState } from 'react';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { getBranchLabel } from '@/lib/constants/branches';
import { api } from '@/lib/api';
import type { Person, Relationship } from '@/components/types/family-tree-types';
import type { FamilyEvent, FamilyEventDetail } from '@/components/types/event-types';
import { groupLivingByFamily } from './event-grouping';
import { formatVnd } from './event-format';

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

export default function EventContributionView({ event, persons, relationships, onClose, onEventPatched }: Props) {
  const [paidIds, setPaidIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const groups = useMemo(() => groupLivingByFamily(persons, relationships), [persons, relationships]);
  const livingCount = useMemo(() => groups.reduce((n, g) => n + g.members.length, 0), [groups]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const detail = await api.event.get(event.id);
        if (!cancelled) {
          setPaidIds(new Set((detail.contributions ?? []).filter((c) => c.paid).map((c) => c.personId)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [event.id]);

  const livingPaidCount = useMemo(
    () => groups.reduce((n, g) => n + g.members.filter((m) => paidIds.has(m.id)).length, 0),
    [groups, paidIds],
  );
  const contributionTotal = livingPaidCount * event.amountPerPerson;

  const patchFromDetail = (detail: FamilyEventDetail) =>
    onEventPatched({
      paidCount: detail.paidCount,
      totalCollected: detail.totalCollected,
      donationTotal: detail.donationTotal,
      grandTotal: detail.grandTotal,
    });

  const toggle = async (personId: number) => {
    if (togglingId != null) return;
    const nextPaid = !paidIds.has(personId);
    setTogglingId(personId);
    setPaidIds((prev) => {
      const next = new Set(prev);
      if (nextPaid) next.add(personId);
      else next.delete(personId);
      return next;
    });
    try {
      const detail = await api.event.setContribution(event.id, personId, nextPaid);
      setPaidIds(new Set((detail.contributions ?? []).filter((c) => c.paid).map((c) => c.personId)));
      patchFromDetail(detail);
    } catch {
      setPaidIds((prev) => {
        const next = new Set(prev);
        if (nextPaid) next.delete(personId);
        else next.add(personId);
        return next;
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <FullScreenSheet title={event.title} onClose={onClose} tone="book">
      <div className="grid grid-cols-3 gap-px border-b border-slate-200 bg-slate-200 text-center">
        <div className="bg-white py-3">
          <div className="text-lg font-bold text-emerald-600">{livingPaidCount}</div>
          <div className="text-xs text-slate-500">{UI.EVENT_PAID}</div>
        </div>
        <div className="bg-white py-3">
          <div className="text-lg font-bold text-rose-600">{livingCount - livingPaidCount}</div>
          <div className="text-xs text-slate-500">{UI.EVENT_UNPAID}</div>
        </div>
        <div className="bg-white py-3">
          <div className="text-base font-bold text-blue-600">{formatVnd(contributionTotal)}</div>
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
            const groupPaid = group.members.filter((m) => paidIds.has(m.id)).length;
            return (
              <section key={group.key} className="overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900">
                <header className="flex items-center justify-between gap-2 bg-slate-50 px-3 py-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-800">
                      {group.head ? UI.EVENT_FAMILY_OF(group.head.fullName) : UI.EVENT_ROOT_GROUP}
                    </h3>
                    {group.head ? <p className="truncate text-xs text-slate-400">{personMeta(group.head)}</p> : null}
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                    {groupPaid}/{group.members.length}
                  </span>
                </header>
                <ul className="divide-y divide-slate-100">
                  {group.members.map((member) => {
                    const paid = paidIds.has(member.id);
                    return (
                      <li key={member.id}>
                        <button
                          type="button"
                          onClick={() => void toggle(member.id)}
                          disabled={togglingId === member.id}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left active:bg-slate-50 disabled:opacity-60"
                        >
                          <span
                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                              paid ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent'
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
                          <span className={`shrink-0 text-xs font-medium ${paid ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {paid ? UI.EVENT_PAID : UI.EVENT_UNPAID}
                          </span>
                        </button>
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
