'use client';

import { useCallback, useMemo, useState } from 'react';
import OverlayPortal from '@/components/ui/OverlayPortal';
import { useOverlayViewport } from '@/hooks/useOverlayViewport';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import type { Person } from '@/components/types/family-tree-types';
import BookPersonSearch from './BookPersonSearch';
import BookStyleControls from './BookStyleControls';
import BookPagesManager from './BookPagesManager';
import BookViewerHeader from './BookViewerHeader';
import BookViewerFallback from './BookViewerFallback';
import BookStage from './BookStage';
import { useGenealogyBook } from './useGenealogyBook';
import styles from './GenealogyBook.module.css';

type GenealogyBookViewerProps = {
  persons: Person[];
  onClose: () => void;
};

export default function GenealogyBookViewer({ persons, onClose }: GenealogyBookViewerProps) {
  const { requireFeature, canUseFeature } = useFeatureAccess();
  const [showStyle, setShowStyle] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  useOverlayViewport();
  const book = useGenealogyBook(persons);
  const { hydrated, settings, updateSettings, isPrintAllLayout, viewerRootRef, ctx } = book;

  const guardedUpdateSettings = useCallback(
    (patch: Parameters<typeof updateSettings>[0]) => {
      if (!requireFeature('editBook')) return;
      updateSettings(patch);
    },
    [requireFeature, updateSettings],
  );

  const guardedCtx = useMemo(
    () => ({ ...ctx, updateSettings: guardedUpdateSettings }),
    [ctx, guardedUpdateSettings],
  );

  if (!hydrated) return <BookViewerFallback kind="loading" onClose={onClose} />;

  return (
    <OverlayPortal>
      <div
        ref={viewerRootRef}
        className={`${styles.viewerRoot} ${isPrintAllLayout ? styles.printAllMode : ''} fixed inset-0 z-50 flex h-dvh w-full flex-col bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50`}
      >
      <BookViewerHeader
        pageIndex={book.pageIndex}
        totalLeaves={book.totalLeaves}
        onClose={onClose}
        onToggleStyle={() => setShowStyle((v) => !v)}
        onOpenSearch={() => setShowSearch(true)}
        onOpenPages={() => setShowPages(true)}
        onPrint={book.handlePrint}
        onPrintAll={() => void book.handlePrintAll()}
        canEditBook={canUseFeature('editBook')}
      />

      {showStyle ? (
        <BookStyleControls settings={settings} onChange={guardedUpdateSettings} onClose={() => setShowStyle(false)} />
      ) : null}

      {showSearch ? (
        <BookPersonSearch
          persons={book.visiblePersons}
          onClose={() => setShowSearch(false)}
          onSelect={(person) => book.jumpToPerson(person.id)}
        />
      ) : null}

      {showPages ? (
        <BookPagesManager
          persons={book.sortedPersons}
          pageConfig={settings.pageConfig}
          onChange={(pageConfig) => guardedUpdateSettings({ pageConfig })}
          onClose={() => setShowPages(false)}
        />
      ) : null}

      <BookStage
        ctx={guardedCtx}
        leaves={book.leaves}
        pageIndex={book.pageIndex}
        totalLeaves={book.totalLeaves}
        flip={book.flip}
        baseIndex={book.baseIndex}
        frontIndex={book.frontIndex}
        isPrintAllLayout={isPrintAllLayout}
        goToPage={book.goToPage}
        onTouchStart={book.handleTouchStart}
        onTouchEnd={book.handleTouchEnd}
      />
      </div>
    </OverlayPortal>
  );
}
