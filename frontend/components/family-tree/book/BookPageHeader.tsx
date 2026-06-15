'use client';

import { BRANCH_OPTIONS, getBranchLabel } from '@/lib/constants/branches';
import { UI } from '@/lib/constants/ui-strings';
import type { BookPageDraft } from './book-page-draft';
import { displayValue } from './BookField';
import styles from './GenealogyBook.module.css';

type Update = (field: keyof BookPageDraft, value: string) => void;

function InlineBranchField({ value, readOnly, onChange }: {
  value: string;
  readOnly: boolean;
  onChange: Update;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {UI.BOOK_BRANCH}
      {readOnly ? (
        <span>{value ? getBranchLabel(Number(value)) : displayValue(value)}</span>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange('branch', e.target.value)}
          className="border-0 border-b border-dashed border-amber-300/80 bg-transparent text-center outline-none"
        >
          <option value="">{UI.BOOK_EMPTY_FIELD}</option>
          {BRANCH_OPTIONS.map((option) => (
            <option key={option.value} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </span>
  );
}

/** A short numeric inline field (generation) shown next to its label. */
function InlineNumberField({ label, field, value, readOnly, onChange }: {
  label: string;
  field: keyof BookPageDraft;
  value: string;
  readOnly: boolean;
  onChange: Update;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      {readOnly ? (
        <span>{displayValue(value)}</span>
      ) : (
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={UI.BOOK_EMPTY_FIELD}
          className="w-10 border-0 border-b border-dashed border-amber-300/80 bg-transparent text-center outline-none"
        />
      )}
    </span>
  );
}

export default function BookPageHeader({ draft, readOnly, onChange }: {
  draft: BookPageDraft;
  readOnly: boolean;
  onChange: Update;
}) {
  const nameClass = draft.fullName.trim() ? 'text-amber-950' : 'italic text-slate-400';

  return (
    <div className={`${styles.paperHeader} mb-4 border-b-2 border-amber-900/15 pb-3 text-center`}>
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-900/50">{UI.PAGE_TITLE}</p>
      {readOnly ? (
        <h2 className={`mt-1 text-xl font-bold ${nameClass}`}>{displayValue(draft.fullName)}</h2>
      ) : (
        <input
          type="text"
          value={draft.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          placeholder={UI.BOOK_EMPTY_FIELD}
          className={`mt-1 w-full border-0 bg-transparent text-center text-xl font-bold outline-none ${nameClass}`}
        />
      )}
      <div className="mt-2 flex justify-center gap-4 text-xs text-amber-900/60">
        <InlineBranchField value={draft.branch} readOnly={readOnly} onChange={onChange} />
        <InlineNumberField label={UI.BOOK_GENERATION} field="generation" value={draft.generation} readOnly={readOnly} onChange={onChange} />
      </div>
    </div>
  );
}
