import type { PersonRelationships } from '@/components/types/family-tree-types';
import { UI } from '@/lib/constants/ui-strings';

function relationText(names: { fullName: string }[]): string {
  return names.length ? names.map((p) => p.fullName).join(', ') : UI.BOOK_EMPTY_FIELD;
}

/** Read-only relationships summary shared by the form styles. */
export default function RelationsBlock({ relations }: { relations: PersonRelationships | null }) {
  if (!relations) return null;
  return (
    <div className="border-b border-dashed border-amber-200/80 py-2.5">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-amber-800/70">
        {UI.RELATIONSHIPS}
      </p>
      <div className="space-y-1 text-sm text-slate-700">
        <p>
          <span className="text-amber-900/60">{UI.FATHER}: </span>
          {relations.father?.fullName ?? UI.BOOK_EMPTY_FIELD}
        </p>
        <p>
          <span className="text-amber-900/60">{UI.MOTHER}: </span>
          {relations.mother?.fullName ?? UI.BOOK_EMPTY_FIELD}
        </p>
        <p>
          <span className="text-amber-900/60">{UI.SPOUSE}: </span>
          {relationText(relations.spouses)}
        </p>
        <p>
          <span className="text-amber-900/60">{UI.CHILDREN}: </span>
          {relationText(relations.children)}
        </p>
      </div>
    </div>
  );
}
