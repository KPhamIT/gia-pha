'use client';

import { UI } from '@/lib/constants/ui-strings';
import styles from './GenealogyBook.module.css';

export function displayValue(value: string): string {
  return value.trim() || UI.BOOK_EMPTY_FIELD;
}

/**
 * Stacked label + value field used by the classic/compact form styles.
 * Keeps the `bookField*` class names so the print stylesheet overrides apply.
 */
export default function BookField({
  label,
  value,
  onChange,
  multiline = false,
  printLines,
  readOnly = false,
  onStartEdit,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
  /** Minimum ruled lines when printing (multiline fields). */
  printLines?: number;
  readOnly?: boolean;
  onStartEdit?: () => void;
}) {
  const empty = !value.trim();
  const lineCount = printLines ?? (multiline ? 3 : undefined);
  const className = `w-full border-0 bg-transparent p-0 outline-none ${
    empty ? 'text-slate-400 italic' : 'text-slate-800'
  }`;
  const multilineClass =
    multiline && lineCount != null
      ? `${styles.bookFieldMultiline} whitespace-pre-wrap break-words`
      : '';

  const handleFocus = () => {
    if (!readOnly) onStartEdit?.();
  };

  return (
    <div className={styles.bookField}>
      <p className={styles.bookFieldLabel}>{label}</p>
      {readOnly ? (
        <p
          className={`${styles.bookFieldValue} ${empty ? 'italic text-slate-400' : 'text-slate-800'} ${multilineClass} ${onStartEdit ? 'cursor-text' : ''}`}
          data-print-lines={lineCount}
          onClick={onStartEdit}
        >
          {displayValue(value)}
        </p>
      ) : multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={handleFocus}
          placeholder={UI.BOOK_EMPTY_FIELD}
          rows={lineCount ?? 3}
          data-print-lines={lineCount}
          className={`${styles.bookFieldMultiline} ${className} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={handleFocus}
          placeholder={UI.BOOK_EMPTY_FIELD}
          className={className}
        />
      )}
    </div>
  );
}
