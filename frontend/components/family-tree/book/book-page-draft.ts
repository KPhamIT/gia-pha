// The book page draft is the shared person-detail form draft. Kept as a thin
// re-export so the book components can keep importing `BookPageDraft` /
// `buildBookPageDraft` by their original names.
import { buildPersonDraft, type PersonDraft } from '@/utils/person-detail-form';

export type BookPageDraft = PersonDraft;
export { draftToUpdateInput } from '@/utils/person-detail-form';

export function buildBookPageDraft(detail: Parameters<typeof buildPersonDraft>[0]): BookPageDraft {
  return buildPersonDraft(detail);
}
