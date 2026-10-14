"use client";

import { createPortal } from "react-dom";
import BookPrefacePage from "@/components/family-tree/book/BookPrefacePage";
import GenealogyBookPage, { buildBookPageDraft } from "@/components/family-tree/book/GenealogyBookPage";
import type { BookSettings } from "@/components/family-tree/book/book-settings";
import { getBorderStyle } from "@/components/family-tree/book/page-border-styles";
import { getPageBackground, pageBackgroundStyle } from "@/components/family-tree/book/page-backgrounds";
import gb from "@/components/family-tree/book/GenealogyBook.module.css";
import styles from "./PrintBooks.module.css";

const BLANK_DRAFT = buildBookPageDraft(null);

/** Trang Lời mở đầu (giấy + khung giống sổ gia phả). */
export function PrefaceSheet({ settings }: { settings: BookSettings }) {
  const Border = getBorderStyle(settings.borderStyleId).Component;
  const hasBg = Boolean(getPageBackground(settings.pageBackgroundId).url);
  return (
    <div
      className={`${gb.paper} relative ${hasBg ? gb.paperWithImage : ""}`}
      style={pageBackgroundStyle(settings.pageBackgroundId, settings.pageBackgroundWash)}
      data-genealogy-paper
      data-paper-bg={hasBg ? "1" : undefined}
    >
      <Border>
        <BookPrefacePage settings={settings} readOnly />
      </Border>
    </div>
  );
}

/** Một trang hồ sơ thành viên để trống (có dòng kẻ) cho khách viết tay. */
export function BlankProfileSheet({
  settings,
  clanFooterLabel,
  pageNumber,
  totalPages,
}: {
  settings: BookSettings;
  clanFooterLabel: string;
  pageNumber: number;
  totalPages: number;
}) {
  return (
    <GenealogyBookPage
      pageNumber={pageNumber}
      totalPages={totalPages}
      detail={null}
      loading={false}
      draft={BLANK_DRAFT}
      borderStyleId={settings.borderStyleId}
      formStyleId={settings.formStyleId}
      pageBackgroundId={settings.pageBackgroundId}
      pageBackgroundWash={settings.pageBackgroundWash}
      showPageNumbers={settings.showPageNumbers}
      clanFooterLabel={clanFooterLabel}
      readOnly
      blank
    />
  );
}

/**
 * Ruột sổ khi in: Lời mở đầu + N trang hồ sơ trống. Dùng đúng các lớp in của
 * sổ gia phả (`viewerRoot printAllMode` → mỗi trang một tờ A4, lề gáy 25 mm).
 */
export default function BlankBookPrintStack({
  settings,
  pageCount,
  clanFooterLabel,
}: {
  settings: BookSettings;
  pageCount: number;
  clanFooterLabel: string;
}) {
  return createPortal(
    <div
      className={`${gb.viewerRoot} ${gb.printAllMode} ${gb.printPreparing} ${styles.offscreen}`}
      data-print-root="true"
      aria-hidden
    >
      <div className={gb.printAllStack} data-print-all-stack>
        <div className={gb.printAllPage}>
          <PrefaceSheet settings={settings} />
        </div>
        {Array.from({ length: pageCount }, (_, i) => (
          <div key={i} className={gb.printAllPage}>
            <BlankProfileSheet
              settings={settings}
              clanFooterLabel={clanFooterLabel}
              pageNumber={i + 1}
              totalPages={pageCount}
            />
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
}
