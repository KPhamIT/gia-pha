'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/icons/Icon';
import { inputClassName } from '@/components/ui/CollapsibleSection';
import { UI } from '@/lib/constants/ui-strings';
import type { Person } from '@/components/types/family-tree-types';
import { filterPersonsByName } from '@/utils/person-search';
import { personMeta } from './event-contribution-utils';

type Props = {
  persons: Person[];
  selectedPerson: Person | null;
  onSelect: (person: Person) => void;
  onClear: () => void;
};

export default function DonationMemberPicker({ persons, selectedPerson, onSelect, onClear }: Props) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => filterPersonsByName(persons, query), [persons, query]);

  if (selectedPerson) {
    return (
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
          onClick={onClear}
          className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-slate-500 active:bg-white"
        >
          {UI.EVENT_DONATION_CLEAR_MEMBER}
        </button>
      </div>
    );
  }

  return (
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
        <ul className="scroll-list mt-2 max-h-56 divide-y divide-slate-100 rounded-xl border border-slate-200">
          {results.map((person) => (
            <li key={person.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(person);
                  setQuery('');
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left active:bg-amber-50"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-600 text-sm font-semibold text-white">
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
  );
}
