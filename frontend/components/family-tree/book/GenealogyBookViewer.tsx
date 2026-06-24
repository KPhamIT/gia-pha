"use client";

import { useCallback, useMemo, useState } from "react";
import OverlayPortal from "@/components/ui/OverlayPortal";
import {
  useOverlayPageRecovery,
  useOverlayViewport,
} from "@/hooks/useOverlayViewport";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import type { Person } from "@/components/types/family-tree-types";
import BookPersonSearch from "./BookPersonSearch";
import BookStyleControls from "./BookStyleControls";
import BookPagesManager from "./BookPagesManager";
import BookViewerHeader from "./BookViewerHeader";
import BookViewerFallback from "./BookViewerFallback";
import BookStage from "./BookStage";
import { useGenealogyBook } from "./useGenealogyBook";
import styles from "./GenealogyBook.module.css";

type GenealogyBookViewerProps = {
  persons: Person[];
  /** Chế độ trang riêng `/book` — không dùng overlay portal. */
  standalone?: boolean;
  /** Đóng overlay (legacy). */
  onClose?: () => void;
  /** Mở cây gia phả — dùng khi `standalone`. */
  onOpenTree?: () => void;
};

export default function GenealogyBookViewer({
  persons,
  standalone = false,
  onClose,
  onOpenTree,
}: GenealogyBookViewerProps) {
  const { requireFeature, canUseFeature } = useFeatureAccess();
  const canEdit = canUseFeature("editBook");
  const [showStyle, setShowStyle] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  useOverlayViewport();
  useOverlayPageRecovery(
    useCallback(() => {
      setShowStyle(false);
      setShowPages(false);
      setShowSearch(false);
    }, []),
  );
  const book = useGenealogyBook(persons);
  const {
    hydrated,
    settings,
    updateSettings,
    saveCoverSettings,
    isPrintAllLayout,
    viewerRootRef,
    ctx,
  } = book;

  const guardedUpdateSettings = useCallback(
    (patch: Parameters<typeof updateSettings>[0]) => {
      if (!requireFeature("editBook")) return;
      updateSettings(patch);
    },
    [requireFeature, updateSettings],
  );

  const guardedSaveCoverSettings = useCallback(() => {
    if (!requireFeature("editBook")) return;
    void saveCoverSettings();
  }, [requireFeature, saveCoverSettings]);

  const guardedCtx = useMemo(
    () => ({
      ...ctx,
      canEdit,
      updateSettings: guardedUpdateSettings,
      saveCoverSettings: guardedSaveCoverSettings,
    }),
    [ctx, canEdit, guardedUpdateSettings, guardedSaveCoverSettings],
  );

  const handleHeaderBack = standalone ? onOpenTree : onClose;

  if (!hydrated) {
    return (
      <BookViewerFallback
        kind="loading"
        standalone={standalone}
        onClose={handleHeaderBack}
      />
    );
  }

  const viewer = (
    <div
      ref={viewerRootRef}
      className={`${styles.viewerRoot} ${isPrintAllLayout ? styles.printAllMode : ""} ${standalone ? "" : "overlay-viewport z-50"} flex h-dvh w-full flex-col bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50`}
    >
      <BookViewerHeader
        pageIndex={book.pageIndex}
        totalLeaves={book.totalLeaves}
        standalone={standalone}
        canEdit={canEdit}
        onClose={handleHeaderBack}
        onToggleStyle={() => setShowStyle((v) => !v)}
        onOpenSearch={() => setShowSearch(true)}
        onOpenPages={() => setShowPages(true)}
        onPrint={book.handlePrint}
        onPrintAll={() => void book.handlePrintAll()}
      />

      {showStyle ? (
        <BookStyleControls
          settings={settings}
          onChange={guardedUpdateSettings}
          onClose={() => setShowStyle(false)}
        />
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
  );

  if (standalone) return viewer;

  return <OverlayPortal>{viewer}</OverlayPortal>;
}
