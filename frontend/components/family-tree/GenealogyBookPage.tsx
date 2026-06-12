'use client';

import type { PersonDetail, UpdatePersonDetailInput } from '@/components/types/family-tree-types';
import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { extractPersonRelationships, toDateInputValue } from '@/utils/person-relationships';
import styles from './GenealogyBook.module.css';

export type BookPageDraft = {
  fullName: string;
  gender: string;
  birthDate: string;
  deathDate: string;
  generation: string;
  branch: string;
  birthPlace: string;
  currentLocation: string;
  education: string;
  occupation: string;
  religion: string;
  ethnicity: string;
  achievements: string;
  biography: string;
  cemetery: string;
  graveAddress: string;
  graveNotes: string;
};

export function buildBookPageDraft(detail: PersonDetail | null): BookPageDraft {
  const person = detail?.person;
  return {
    fullName: person?.fullName ?? '',
    gender: person?.gender ?? '',
    birthDate: toDateInputValue(person?.birthDate),
    deathDate: toDateInputValue(person?.deathDate),
    generation: person?.generation != null ? String(person.generation) : '',
    branch: person?.branch != null ? String(person.branch) : '',
    birthPlace: person?.birthPlace ?? '',
    currentLocation: person?.currentLocation ?? '',
    education: person?.education ?? '',
    occupation: person?.occupation ?? '',
    religion: person?.religion ?? '',
    ethnicity: person?.ethnicity ?? '',
    achievements: person?.achievements ?? '',
    biography: person?.biography?.content ?? '',
    cemetery: person?.graveInfo?.cemetery ?? '',
    graveAddress: person?.graveInfo?.address ?? '',
    graveNotes: person?.graveInfo?.notes ?? '',
  };
}

export function draftToUpdateInput(draft: BookPageDraft): UpdatePersonDetailInput {
  return {
    fullName: draft.fullName.trim() || undefined,
    gender: draft.gender || undefined,
    birthDate: draft.birthDate || undefined,
    deathDate: draft.deathDate || undefined,
    generation: draft.generation ? Number(draft.generation) : undefined,
    branch: draft.branch ? Number(draft.branch) : undefined,
    birthPlace: draft.birthPlace || undefined,
    currentLocation: draft.currentLocation || undefined,
    education: draft.education || undefined,
    occupation: draft.occupation || undefined,
    religion: draft.religion || undefined,
    ethnicity: draft.ethnicity || undefined,
    achievements: draft.achievements || undefined,
    biography: draft.biography,
    graveInfo: {
      cemetery: draft.cemetery || undefined,
      address: draft.graveAddress || undefined,
      notes: draft.graveNotes || undefined,
    },
  };
}

function displayValue(value: string): string {
  return value.trim() || UI.BOOK_EMPTY_FIELD;
}

function BookField({
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
          rows={readOnly ? 2 : 3}
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

type GenealogyBookPageProps = {
  pageNumber: number;
  totalPages: number;
  detail: PersonDetail | null;
  loading: boolean;
  draft: BookPageDraft;
  readOnly?: boolean;
  isDirty?: boolean;
  saving?: boolean;
  onDraftChange?: (draft: BookPageDraft) => void;
  onSave?: () => void;
};

export default function GenealogyBookPage({
  pageNumber,
  totalPages,
  detail,
  loading,
  draft,
  readOnly = false,
  isDirty = false,
  saving = false,
  onDraftChange,
  onSave,
}: GenealogyBookPageProps) {
  const relations = detail ? extractPersonRelationships(detail.person.id, detail.relationships) : null;

  const update = (field: keyof BookPageDraft, value: string) => {
    onDraftChange?.({ ...draft, [field]: value });
  };

  const relationText = (names: { fullName: string }[]) =>
    names.length ? names.map((p) => p.fullName).join(', ') : UI.BOOK_EMPTY_FIELD;

  return (
    <div className={`${styles.paper} relative px-5 py-6 sm:px-7 sm:py-8`} data-genealogy-paper>
      {!readOnly && isDirty ? (
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-white shadow-md active:bg-emerald-600 disabled:opacity-60"
          aria-label={UI.BOOK_SAVE_PAGE}
        >
          {saving ? (
            <LoadingSpinner size={16} label={UI.BOOK_SAVING} />
          ) : (
            <Icon path="save" size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
          )}
        </button>
      ) : null}

      <div className={`${styles.paperHeader} mb-4 border-b-2 border-amber-900/15 pb-3 text-center`}>
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-900/50">{UI.PAGE_TITLE}</p>
        {readOnly ? (
          <h2
            className={`mt-1 text-xl font-bold ${
              draft.fullName.trim() ? 'text-amber-950' : 'italic text-slate-400'
            }`}
          >
            {displayValue(draft.fullName)}
          </h2>
        ) : (
          <input
            type="text"
            value={draft.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder={UI.BOOK_EMPTY_FIELD}
            className={`mt-1 w-full border-0 bg-transparent text-center text-xl font-bold outline-none ${
              draft.fullName.trim() ? 'text-amber-950' : 'italic text-slate-400'
            }`}
          />
        )}
        <div className="mt-2 flex justify-center gap-4 text-xs text-amber-900/60">
          <span className="inline-flex items-center gap-1">
            {UI.BOOK_BRANCH}
            {readOnly ? (
              <span>{displayValue(draft.branch)}</span>
            ) : (
              <input
                type="text"
                inputMode="numeric"
                value={draft.branch}
                onChange={(e) => update('branch', e.target.value)}
                placeholder={UI.BOOK_EMPTY_FIELD}
                className="w-10 border-0 border-b border-dashed border-amber-300/80 bg-transparent text-center outline-none"
              />
            )}
          </span>
          <span className="inline-flex items-center gap-1">
            {UI.BOOK_GENERATION}
            {readOnly ? (
              <span>{displayValue(draft.generation)}</span>
            ) : (
              <input
                type="text"
                inputMode="numeric"
                value={draft.generation}
                onChange={(e) => update('generation', e.target.value)}
                placeholder={UI.BOOK_EMPTY_FIELD}
                className="w-10 border-0 border-b border-dashed border-amber-300/80 bg-transparent text-center outline-none"
              />
            )}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-16">
          <LoadingSpinner size={32} label={UI.LOADING} />
        </div>
      ) : (
        <div className={styles.paperContent}>
          <div className={`${styles.bookGrid} grid grid-cols-2 gap-x-4`}>
            <BookField label={UI.GENDER} value={draft.gender} onChange={(v) => update('gender', v)} readOnly={readOnly} />
            <BookField label={UI.BIRTH_DATE} value={draft.birthDate} onChange={(v) => update('birthDate', v)} readOnly={readOnly} />
            <BookField label={UI.DEATH_DATE} value={draft.deathDate} onChange={(v) => update('deathDate', v)} readOnly={readOnly} />
            <BookField label={UI.BIRTH_PLACE} value={draft.birthPlace} onChange={(v) => update('birthPlace', v)} readOnly={readOnly} />
          </div>

          <BookField label={UI.CURRENT_LOCATION} value={draft.currentLocation} onChange={(v) => update('currentLocation', v)} readOnly={readOnly} />
          <BookField label={UI.EDUCATION} value={draft.education} onChange={(v) => update('education', v)} readOnly={readOnly} />
          <BookField label={UI.OCCUPATION} value={draft.occupation} onChange={(v) => update('occupation', v)} readOnly={readOnly} />
          <BookField label={UI.RELIGION} value={draft.religion} onChange={(v) => update('religion', v)} readOnly={readOnly} />
          <BookField label={UI.ETHNICITY} value={draft.ethnicity} onChange={(v) => update('ethnicity', v)} readOnly={readOnly} />

          {relations ? (
            <div className="border-b border-dashed border-amber-200/80 py-2.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-amber-800/70">
                {UI.RELATIONSHIPS}
              </p>
              <div className="space-y-1 text-sm text-slate-700">
                <p>
                  <span className="text-amber-900/60">{UI.FATHER}: </span>
                  {relations.father?.fullName ?? UI.BOOK_EMPTY_FIELD}
                </p>
                <p>
                  <span className="text-amber-900/60">{UI.MOTHER}: </span>
                  {relations.mother?.fullName ?? UI.BOOK_EMPTY_FIELD}
                </p>
                <p>
                  <span className="text-amber-900/60">{UI.SPOUSE}: </span>
                  {relationText(relations.spouses)}
                </p>
                <p>
                  <span className="text-amber-900/60">{UI.CHILDREN}: </span>
                  {relationText(relations.children)}
                </p>
              </div>
            </div>
          ) : null}

          <BookField label={UI.ACHIEVEMENTS} value={draft.achievements} onChange={(v) => update('achievements', v)} multiline readOnly={readOnly} />
          <BookField label={UI.BIOGRAPHY} value={draft.biography} onChange={(v) => update('biography', v)} multiline readOnly={readOnly} />
          <BookField label={UI.CEMETERY} value={draft.cemetery} onChange={(v) => update('cemetery', v)} readOnly={readOnly} />
          <BookField label={UI.GRAVE_ADDRESS} value={draft.graveAddress} onChange={(v) => update('graveAddress', v)} readOnly={readOnly} />
          <BookField label={UI.GRAVE_NOTES} value={draft.graveNotes} onChange={(v) => update('graveNotes', v)} multiline readOnly={readOnly} />
        </div>
      )}

      <p className={`${styles.paperFooter} mt-3 text-center text-[10px] text-amber-900/45`}>
        {UI.BOOK_PAGE_OF(pageNumber, totalPages)}
      </p>
    </div>
  );
}
