'use client';

import { useEffect } from 'react';
import { UI } from '@/lib/constants/ui-strings';
import { getCalligraphyFont } from './calligraphy-fonts';
import { loadCalligraphyFont } from './calligraphy-font-loader';
import type { BookSettings } from './book-settings';
import styles from './Book.module.scss';

type BookPrefacePageProps = {
  settings: BookSettings;
  readOnly?: boolean;
  onChange?: (patch: Partial<BookSettings>) => void;
};

/** Editable preface (lời mở đầu). Lives inside the shared paper + border. */
export default function BookPrefacePage({ settings, readOnly = false, onChange }: BookPrefacePageProps) {
  const font = getCalligraphyFont(settings.coverFontId).cssValue;

  useEffect(() => {
    void loadCalligraphyFont(settings.coverFontId);
  }, [settings.coverFontId]);

  return (
    <div className="flex h-full flex-col px-5 py-6 sm:px-7 sm:py-8">
      {readOnly ? (
        <h2 className={styles.prefaceTitle} style={{ fontFamily: font }}>
          {settings.prefaceTitle || UI.BOOK_PREFACE_TITLE_DEFAULT}
        </h2>
      ) : (
        <input
          className={styles.prefaceTitle}
          style={{ fontFamily: font }}
          value={settings.prefaceTitle}
          placeholder={UI.BOOK_PREFACE_TITLE_PLACEHOLDER}
          onChange={(e) => onChange?.({ prefaceTitle: e.target.value })}
          aria-label={UI.BOOK_PREFACE_TITLE_PLACEHOLDER}
        />
      )}

      <div className={styles.prefaceOrnament}>❧</div>

      {readOnly ? (
        <p className={styles.prefaceBody} style={{ whiteSpace: 'pre-wrap' }}>
          {settings.prefaceBody || UI.BOOK_PREFACE_BODY_PLACEHOLDER}
        </p>
      ) : (
        <textarea
          className={styles.prefaceBody}
          value={settings.prefaceBody}
          placeholder={UI.BOOK_PREFACE_BODY_PLACEHOLDER}
          onChange={(e) => onChange?.({ prefaceBody: e.target.value })}
          aria-label={UI.BOOK_PREFACE_BODY_PLACEHOLDER}
        />
      )}

      {readOnly ? (
        settings.prefaceSignature ? (
          <p className={styles.prefaceSignature}>{settings.prefaceSignature}</p>
        ) : null
      ) : (
        <input
          className={styles.prefaceSignature}
          value={settings.prefaceSignature}
          placeholder={UI.BOOK_PREFACE_SIGN_PLACEHOLDER}
          onChange={(e) => onChange?.({ prefaceSignature: e.target.value })}
          aria-label={UI.BOOK_PREFACE_SIGN_PLACEHOLDER}
        />
      )}
    </div>
  );
}
