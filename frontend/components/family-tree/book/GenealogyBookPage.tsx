'use client';

import type { PersonDetail } from '@/components/types/family-tree-types';
import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { extractPersonRelationships } from '@/utils/person-relationships';
import {
  type BookPageDraft,
  buildBookPageDraft,
  draftToUpdateInput,
} from './book-page-draft';
import BookPageHeader from './BookPageHeader';
import { getBorderStyle, DEFAULT_BORDER_STYLE_ID } from './page-border-styles';
import { getFormStyle, DEFAULT_FORM_STYLE_ID } from './page-form-styles';
import styles from './GenealogyBook.module.css';

// Re-exported so existing imports keep working.
export { buildBookPageDraft, draftToUpdateInput };
export type { BookPageDraft };

type GenealogyBookPageProps = {
  pageNumber: number;
  totalPages: number;
  detail: PersonDetail | null;
  loading: boolean;
  draft: BookPageDraft;
  borderStyleId?: string;
  formStyleId?: string;
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
  borderStyleId = DEFAULT_BORDER_STYLE_ID,
  formStyleId = DEFAULT_FORM_STYLE_ID,
  readOnly = false,
  isDirty = false,
  saving = false,
  onDraftChange,
  onSave,
}: GenealogyBookPageProps) {
  const relations = detail ? extractPersonRelationships(detail.person.id, detail.relationships) : null;
  const Border = getBorderStyle(borderStyleId).Component;
  const Form = getFormStyle(formStyleId).Component;

  const update = (field: keyof BookPageDraft, value: string) => {
    onDraftChange?.({ ...draft, [field]: value });
  };

  return (
    <div className={`${styles.paper} relative px-5 py-6 sm:px-7 sm:py-8`} data-genealogy-paper>
      <Border>
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

        <BookPageHeader draft={draft} readOnly={readOnly} onChange={update} />

        {loading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <LoadingSpinner size={32} label={UI.LOADING} />
          </div>
        ) : (
          <div className={styles.paperContent}>
            <Form draft={draft} relations={relations} readOnly={readOnly} onChange={update} />
          </div>
        )}

        <p className={`${styles.paperFooter} mt-3 text-center text-[10px] text-amber-900/45`}>
          {UI.BOOK_PAGE_OF(pageNumber, totalPages)}
        </p>
      </Border>
    </div>
  );
}
