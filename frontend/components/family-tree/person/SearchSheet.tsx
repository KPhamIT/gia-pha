'use client';

import type { Person, Relationship } from '@/components/types/family-tree-types';
import BottomSheet from '@/components/ui/BottomSheet';
import Icon from '@/components/icons/Icon';
import { getBranchLabel } from '@/lib/constants/branches';
import { LAYOUT } from '@/lib/constants/ui-layout';
import { UI } from '@/lib/constants/ui-strings';
import { extractPersonRelationships } from '@/utils/person-relationships';
import { useMemo, useState } from 'react';

type SearchSheetProps = {
  persons: Person[];
  relationships: Relationship[];
  onClose: () => void;
  onSelect: (person: Person) => void;
};

function searchPersonSubtitle(person: Person, relationships: Relationship[]): string | null {
  const { father, mother } = extractPersonRelationships(person.id, relationships);
  const parts = [
    person.generation != null ? UI.GENERATION_SHORT(person.generation) : null,
    person.branch != null ? getBranchLabel(person.branch) : null,
    father ? `${UI.FATHER}: ${father.fullName}` : null,
    mother ? `${UI.MOTHER}: ${mother.fullName}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : null;
}

export default function SearchSheet({ persons, relationships, onClose, onSelect }: SearchSheetProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return persons.filter((person) => person.fullName.toLowerCase().includes(normalized)).slice(0, 20);
  }, [persons, query]);

  return (
    <BottomSheet onClose={onClose} variant="search">
      <div className={`flex shrink-0 items-center gap-3 border-b border-slate-200 ${LAYOUT.pagePad} pb-3 min-w-0`}>
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
        {results.map((person) => {
          const subtitle = searchPersonSubtitle(person, relationships);
          return (
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
                {subtitle ? (
                  <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-500">{subtitle}</p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
