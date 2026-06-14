'use client';

import { useMemo, useState } from 'react';
import FullScreenSheet from '@/components/ui/FullScreenSheet';
import { FormField, inputClassName, textareaClassName } from '@/components/ui/CollapsibleSection';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';
import { getBranchLabel } from '@/lib/constants/branches';
import type { Person } from '@/components/types/family-tree-types';
import type { CreateDonationInput, EventDonation } from '@/components/types/event-types';

type Props = {
  initial?: EventDonation | null;
  persons: Person[];
  saving: boolean;
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

export default function EventDonationFormSheet({ initial, persons, saving, onSubmit, onClose }: Props) {
  const [donorName, setDonorName] = useState(initial?.donorName ?? '');
  const [personId, setPersonId] = useState<number | null>(initial?.personId ?? null);
  const [amount, setAmount] = useState(initial?.amount ? String(initial.amount) : '');
  const [note, setNote] = useState(initial?.note ?? '');
  const [query, setQuery] = useState('');

  const selectedPerson = useMemo(
    () => (personId != null ? persons.find((p) => p.id === personId) ?? null : null),
    [personId, persons],
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return persons.filter((p) => p.fullName.toLowerCase().includes(normalized)).slice(0, 20);
  }, [persons, query]);

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
    const parsedAmount = Number.parseInt(amount, 10);
    onSubmit({
      donorName: donorName.trim(),
      personId,
      amount: Number.isNaN(parsedAmount) ? 0 : parsedAmount,
      note: note.trim() || undefined,
    });
  };

  return (
    <FullScreenSheet title={initial ? UI.EVENT_DONATION_EDIT : UI.EVENT_DONATION_ADD} onClose={onClose} tone="book">
      <div className="relative p-4">
        {saving ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <LoadingSpinner size={36} label={UI.SAVING} />
          </div>
        ) : null}

        <div className="space-y-4 rounded-2xl bg-white p-4 text-slate-900 shadow-sm">
        <FormField label={UI.EVENT_DONATION_PICK_MEMBER}>
          {selectedPerson ? (
            <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white">
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
                disabled={saving}
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
                  disabled={saving}
                />
              </div>
              {results.length > 0 ? (
                <ul className="mt-2 max-h-56 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200">
                  {results.map((person) => (
                    <li key={person.id}>
                      <button
                        type="button"
                        onClick={() => selectMember(person)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left active:bg-slate-50"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                          {person.fullName.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">{person.fullName}</p>
                          {personMeta(person) ? <p className="truncate text-xs text-slate-500">{personMeta(person)}</p> : null}
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
              // Typing a custom name detaches the member link.
              if (personId != null) setPersonId(null);
            }}
            placeholder={UI.EVENT_DONATION_NAME_PLACEHOLDER}
            className={inputClassName}
            disabled={saving}
          />
        </FormField>

        <FormField label={UI.EVENT_DONATION_AMOUNT_LABEL}>
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))}
            placeholder={UI.EVENT_AMOUNT_PLACEHOLDER}
            className={inputClassName}
            disabled={saving}
          />
        </FormField>

        <FormField label={UI.EVENT_DONATION_NOTE_LABEL}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={UI.EVENT_DONATION_NOTE_PLACEHOLDER}
            className={textareaClassName}
            disabled={saving}
          />
        </FormField>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="mt-2 flex w-full items-center justify-center rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white active:bg-blue-700 disabled:opacity-50"
        >
          {UI.EVENT_SAVE}
        </button>
        </div>
      </div>
    </FullScreenSheet>
  );
}
