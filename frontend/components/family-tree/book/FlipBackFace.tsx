'use client';

import { UI } from '@/lib/constants/ui-strings';
import { getCalligraphyFont } from './calligraphy-fonts';
import type { BookSettings } from './book-settings';
import styles from './GenealogyBook.module.css';

/**
 * The cream reverse side seen mid-flip. A faint calligraphy seal + book title
 * keeps it from looking blank without competing with the page being read.
 */
export default function FlipBackFace({ settings }: { settings: BookSettings }) {
  const font = getCalligraphyFont(settings.coverFontId).cssValue;
  const title = settings.coverTitle || UI.BOOK_COVER_DEFAULT_TITLE;

  return (
    <div className={`${styles.flipFace} ${styles.flipBack}`}>
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
