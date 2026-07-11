"use client";

import type { PersonDetail } from "@/components/types/family-tree-types";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { UI } from "@/lib/constants/ui-strings";
import { extractPersonRelationships } from "@/utils/person-relationships";
import {
  type BookPageDraft,
  buildBookPageDraft,
  draftToUpdateInput,
} from "./book-page-draft";
import BookPageHeader from "./BookPageHeader";
import { getBorderStyle, DEFAULT_BORDER_STYLE_ID } from "./page-border-styles";
import { getFormStyle, DEFAULT_FORM_STYLE_ID } from "./page-form-styles";
import {
  getPageBackground,
  pageBackgroundStyle,
  DEFAULT_PAGE_BACKGROUND_ID,
  DEFAULT_PAGE_BACKGROUND_WASH,
} from "./page-backgrounds";
import styles from "./GenealogyBook.module.css";

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
  pageBackgroundId?: string;
  pageBackgroundWash?: number;
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
  pageBackgroundId = DEFAULT_PAGE_BACKGROUND_ID,
  pageBackgroundWash = DEFAULT_PAGE_BACKGROUND_WASH,
  readOnly = true,
}: GenealogyBookPageProps) {
  const relations = detail
    ? extractPersonRelationships(detail.person.id, detail.relationships)
    : null;
  const Border = getBorderStyle(borderStyleId).Component;
  const Form = getFormStyle(formStyleId).Component;
  const hasBg = Boolean(getPageBackground(pageBackgroundId).url);

  return (
    <div
      className={`${styles.paper} relative ${hasBg ? styles.paperWithImage : ""}`}
      style={pageBackgroundStyle(pageBackgroundId, pageBackgroundWash)}
      data-genealogy-paper
      data-paper-bg={hasBg ? "1" : undefined}
    >
      <Border>
        <BookPageHeader draft={draft} readOnly={readOnly} onChange={() => {}} />

        {loading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <LoadingSpinner size={32} label={UI.LOADING} />
          </div>
        ) : (
          <div className={styles.paperContent}>
            <Form
              draft={draft}
              relations={relations}
              readOnly={readOnly}
              onChange={() => {}}
            />
          </div>
        )}

        <p className={styles.paperFooter}>
          {UI.BOOK_PAGE_OF(pageNumber, totalPages)}
        </p>
      </Border>
    </div>
  );
}
