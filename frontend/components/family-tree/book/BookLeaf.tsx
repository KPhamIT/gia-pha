"use client";

import type {
  Person,
  PersonDetail,
} from "@/components/types/family-tree-types";
import GenealogyBookPage, { type BookPageDraft } from "./GenealogyBookPage";
import BookCoverPage from "./BookCoverPage";
import BookPrefacePage from "./BookPrefacePage";
import { getBorderStyle } from "./page-border-styles";
import type { BookSettings } from "./book-settings";
import type { Leaf } from "./book-leaves";
import type { OrgBookContext } from "@/lib/settings/default-user-settings";
import styles from "./GenealogyBook.module.css";

export type BookLeafCtx = {
  leaves: Leaf[];
  settings: BookSettings;
  orgContext: OrgBookContext | null;
  updateSettings: (patch: Partial<BookSettings>) => void;
  details: Record<number, PersonDetail>;
  personCount: number;
  getPersonDraft: (person: Person) => BookPageDraft;
  /** Cho phép chỉnh sửa bìa / lời nói đầu (quyền `editBook`). */
  canEdit?: boolean;
  showCoverSavePrompt?: boolean;
  isCoverDirty?: boolean;
  isSavingCover?: boolean;
  saveCoverSettings?: () => void | Promise<void>;
};

/** Renders any leaf by index. `live` enables editing on cover and preface only. */
export default function BookLeaf({
  index,
  live,
  ctx,
}: {
  index: number;
  live?: boolean;
  ctx: BookLeafCtx;
}) {
  const leaf = ctx.leaves[index];
  if (!leaf) return null;

  const editable = Boolean(live) && ctx.canEdit !== false;

  if (leaf.kind === "cover") {
    return (
      <BookCoverPage
        settings={ctx.settings}
        orgContext={ctx.orgContext}
        readOnly={!editable}
        onChange={ctx.updateSettings}
        showSavePrompt={Boolean(ctx.showCoverSavePrompt && ctx.isCoverDirty)}
        saving={ctx.isSavingCover}
        onSave={() => void ctx.saveCoverSettings?.()}
      />
    );
  }

  if (leaf.kind === "preface") {
    const Border = getBorderStyle(ctx.settings.borderStyleId).Component;
    return (
      <div className={`${styles.paper} relative`} data-genealogy-paper>
        <Border>
          <BookPrefacePage
            settings={ctx.settings}
            readOnly={!editable}
            onChange={ctx.updateSettings}
          />
        </Border>
      </div>
    );
  }

  return (
    <GenealogyBookPage
      pageNumber={leaf.personIndex + 1}
      totalPages={ctx.personCount}
      detail={ctx.details[leaf.person.id] ?? null}
      loading={false}
      draft={ctx.getPersonDraft(leaf.person)}
      borderStyleId={ctx.settings.borderStyleId}
      formStyleId={ctx.settings.formStyleId}
      readOnly
    />
  );
}
