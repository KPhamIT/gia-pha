'use client';

import { useMemo, useState } from 'react';
import BookShell from '@/components/ui/BookShell';
import IconRoundButton from '@/components/ui/IconRoundButton';
import Icon from '@/components/icons/Icon';
import { LAYOUT } from '@/lib/constants/ui-layout';
import { BT } from '@/lib/constants/ui-theme';
import { UI } from '@/lib/constants/ui-strings';
import type { Person } from '@/components/types/family-tree-types';
import type { BookPageConfig } from './book-page-config';
import BookPageRow from './BookPageRow';

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

/**
 * Full-screen table to toggle page visibility and set display order.
 * Edits stay in a local draft and are persisted in a single batch when the
 * user taps save — so per-row clicks never trigger the debounced settings API.
 */
export default function BookPagesManager({ persons, pageConfig, onChange, onClose }: Props) {
  const [draft, setDraft] = useState<BookPageConfig>(pageConfig);

  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(pageConfig), [draft, pageConfig]);
  const visibleCount = useMemo(() => persons.filter((p) => !draft[p.id]?.hidden).length, [persons, draft]);

  const toggleHidden = (id: number) => {
    setDraft((prev) => {
      const hidden = prev[id]?.hidden ? undefined : true;
      return pruneEntry({ ...prev, [id]: { ...prev[id], hidden } }, id);
    });
  };

  const setOrder = (id: number, raw: string) => {
    const trimmed = raw.trim();
    const parsed = Number.parseInt(trimmed, 10);
    const order = trimmed === '' || Number.isNaN(parsed) ? undefined : parsed;
    setDraft((prev) => pruneEntry({ ...prev, [id]: { ...prev[id], order } }, id));
  };

  const showAll = () => {
    setDraft((prev) => {
      let next = { ...prev };
      for (const p of persons) {
        if (next[p.id]?.hidden) next = pruneEntry({ ...next, [p.id]: { ...next[p.id], hidden: undefined } }, p.id);
      }
      return next;
    });
  };

  const resetOrder = () => {
    setDraft((prev) => {
      let next = { ...prev };
      for (const p of persons) {
        if (next[p.id]?.order !== undefined) next = pruneEntry({ ...next, [p.id]: { ...next[p.id], order: undefined } }, p.id);
      }
      return next;
    });
  };

  const handleSave = () => {
    if (isDirty) onChange(draft);
    onClose();
  };

  const handleClose = () => {
    if (isDirty && !window.confirm(UI.BOOK_PAGES_DISCARD_CONFIRM)) return;
    onClose();
  };

  return (
    <BookShell zClass="z-[60]">
      <header className={`${LAYOUT.sheetHeader} ${LAYOUT.sheetHeaderBook}`}>
        <button
          type="button"
          onClick={handleClose}
          className="grid h-10 w-10 place-items-center rounded-full active:bg-white/10 md:hover:bg-white/10"
          aria-label={UI.CANCEL}
        >
          <Icon path="arrowLeft" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold md:text-xl">{UI.BOOK_PAGES_TITLE}</h1>
          <p className="truncate text-xs text-amber-100/70">{UI.BOOK_PAGES_VISIBLE_COUNT(visibleCount, persons.length)}</p>
        </div>
        <IconRoundButton
          icon="save"
          variant="gold"
          label={UI.SAVE}
          disabled={!isDirty}
          onClick={handleSave}
        />
      </header>

      <div className={`${LAYOUT.sheetBody} px-3 md:px-6`}>
        <div className="mx-auto max-w-2xl pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs text-amber-100/70">{UI.BOOK_PAGES_HINT}</p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={showAll}
                className={BT.pillOnDark}
              >
                {UI.BOOK_PAGES_SHOW_ALL}
              </button>
              <button
                type="button"
                onClick={resetOrder}
                className={BT.pillOnDark}
              >
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
                {persons.map((person, naturalIndex) => (
                  <BookPageRow
                    key={person.id}
                    person={person}
                    naturalIndex={naturalIndex}
                    hidden={!!draft[person.id]?.hidden}
                    orderValue={draft[person.id]?.order}
                    onToggleHidden={toggleHidden}
                    onSetOrder={setOrder}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </BookShell>
  );
}
