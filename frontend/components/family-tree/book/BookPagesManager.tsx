'use client';

import { useMemo } from 'react';
import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';
import type { Person } from '@/components/types/family-tree-types';
import type { BookPageConfig } from './book-page-config';
import styles from './GenealogyBook.module.css';

type Props = {
  /** All persons in natural book order (including hidden ones). */
  persons: Person[];
  pageConfig: BookPageConfig;
  onChange: (pageConfig: BookPageConfig) => void;
  onClose: () => void;
};

/** Remove the entry when it no longer carries any override. */
function pruneEntry(config: BookPageConfig, id: number): BookPageConfig {
  const next = { ...config };
  const entry = next[id];
  if (entry && !entry.hidden && entry.order === undefined) delete next[id];
  return next;
}

/** Full-screen table to toggle page visibility and set display order. */
export default function BookPagesManager({ persons, pageConfig, onChange, onClose }: Props) {
  const visibleCount = useMemo(
    () => persons.filter((p) => !pageConfig[p.id]?.hidden).length,
    [persons, pageConfig],
  );

  const toggleHidden = (id: number) => {
    const hidden = pageConfig[id]?.hidden ? undefined : true;
    const next: BookPageConfig = { ...pageConfig, [id]: { ...pageConfig[id], hidden } };
    onChange(pruneEntry(next, id));
  };

  const setOrder = (id: number, raw: string) => {
    const trimmed = raw.trim();
    const parsed = Number.parseInt(trimmed, 10);
    const order = trimmed === '' || Number.isNaN(parsed) ? undefined : parsed;
    const next: BookPageConfig = { ...pageConfig, [id]: { ...pageConfig[id], order } };
    onChange(pruneEntry(next, id));
  };

  const showAll = () => {
    let next: BookPageConfig = { ...pageConfig };
    for (const p of persons) {
      if (next[p.id]?.hidden) {
        next = { ...next, [p.id]: { ...next[p.id], hidden: undefined } };
        next = pruneEntry(next, p.id);
      }
    }
    onChange(next);
  };

  const resetOrder = () => {
    let next: BookPageConfig = { ...pageConfig };
    for (const p of persons) {
      if (next[p.id]?.order !== undefined) {
        next = { ...next, [p.id]: { ...next[p.id], order: undefined } };
        next = pruneEntry(next, p.id);
      }
    }
    onChange(next);
  };

  return (
    <div className={`${styles.viewerRoot} fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50`}>
      <header className="flex shrink-0 items-center gap-2 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full active:bg-white/10" aria-label={UI.CANCEL}>
          <Icon path="arrowLeft" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold">{UI.BOOK_PAGES_TITLE}</h1>
          <p className="truncate text-xs text-amber-100/70">{UI.BOOK_PAGES_VISIBLE_COUNT(visibleCount, persons.length)}</p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-2xl">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs text-amber-100/70">{UI.BOOK_PAGES_HINT}</p>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={showAll} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium active:bg-white/20">
                {UI.BOOK_PAGES_SHOW_ALL}
              </button>
              <button type="button" onClick={resetOrder} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium active:bg-white/20">
                {UI.BOOK_PAGES_RESET_ORDER}
              </button>
            </div>
          </div>

          {persons.length === 0 ? (
            <p className="rounded-xl bg-white/5 px-4 py-10 text-center text-sm text-amber-100/70">{UI.BOOK_PAGES_EMPTY}</p>
          ) : (
            <table className="w-full overflow-hidden rounded-xl bg-white text-slate-800">
              <thead>
                <tr className="bg-amber-100/90 text-left text-xs font-semibold uppercase tracking-wide text-amber-900">
                  <th className="w-16 px-3 py-2.5 text-center">{UI.BOOK_PAGES_COL_ORDER}</th>
                  <th className="px-3 py-2.5">{UI.BOOK_PAGES_COL_NAME}</th>
                  <th className="w-20 px-3 py-2.5 text-center">{UI.BOOK_PAGES_COL_SHOW}</th>
                </tr>
              </thead>
              <tbody>
                {persons.map((person, naturalIndex) => {
                  const entry = pageConfig[person.id];
                  const hidden = !!entry?.hidden;
                  const orderValue = entry?.order;
                  const meta = [
                    person.branch != null ? `${UI.BOOK_BRANCH} ${person.branch}` : null,
                    person.generation != null ? `${UI.BOOK_GENERATION} ${person.generation}` : null,
                  ].filter(Boolean).join(' · ');

                  return (
                    <tr
                      key={person.id}
                      onClick={() => toggleHidden(person.id)}
                      className={`cursor-pointer border-t border-amber-100 transition-colors ${hidden ? 'bg-slate-100 text-slate-400' : 'active:bg-amber-50'}`}
                    >
                      <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={orderValue ?? ''}
                          placeholder={String(naturalIndex + 1)}
                          onChange={(e) => setOrder(person.id, e.target.value)}
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
                          onChange={() => toggleHidden(person.id)}
                          className="h-5 w-5 cursor-pointer accent-amber-600"
                          aria-label={UI.BOOK_PAGES_COL_SHOW}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
