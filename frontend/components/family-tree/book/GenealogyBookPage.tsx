'use client';

import type { PersonDetail } from '@/components/types/family-tree-types';
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
};

export default function GenealogyBookPage({
  pageNumber,
  totalPages,
  detail,
  loading,
  draft,
  borderStyleId = DEFAULT_BORDER_STYLE_ID,
  formStyleId = DEFAULT_FORM_STYLE_ID,
  readOnly = true,
}: GenealogyBookPageProps) {
  const relations = detail ? extractPersonRelationships(detail.person.id, detail.relationships) : null;
  const Border = getBorderStyle(borderStyleId).Component;
  const Form = getFormStyle(formStyleId).Component;

  return (
    <div className={`${styles.paper} relative px-5 py-6 sm:px-7 sm:py-8`} data-genealogy-paper>
      <Border>
        <BookPageHeader draft={draft} readOnly={readOnly} onChange={() => {}} />

        {loading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <LoadingSpinner size={32} label={UI.LOADING} />
          </div>
        ) : (
          <div className={styles.paperContent}>
            <Form draft={draft} relations={relations} readOnly={readOnly} onChange={() => {}} />
          </div>
        )}

        <p className={`${styles.paperFooter} mt-3 text-center text-[10px] text-amber-900/45`}>
          {UI.BOOK_PAGE_OF(pageNumber, totalPages)}
        </p>
      </Border>
    </div>
  );
}
