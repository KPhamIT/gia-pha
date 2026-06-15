'use client';

import type { Person } from '@/components/types/family-tree-types';
import BottomSheet from '@/components/ui/BottomSheet';
import Icon from '@/components/icons/Icon';
import { LAYOUT } from '@/lib/constants/ui-layout';
import { UI } from '@/lib/constants/ui-strings';
import { useMemo, useState } from 'react';

type SearchSheetProps = {
  persons: Person[];
  onClose: () => void;
  onSelect: (person: Person) => void;
};

export default function SearchSheet({ persons, onClose, onSelect }: SearchSheetProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return persons.filter((person) => person.fullName.toLowerCase().includes(normalized)).slice(0, 20);
  }, [persons, query]);

  return (
    <BottomSheet onClose={onClose} variant="search">
      <div className={`flex shrink-0 items-center gap-3 border-b border-slate-200 ${LAYOUT.pagePad} pb-3`}>
        <div className="relative min-w-0 flex-1">
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
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={UI.SEARCH_PLACEHOLDER}
            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-slate-600 active:bg-slate-100 md:hover:bg-slate-100"
        >
          {UI.CANCEL}
        </button>
      </div>

      <div className={`${LAYOUT.scrollList} min-h-0 flex-1 px-2 py-2`}>
        {query.trim() && results.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-slate-500">{UI.NO_SEARCH_RESULTS}</p>
        ) : null}
        {results.map((person) => (
          <button
            key={person.id}
            type="button"
            onClick={() => onSelect(person)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left active:bg-slate-100 md:hover:bg-slate-50"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
              {person.fullName.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">{person.fullName}</p>
              {person.generation != null ? (
                <p className="text-xs text-slate-500">Đời thứ {person.generation}</p>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
