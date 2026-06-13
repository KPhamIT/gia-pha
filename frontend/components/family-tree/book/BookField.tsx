'use client';

import { UI } from '@/lib/constants/ui-strings';
import styles from '../GenealogyBook.module.css';

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
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
  readOnly?: boolean;
}) {
  const empty = !value.trim();
  const className = `w-full border-0 bg-transparent p-0 text-sm leading-relaxed outline-none ${
    empty ? 'text-slate-400 italic' : 'text-slate-800'
  }`;

  return (
    <div className={`${styles.bookField} border-b border-dashed border-amber-200/80 py-2.5`}>
      <p className={`${styles.bookFieldLabel} mb-1 text-[11px] font-semibold uppercase tracking-wide text-amber-800/70`}>
        {label}
      </p>
      {readOnly ? (
        <p className={`text-sm leading-relaxed ${empty ? 'italic text-slate-400' : 'text-slate-800'}`}>
          {displayValue(value)}
        </p>
      ) : multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={UI.BOOK_EMPTY_FIELD}
          rows={3}
          className={`${styles.bookFieldMultiline} ${className} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={UI.BOOK_EMPTY_FIELD}
          className={className}
        />
      )}
    </div>
  );
}
