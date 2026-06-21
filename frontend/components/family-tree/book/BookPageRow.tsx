'use client';

import { getBranchLabel } from '@/lib/constants/branches';
import { UI } from '@/lib/constants/ui-strings';
import type { Person } from '@/components/types/family-tree-types';

type Props = {
  person: Person;
  naturalIndex: number;
  hidden: boolean;
  orderValue?: number;
  onToggleHidden: (id: number) => void;
  onSetOrder: (id: number, raw: string) => void;
};

export default function BookPageRow({ person, naturalIndex, hidden, orderValue, onToggleHidden, onSetOrder }: Props) {
  const meta = [
    person.branch != null ? getBranchLabel(person.branch) : null,
    person.generation != null ? `${UI.BOOK_GENERATION} ${person.generation}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <tr
      onClick={() => onToggleHidden(person.id)}
      className={`cursor-pointer border-t border-amber-100 transition-colors ${
        hidden ? 'bg-slate-100 text-slate-400' : 'active:bg-amber-50 md:hover:bg-amber-50/80'
      }`}
    >
      <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          inputMode="numeric"
          value={orderValue ?? ''}
          placeholder={String(naturalIndex + 1)}
          onChange={(e) => onSetOrder(person.id, e.target.value)}
          className="w-12 rounded-md border border-amber-300/70 bg-amber-50/60 px-1 py-1 text-center text-sm outline-none focus:border-amber-500"
        />
      </td>
      <td className="px-3 py-2">
        <span className={`block truncate font-medium ${hidden ? 'line-through' : ''}`}>
          {person.fullName?.trim() || UI.BOOK_EMPTY_FIELD}
        </span>
        {meta ? <span className="block truncate text-xs text-slate-400">{meta}</span> : null}
      </td>
      <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={!hidden}
          onChange={() => onToggleHidden(person.id)}
          className="h-5 w-5 cursor-pointer accent-amber-600"
          aria-label={UI.BOOK_PAGES_COL_SHOW}
        />
      </td>
    </tr>
  );
}
