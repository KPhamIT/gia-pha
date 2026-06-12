'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Person, PersonDetail } from '@/components/types/family-tree-types';
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
import styles from './GenealogyBook.module.css';

type FlipDirection = 'next' | 'prev' | null;

type PrintAllPage = {
  personId: number;
  pageNumber: number;
  detail: PersonDetail;
  draft: BookPageDraft;
};

type GenealogyBookViewerProps = {
  persons: Person[];
  onClose: () => void;
  onPersonUpdated: (person: Person) => void;
};

export default function GenealogyBookViewer({ persons, onClose, onPersonUpdated }: GenealogyBookViewerProps) {
  const sortedPersons = useMemo(() => sortPersonsForBook(persons), [persons]);
  const [pageIndex, setPageIndex] = useState(0);
  const [flip, setFlip] = useState<FlipDirection>(null);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<BookPageDraft>(buildBookPageDraft(null));
  const [savedSnapshot, setSavedSnapshot] = useState<BookPageDraft>(buildBookPageDraft(null));

  const [isPrintAllLayout, setIsPrintAllLayout] = useState(false);
  const [printAllPages, setPrintAllPages] = useState<PrintAllPage[]>([]);

  const draftCache = useRef<Map<number, BookPageDraft>>(new Map());
  const touchStartX = useRef<number | null>(null);
  const viewerRootRef = useRef<HTMLDivElement>(null);

  const { details, status, loadAll, updateDetail } = usePersonDetailStore();

  const currentPerson = sortedPersons[pageIndex];
  const totalPages = sortedPersons.length;
  const currentDetail = currentPerson ? (details[currentPerson.id] ?? null) : null;

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(savedSnapshot),
    [draft, savedSnapshot],
  );

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (status !== 'loaded' || !currentPerson) return;
    const cachedDraft = draftCache.current.get(currentPerson.id);
    if (cachedDraft) {
      setDraft(cachedDraft);
      setSavedSnapshot(buildBookPageDraft(currentDetail));
    } else {
      const initial = buildBookPageDraft(currentDetail);
      setDraft(initial);
      setSavedSnapshot(initial);
    }
  }, [currentPerson, currentDetail, status]);

  const cacheCurrentDraft = useCallback(() => {
    if (!currentPerson || !isDirty) return;
    draftCache.current.set(currentPerson.id, draft);
  }, [currentPerson, draft, isDirty]);

  const goToPage = useCallback(
    (direction: 'next' | 'prev') => {
      if (flip) return;
      const nextIndex = direction === 'next' ? pageIndex + 1 : pageIndex - 1;
      if (nextIndex < 0 || nextIndex >= totalPages) return;

      cacheCurrentDraft();
      setFlip(direction);
      window.setTimeout(() => {
        setPageIndex(nextIndex);
        setFlip(null);
      }, 550);
    },
    [cacheCurrentDraft, flip, pageIndex, totalPages],
  );

  const handleDraftChange = (nextDraft: BookPageDraft) => {
    setDraft(nextDraft);
    if (currentPerson) {
      draftCache.current.set(currentPerson.id, nextDraft);
    }
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
      draftCache.current.delete(currentPerson.id);
      onPersonUpdated(updated.person);
    } finally {
      setSaving(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  useEffect(() => {
    const resetPrintAll = () => {
      const root = viewerRootRef.current;
      root?.classList.remove(styles.printPreparing);
      resetGenealogyPrintFit(root);
      setIsPrintAllLayout(false);
      setPrintAllPages([]);
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
    setPrintAllPages([]);
    void triggerPrint(false);
  };

  const handlePrintAll = async () => {
    cacheCurrentDraft();

    const pages: PrintAllPage[] = sortedPersons.map((person, index) => {
      const nextDetail = details[person.id];
      const cached = draftCache.current.get(person.id);
      return {
        personId: person.id,
        pageNumber: index + 1,
        detail: nextDetail,
        draft: cached ?? buildBookPageDraft(nextDetail),
      };
    });

    flushSync(() => {
      setPrintAllPages(pages);
      setIsPrintAllLayout(true);
    });

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    await triggerPrint(true);
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

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-amber-950/95 text-amber-50">
        <LoadingSpinner size={32} label={UI.LOADING} />
      </div>
    );
  }

  if (status === 'error' || !currentPerson) {
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
        <p className="px-4 text-sm text-amber-100/80">{status === 'error' ? UI.ERROR_TITLE : UI.NO_DATA}</p>
      </div>
    );
  }

  const flipClass = flip === 'next' ? styles.pageFlipNext : flip === 'prev' ? styles.pageFlipPrev : '';

  return (
    <div
      ref={viewerRootRef}
      className={`${styles.viewerRoot} ${isPrintAllLayout ? styles.printAllMode : ''} fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50`}
    >
      <header
        className={`${styles.noPrint} flex shrink-0 items-center gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]`}
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
          disabled={saving || totalPages === 0}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full active:bg-white/10 disabled:opacity-40"
          aria-label={UI.BOOK_PRINT_ALL}
        >
          <Icon path="printAll" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
        <span className="shrink-0 text-sm text-amber-100/80">
          {UI.BOOK_PAGE_OF(pageIndex + 1, totalPages)}
        </span>
      </header>

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
          disabled={pageIndex >= totalPages - 1 || flip !== null}
          className={`${styles.noPrint} absolute right-1 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/20 text-white backdrop-blur-sm active:bg-black/30 disabled:opacity-30`}
          aria-label={UI.BOOK_NEXT_PAGE}
        >
          <Icon path="chevronRight" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>

        <div className={`${styles.printCurrentArea} ${styles.scene} h-full`}>
          <div className={styles.sheet}>
            <div className={`${styles.page} ${flipClass}`}>
              <GenealogyBookPage
                pageNumber={pageIndex + 1}
                totalPages={totalPages}
                detail={currentDetail}
                loading={false}
                draft={draft}
                isDirty={isDirty}
                saving={saving}
                onDraftChange={handleDraftChange}
                onSave={() => void handleSave()}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={styles.printAllStack}
        aria-hidden={!isPrintAllLayout}
        data-print-all-stack
      >
        {printAllPages.map((page) => (
          <div key={page.personId} className={styles.printAllPage}>
            <GenealogyBookPage
              pageNumber={page.pageNumber}
              totalPages={totalPages}
              detail={page.detail}
              loading={false}
              draft={page.draft}
              readOnly
            />
          </div>
        ))}
      </div>
    </div>
  );
}
