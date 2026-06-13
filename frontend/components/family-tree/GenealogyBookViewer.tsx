'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Person } from '@/components/types/family-tree-types';
import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { updatePersonDetail } from '@/lib/family-tree/mutations';
import { UI } from '@/lib/constants/ui-strings';
import { fitGenealogyPagesForPrint, resetGenealogyPrintFit } from '@/utils/fit-genealogy-print';
import { sortPersonsForBook } from '@/utils/sort-persons-for-book';
import { usePersonDetailStore } from '@/store/personDetailStore';
import GenealogyBookPage, {
  buildBookPageDraft,
  draftToUpdateInput,
  type BookPageDraft,
} from './GenealogyBookPage';
import BookCoverPage from './book/BookCoverPage';
import BookPrefacePage from './book/BookPrefacePage';
import BookStyleControls from './book/BookStyleControls';
import { useBookSettings } from './book/useBookSettings';
import { getBorderStyle } from './book/page-border-styles';
import styles from './GenealogyBook.module.css';

type FlipState = { dir: 'next' | 'prev'; from: number; to: number };

type Leaf =
  | { kind: 'cover' }
  | { kind: 'preface' }
  | { kind: 'person'; person: Person; personIndex: number };

const FLIP_MS = 950;

type GenealogyBookViewerProps = {
  persons: Person[];
  onClose: () => void;
  onPersonUpdated: (person: Person) => void;
};

export default function GenealogyBookViewer({ persons, onClose, onPersonUpdated }: GenealogyBookViewerProps) {
  const sortedPersons = useMemo(() => sortPersonsForBook(persons), [persons]);
  const leaves = useMemo<Leaf[]>(
    () => [
      { kind: 'cover' },
      { kind: 'preface' },
      ...sortedPersons.map((person, personIndex) => ({ kind: 'person' as const, person, personIndex })),
    ],
    [sortedPersons],
  );
  const totalLeaves = leaves.length;
  const personCount = sortedPersons.length;

  const [pageIndex, setPageIndex] = useState(0);
  const [flip, setFlip] = useState<FlipState | null>(null);
  const [saving, setSaving] = useState(false);
  const [showStyle, setShowStyle] = useState(false);
  const [draft, setDraft] = useState<BookPageDraft>(buildBookPageDraft(null));
  const [savedSnapshot, setSavedSnapshot] = useState<BookPageDraft>(buildBookPageDraft(null));
  const [isPrintAllLayout, setIsPrintAllLayout] = useState(false);

  // Unsaved person-page edits, keyed by person id. State (not a ref) so reads
  // during render — flip leaves & print-all — stay safe.
  const [draftCache, setDraftCache] = useState<Record<number, BookPageDraft>>({});
  const loadedPersonId = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const viewerRootRef = useRef<HTMLDivElement>(null);

  const { details, status, loadAll, updateDetail } = usePersonDetailStore();
  const { settings, updateSettings } = useBookSettings();

  const currentLeaf = leaves[pageIndex];
  const currentPerson = currentLeaf?.kind === 'person' ? currentLeaf.person : null;
  const currentDetail = currentPerson ? (details[currentPerson.id] ?? null) : null;

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(savedSnapshot),
    [draft, savedSnapshot],
  );

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  // Load the draft for a person page only when the page actually changes, so
  // caching the current draft (which updates draftCache) doesn't clobber edits.
  useEffect(() => {
    if (status !== 'loaded' || !currentPerson) return;
    if (loadedPersonId.current === currentPerson.id) return;
    loadedPersonId.current = currentPerson.id;
    // Sync the editable draft to the page we just landed on.
    /* eslint-disable react-hooks/set-state-in-effect */
    const cachedDraft = draftCache[currentPerson.id];
    if (cachedDraft) {
      setDraft(cachedDraft);
      setSavedSnapshot(buildBookPageDraft(currentDetail));
    } else {
      const initial = buildBookPageDraft(currentDetail);
      setDraft(initial);
      setSavedSnapshot(initial);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [currentPerson, currentDetail, status, draftCache]);

  const cacheCurrentDraft = useCallback(() => {
    if (!currentPerson || !isDirty) return;
    setDraftCache((prev) => ({ ...prev, [currentPerson.id]: draft }));
  }, [currentPerson, draft, isDirty]);

  const getPersonDraft = useCallback(
    (person: Person): BookPageDraft =>
      draftCache[person.id] ?? buildBookPageDraft(details[person.id] ?? null),
    [draftCache, details],
  );

  const goToPage = useCallback(
    (direction: 'next' | 'prev') => {
      if (flip) return;
      const nextIndex = direction === 'next' ? pageIndex + 1 : pageIndex - 1;
      if (nextIndex < 0 || nextIndex >= totalLeaves) return;

      cacheCurrentDraft();
      setFlip({ dir: direction, from: pageIndex, to: nextIndex });
      window.setTimeout(() => {
        setPageIndex(nextIndex);
        setFlip(null);
      }, FLIP_MS);
    },
    [cacheCurrentDraft, flip, pageIndex, totalLeaves],
  );

  const handleDraftChange = (nextDraft: BookPageDraft) => {
    setDraft(nextDraft);
  };

  const handleSave = async () => {
    if (!currentPerson || !isDirty || saving) return;

    setSaving(true);
    try {
      const updated = await updatePersonDetail(currentPerson.id, draftToUpdateInput(draft));
      updateDetail(currentPerson.id, updated);
      const saved = buildBookPageDraft(updated);
      setDraft(saved);
      setSavedSnapshot(saved);
      setDraftCache((prev) => {
        if (!(currentPerson.id in prev)) return prev;
        const next = { ...prev };
        delete next[currentPerson.id];
        return next;
      });
      onPersonUpdated(updated.person);
    } finally {
      setSaving(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartX.current;
    const endX = e.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX == null || endX == null) return;

    const delta = endX - startX;
    if (Math.abs(delta) < 48) return;
    if (delta < 0) goToPage('next');
    else goToPage('prev');
  };

  useEffect(() => {
    const resetPrintAll = () => {
      const root = viewerRootRef.current;
      root?.classList.remove(styles.printPreparing);
      resetGenealogyPrintFit(root);
      setIsPrintAllLayout(false);
    };
    window.addEventListener('afterprint', resetPrintAll);
    return () => window.removeEventListener('afterprint', resetPrintAll);
  }, []);

  const triggerPrint = async (printAll: boolean) => {
    const root = viewerRootRef.current;
    root?.classList.add(styles.printPreparing);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    if (printAll) {
      resetGenealogyPrintFit(root);
    } else {
      const scope = `.${styles.printCurrentArea} [data-genealogy-paper]`;
      fitGenealogyPagesForPrint(root, scope);
    }

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    window.print();
  };

  const handlePrint = () => {
    setIsPrintAllLayout(false);
    void triggerPrint(false);
  };

  const handlePrintAll = async () => {
    cacheCurrentDraft();
    flushSync(() => setIsPrintAllLayout(true));
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    await triggerPrint(true);
  };

  /** Renders any leaf by index. `live` = the editable current page. */
  const renderLeaf = useCallback(
    (index: number, opts: { readOnly: boolean; live?: boolean }) => {
      const leaf = leaves[index];
      if (!leaf) return null;

      if (leaf.kind === 'cover') {
        return <BookCoverPage settings={settings} readOnly={opts.readOnly} onChange={updateSettings} />;
      }

      if (leaf.kind === 'preface') {
        const Border = getBorderStyle(settings.borderStyleId).Component;
        return (
          <div className={`${styles.paper} relative`} data-genealogy-paper>
            <Border>
              <BookPrefacePage settings={settings} readOnly={opts.readOnly} onChange={updateSettings} />
            </Border>
          </div>
        );
      }

      const pageNumber = leaf.personIndex + 1;
      if (opts.live) {
        return (
          <GenealogyBookPage
            pageNumber={pageNumber}
            totalPages={personCount}
            detail={currentDetail}
            loading={false}
            draft={draft}
            borderStyleId={settings.borderStyleId}
            formStyleId={settings.formStyleId}
            isDirty={isDirty}
            saving={saving}
            onDraftChange={handleDraftChange}
            onSave={() => void handleSave()}
          />
        );
      }

      return (
        <GenealogyBookPage
          pageNumber={pageNumber}
          totalPages={personCount}
          detail={details[leaf.person.id] ?? null}
          loading={false}
          draft={getPersonDraft(leaf.person)}
          borderStyleId={settings.borderStyleId}
          formStyleId={settings.formStyleId}
          readOnly
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leaves, settings, details, draft, isDirty, saving, currentDetail, personCount, getPersonDraft],
  );

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-amber-950/95 text-amber-50">
        <LoadingSpinner size={32} label={UI.LOADING} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-amber-950/95 text-amber-50">
        <header className="flex items-center gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full active:bg-white/10"
            aria-label={UI.CANCEL}
          >
            <Icon path="arrowLeft" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
          </button>
          <h1 className="text-lg font-semibold">{UI.VIEW_GENEALOGY_BOOK}</h1>
        </header>
        <p className="px-4 text-sm text-amber-100/80">{UI.ERROR_TITLE}</p>
      </div>
    );
  }

  const baseIndex = flip ? (flip.dir === 'next' ? flip.to : flip.from) : pageIndex;
  const frontIndex = flip ? (flip.dir === 'next' ? flip.from : flip.to) : pageIndex;

  return (
    <div
      ref={viewerRootRef}
      className={`${styles.viewerRoot} ${isPrintAllLayout ? styles.printAllMode : ''} fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50`}
    >
      <header
        className={`${styles.noPrint} flex shrink-0 items-center gap-2 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]`}
      >
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full active:bg-white/10"
          aria-label={UI.CANCEL}
        >
          <Icon path="arrowLeft" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold">{UI.VIEW_GENEALOGY_BOOK}</h1>
          <p className="text-xs text-amber-100/70">{UI.BOOK_TAP_HINT}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowStyle((v) => !v)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full active:bg-white/10"
          aria-label={UI.BOOK_OPEN_STYLE}
        >
          <Icon path="settings" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
        <button
          type="button"
          onClick={handlePrint}
          disabled={saving}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full active:bg-white/10 disabled:opacity-40"
          aria-label={UI.BOOK_PRINT_PAGE}
        >
          <Icon path="print" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
        <button
          type="button"
          onClick={() => void handlePrintAll()}
          disabled={saving || totalLeaves === 0}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full active:bg-white/10 disabled:opacity-40"
          aria-label={UI.BOOK_PRINT_ALL}
        >
          <Icon path="printAll" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
        <span className="shrink-0 text-sm text-amber-100/80">
          {UI.BOOK_PAGE_OF(pageIndex + 1, totalLeaves)}
        </span>
      </header>

      {showStyle ? (
        <BookStyleControls settings={settings} onChange={updateSettings} onClose={() => setShowStyle(false)} />
      ) : null}

      <div
        className="relative min-h-0 flex-1 px-3 pb-3 md:px-4 md:pb-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={() => goToPage('prev')}
          disabled={pageIndex === 0 || flip !== null}
          className={`${styles.noPrint} absolute left-1 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/20 text-white backdrop-blur-sm active:bg-black/30 disabled:opacity-30`}
          aria-label={UI.BOOK_PREV_PAGE}
        >
          <Icon path="chevronLeft" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>

        <button
          type="button"
          onClick={() => goToPage('next')}
          disabled={pageIndex >= totalLeaves - 1 || flip !== null}
          className={`${styles.noPrint} absolute right-1 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/20 text-white backdrop-blur-sm active:bg-black/30 disabled:opacity-30`}
          aria-label={UI.BOOK_NEXT_PAGE}
        >
          <Icon path="chevronRight" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>

        <div className={`${styles.printCurrentArea} ${styles.scene} h-full`}>
          <div className={styles.sheet}>
            <div className={styles.page}>
              {flip
                ? renderLeaf(baseIndex, { readOnly: true })
                : renderLeaf(pageIndex, { readOnly: false, live: true })}

              {flip ? (
                <>
                  <div className={styles.flipUnderShade} aria-hidden />
                  <div
                    className={`${styles.flipLeaf} ${
                      flip.dir === 'next' ? styles.flipLeafNext : styles.flipLeafPrev
                    }`}
                    aria-hidden
                  >
                    <div className={styles.flipFace}>{renderLeaf(frontIndex, { readOnly: true })}</div>
                    <div className={`${styles.flipFace} ${styles.flipBack}`} />
                    <div className={styles.flipShadow} />
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.printAllStack} aria-hidden={!isPrintAllLayout} data-print-all-stack>
        {isPrintAllLayout
          ? leaves.map((leaf, index) => (
              <div
                key={leaf.kind === 'person' ? `p-${leaf.person.id}` : leaf.kind}
                className={styles.printAllPage}
              >
                {renderLeaf(index, { readOnly: true })}
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
