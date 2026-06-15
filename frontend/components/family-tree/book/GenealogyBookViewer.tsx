'use client';

import { useState } from 'react';
import OverlayPortal from '@/components/ui/OverlayPortal';
import { useOverlayViewport } from '@/hooks/useOverlayViewport';
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
  const [showStyle, setShowStyle] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  useOverlayViewport();
  const book = useGenealogyBook(persons);
  const { hydrated, settings, updateSettings, isPrintAllLayout, viewerRootRef } = book;

  if (!hydrated) return <BookViewerFallback kind="loading" onClose={onClose} />;

  return (
    <OverlayPortal>
      <div
        ref={viewerRootRef}
        className={`${styles.viewerRoot} ${isPrintAllLayout ? styles.printAllMode : ''} overlay-viewport z-50 flex flex-col bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50`}
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
      />

      {showStyle ? (
        <BookStyleControls settings={settings} onChange={updateSettings} onClose={() => setShowStyle(false)} />
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
          onChange={(pageConfig) => updateSettings({ pageConfig })}
          onClose={() => setShowPages(false)}
        />
      ) : null}

      <BookStage
        ctx={book.ctx}
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
