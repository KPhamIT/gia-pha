'use client';

import { useMemo, useState } from 'react';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import IconRoundButton from '@/components/ui/IconRoundButton';
import { FormField, inputClassName, textareaClassName } from '@/components/ui/CollapsibleSection';
import Icon from '@/components/icons/Icon';
import { LAYOUT } from '@/lib/constants/ui-layout';
import { UI } from '@/lib/constants/ui-strings';
import { getBranchLabel } from '@/lib/constants/branches';
import type { Person } from '@/components/types/family-tree-types';
import type { CreateDonationInput, DonationDraftItem, DonationKind } from '@/components/types/event-types';
import { filterPersonsByName } from '@/utils/person-search';
import { ET } from './event-theme';

type Props = {
  initial?: DonationDraftItem | null;
  persons: Person[];
  onSubmit: (input: CreateDonationInput) => void;
  onClose: () => void;
};

function personMeta(person: Person): string {
  return [
    person.generation != null ? UI.GENERATION_SHORT(person.generation) : null,
    person.branch != null ? getBranchLabel(person.branch) : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

function KindTag({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 active:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

export default function EventDonationFormSheet({ initial, persons, onSubmit, onClose }: Props) {
  const [donorName, setDonorName] = useState(initial?.donorName ?? '');
  const [personId, setPersonId] = useState<number | null>(initial?.personId ?? null);
  const [kind, setKind] = useState<DonationKind>(initial?.kind ?? 'MONEY');
  const [amount, setAmount] = useState(initial?.kind !== 'IN_KIND' && initial?.amount ? String(initial.amount) : '');
  const [itemDescription, setItemDescription] = useState(initial?.itemDescription ?? '');
  const [note, setNote] = useState(initial?.note ?? '');
  const [query, setQuery] = useState('');

  const selectedPerson = useMemo(
    () => (personId != null ? persons.find((p) => p.id === personId) ?? null : null),
    [personId, persons],
  );

  const results = useMemo(() => filterPersonsByName(persons, query), [persons, query]);

  const selectMember = (person: Person) => {
    setPersonId(person.id);
    setDonorName(person.fullName);
    setQuery('');
  };

  const clearMember = () => {
    setPersonId(null);
  };

  const handleSubmit = () => {
    if (!donorName.trim()) {
      alert(UI.EVENT_DONATION_NAME_REQUIRED);
      return;
    }
    if (kind === 'IN_KIND' && !itemDescription.trim()) {
      alert(UI.EVENT_DONATION_ITEM_REQUIRED);
      return;
    }

    const parsedAmount = Number.parseInt(amount, 10);
    onSubmit({
      donorName: donorName.trim(),
      personId,
      kind,
      amount: kind === 'MONEY' ? (Number.isNaN(parsedAmount) ? 0 : parsedAmount) : 0,
      itemDescription: kind === 'IN_KIND' ? itemDescription.trim() : undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <FullScreenSheet
      title={initial ? UI.EVENT_DONATION_EDIT : UI.EVENT_DONATION_ADD}
      onClose={onClose}
      tone="book"
      headerRight={<IconRoundButton icon="check" variant="gold" label={UI.EVENT_DONATION_FORM_DONE} onClick={handleSubmit} />}
    >
      <div className={LAYOUT.pagePad}>
        <div className="space-y-4 rounded-2xl bg-white p-4 text-slate-900 shadow-sm">
          <FormField label={UI.EVENT_DONATION_KIND_LABEL}>
            <div className="flex gap-2">
              <KindTag
                active={kind === 'MONEY'}
                label={UI.EVENT_DONATION_KIND_MONEY}
                onClick={() => setKind('MONEY')}
              />
              <KindTag
                active={kind === 'IN_KIND'}
                label={UI.EVENT_DONATION_KIND_IN_KIND}
                onClick={() => setKind('IN_KIND')}
              />
            </div>
          </FormField>

          <FormField label={UI.EVENT_DONATION_PICK_MEMBER}>
            {selectedPerson ? (
              <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-600 text-sm font-semibold text-white">
                  {selectedPerson.fullName.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{selectedPerson.fullName}</p>
                  {personMeta(selectedPerson) ? (
                    <p className="truncate text-xs text-slate-500">{personMeta(selectedPerson)}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={clearMember}
                  className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-slate-500 active:bg-white"
                >
                  {UI.EVENT_DONATION_CLEAR_MEMBER}
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Icon
                    path="search"
                    size={18}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    pointer={false}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={UI.EVENT_DONATION_SEARCH_MEMBER}
                    className={`${inputClassName} pl-10`}
                  />
                </div>
                {results.length > 0 ? (
                  <ul className={`scroll-list mt-2 max-h-56 divide-y divide-slate-100 rounded-xl border border-slate-200`}>
                    {results.map((person) => (
                      <li key={person.id}>
                        <button
                          type="button"
                          onClick={() => selectMember(person)}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left active:bg-amber-50"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-600 text-sm font-semibold text-white">
                            {person.fullName.charAt(0)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">{person.fullName}</p>
                            {personMeta(person) ? (
                              <p className="truncate text-xs text-slate-500">{personMeta(person)}</p>
                            ) : null}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : query.trim() ? (
                  <p className="mt-2 px-1 text-xs text-slate-400">{UI.NO_SEARCH_RESULTS}</p>
                ) : null}
              </>
            )}
          </FormField>

          <FormField label={selectedPerson ? UI.EVENT_DONATION_NAME_LABEL : UI.EVENT_DONATION_OR_MANUAL}>
            <input
              type="text"
              value={donorName}
              onChange={(e) => {
                setDonorName(e.target.value);
                if (personId != null) setPersonId(null);
              }}
              placeholder={UI.EVENT_DONATION_NAME_PLACEHOLDER}
              className={inputClassName}
            />
          </FormField>

          {kind === 'MONEY' ? (
            <FormField label={UI.EVENT_DONATION_AMOUNT_LABEL}>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))}
                placeholder={UI.EVENT_AMOUNT_PLACEHOLDER}
                className={inputClassName}
              />
            </FormField>
          ) : (
            <FormField label={UI.EVENT_DONATION_ITEM_LABEL}>
              <input
                type="text"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder={UI.EVENT_DONATION_ITEM_PLACEHOLDER}
                className={inputClassName}
              />
            </FormField>
          )}

          <FormField label={UI.EVENT_DONATION_NOTE_LABEL}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={UI.EVENT_DONATION_NOTE_PLACEHOLDER}
              className={textareaClassName}
            />
          </FormField>
        </div>
      </div>
    </FullScreenSheet>
  );
}
