'use client';

import FullScreenSheet from '@/components/ui/FullScreenSheet';
import IconRoundButton from '@/components/ui/IconRoundButton';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import type { Person, Relationship } from '@/components/types/family-tree-types';
import type { FamilyEvent } from '@/components/types/event-types';
import { formatVnd } from './event-format';
import { isFullyPaid, personMeta } from './event-contribution-utils';
import { useEventContributions } from './useEventContributions';
import ContributionMemberRow from './ContributionMemberRow';
import { ET } from './event-theme';

type Props = {
  event: FamilyEvent;
  persons: Person[];
  relationships: Relationship[];
  onClose: () => void;
  onEventPatched: (patch: Partial<FamilyEvent>) => void;
};

export default function EventContributionView({ event, persons, relationships, onClose, onEventPatched }: Props) {
  const {
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
  } = useEventContributions({ event, persons, relationships, onEventPatched });

  const handleClose = () => {
    if (isDirty && !window.confirm(UI.BOOK_PAGES_DISCARD_CONFIRM)) return;
    onClose();
  };

  const saveButton = (
    <IconRoundButton
      icon="save"
      variant="gold"
      label={UI.SAVE}
      loading={saving}
      disabled={!isDirty || saving}
      onClick={() => void handleSave()}
    />
  );

  return (
    <FullScreenSheet title={event.title} onClose={handleClose} headerRight={saveButton} tone="book">
      <div className={`overflow-hidden rounded-xl border border-amber-200/40 bg-white shadow-sm ${ET.pagePad} md:mx-6 md:mt-4`}>
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-amber-300/30 bg-amber-200/50 text-center">
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
      </div>

      {event.amountPerPerson > 0 ? (
        <p className={`text-xs text-amber-100/80 ${ET.pagePad} md:pt-4`}>
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
        <div className={`grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4 ${ET.pagePad}`}>
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
                  {group.members.map((member) => (
                    <ContributionMemberRow
                      key={member.id}
                      member={member}
                      amount={getAmount(member.id)}
                      amountPerPerson={event.amountPerPerson}
                      inputValue={inputValueFor(member.id)}
                      saving={saving}
                      onToggle={() => toggleFullPaid(member.id)}
                      onInputChange={(value) => setInputText(member.id, value)}
                      onCommit={() => commitInput(member.id)}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </FullScreenSheet>
  );
}
