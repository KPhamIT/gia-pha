'use client';

import { UI } from '@/lib/constants/ui-strings';
import { getCalligraphyFont } from './calligraphy-fonts';
import type { BookSettings } from './book-settings';
import styles from './Book.module.scss';

type BookCoverPageProps = {
  settings: BookSettings;
  readOnly?: boolean;
  onChange?: (patch: Partial<BookSettings>) => void;
};

/** The ornate calligraphy cover (trang bìa). Title/subtitle/lineage editable inline. */
export default function BookCoverPage({ settings, readOnly = false, onChange }: BookCoverPageProps) {
  const font = getCalligraphyFont(settings.coverFontId).cssValue;

  return (
    <div className={styles.cover} data-genealogy-paper>
      <div className={styles.coverFrame} aria-hidden />
      <span className={styles.coverFrameCorner} style={{ top: 10, left: 10, borderRight: 'none', borderBottom: 'none' }} />
      <span className={styles.coverFrameCorner} style={{ top: 10, right: 10, borderLeft: 'none', borderBottom: 'none' }} />
      <span className={styles.coverFrameCorner} style={{ bottom: 10, left: 10, borderRight: 'none', borderTop: 'none' }} />
      <span className={styles.coverFrameCorner} style={{ bottom: 10, right: 10, borderLeft: 'none', borderTop: 'none' }} />

      <div className={styles.coverInner}>
        <span className={styles.coverTopBadge}>家 譜</span>

        {readOnly ? (
          <h1 className={styles.coverTitle} style={{ fontFamily: font }}>
            {settings.coverTitle || UI.BOOK_COVER_DEFAULT_TITLE}
          </h1>
        ) : (
          <input
            className={styles.coverTitle}
            style={{ fontFamily: font }}
            value={settings.coverTitle}
            placeholder={UI.BOOK_COVER_TITLE_PLACEHOLDER}
            onChange={(e) => onChange?.({ coverTitle: e.target.value })}
            aria-label={UI.BOOK_COVER_TITLE_PLACEHOLDER}
          />
        )}

        <div className={styles.coverDivider}>❖</div>

        {readOnly ? (
          <p className={styles.coverSubtitle} style={{ fontFamily: font }}>
            {settings.coverSubtitle || UI.BOOK_COVER_DEFAULT_SUBTITLE}
          </p>
        ) : (
          <input
            className={styles.coverSubtitle}
            style={{ fontFamily: font }}
            value={settings.coverSubtitle}
            placeholder={UI.BOOK_COVER_SUBTITLE_PLACEHOLDER}
            onChange={(e) => onChange?.({ coverSubtitle: e.target.value })}
            aria-label={UI.BOOK_COVER_SUBTITLE_PLACEHOLDER}
          />
        )}

        <div className={styles.coverSeal} style={{ fontFamily: font }}>
          譜
        </div>

        {readOnly ? (
          <p className={styles.coverLineage}>{settings.coverLineage || UI.BOOK_COVER_DEFAULT_LINEAGE}</p>
        ) : (
          <textarea
            className={styles.coverLineage}
            value={settings.coverLineage}
            rows={2}
            placeholder={UI.BOOK_COVER_LINEAGE_PLACEHOLDER}
            onChange={(e) => onChange?.({ coverLineage: e.target.value })}
            aria-label={UI.BOOK_COVER_LINEAGE_PLACEHOLDER}
          />
        )}
      </div>

      {!readOnly ? <p className={`${styles.coverHint} noPrintHint`}>{UI.BOOK_COVER_HINT}</p> : null}
    </div>
  );
}
