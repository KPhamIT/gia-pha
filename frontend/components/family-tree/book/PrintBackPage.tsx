"use client";

import { UI } from "@/lib/constants/ui-strings";
import { getCalligraphyFont } from "./calligraphy-fonts";
import type { BookSettings } from "./book-settings";
import {
  getPageBackground,
  pageBackgroundStyle,
  DEFAULT_PAGE_BACKGROUND_ID,
  DEFAULT_PAGE_BACKGROUND_WASH,
} from "./page-backgrounds";
import styles from "./GenealogyBook.module.css";

type PrintBackPageProps = {
  settings: BookSettings;
};

/**
 * Trang lưng khi in hai mặt: cùng nền mặt trước, không form người.
 * Dùng với In hai mặt trên máy in (lật cạnh dài).
 */
export default function PrintBackPage({ settings }: PrintBackPageProps) {
  const pageBackgroundId =
    settings.pageBackgroundId || DEFAULT_PAGE_BACKGROUND_ID;
  const pageBackgroundWash =
    settings.pageBackgroundWash ?? DEFAULT_PAGE_BACKGROUND_WASH;
  const hasBg = Boolean(getPageBackground(pageBackgroundId).url);
  const font = getCalligraphyFont(settings.coverFontId).cssValue;
  const title = settings.coverTitle || UI.BOOK_COVER_DEFAULT_TITLE;

  return (
    <div
      className={`${styles.paper} relative ${hasBg ? styles.paperWithImage : ""}`}
      style={pageBackgroundStyle(pageBackgroundId, pageBackgroundWash)}
      data-genealogy-paper
      data-genealogy-print-back=""
      data-paper-bg={hasBg ? "1" : undefined}
    >
      <div className={styles.flipBackArt} aria-hidden>
        <span className={styles.flipBackBadge}>家 譜</span>
        <span className={styles.flipBackSeal} style={{ fontFamily: font }}>
          譜
        </span>
        <span className={styles.flipBackTitle} style={{ fontFamily: font }}>
          {title}
        </span>
      </div>
    </div>
  );
}
