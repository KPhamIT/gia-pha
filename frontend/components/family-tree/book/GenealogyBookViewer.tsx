'use client';

import { useState } from 'react';
import type { Person } from '@/components/types/family-tree-types';
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
  onPersonUpdated: (person: Person) => void;
};

export default function GenealogyBookViewer({ persons, onClose, onPersonUpdated }: GenealogyBookViewerProps) {
  const [showStyle, setShowStyle] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const book = useGenealogyBook(persons, onPersonUpdated);
  const { status, settings, updateSettings, isPrintAllLayout, viewerRootRef } = book;

  if (status === 'loading' || status === 'idle') return <BookViewerFallback kind="loading" onClose={onClose} />;
  if (status === 'error') return <BookViewerFallback kind="error" onClose={onClose} />;

  return (
    <div
      ref={viewerRootRef}
      className={`${styles.viewerRoot} ${isPrintAllLayout ? styles.printAllMode : ''} fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50`}
    >
      <BookViewerHeader
        pageIndex={book.pageIndex}
        totalLeaves={book.totalLeaves}
        saving={book.saving}
        onClose={onClose}
        onToggleStyle={() => setShowStyle((v) => !v)}
        onOpenPages={() => setShowPages(true)}
        onPrint={book.handlePrint}
        onPrintAll={() => void book.handlePrintAll()}
      />

      {showStyle ? (
        <BookStyleControls settings={settings} onChange={updateSettings} onClose={() => setShowStyle(false)} />
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
  );
}
