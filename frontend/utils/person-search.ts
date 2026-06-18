import type { Person, Relationship } from '@/components/types/family-tree-types';
import { getBranchLabel } from '@/lib/constants/branches';
import { UI } from '@/lib/constants/ui-strings';
import { extractPersonRelationships } from '@/utils/person-relationships';

export const PERSON_SEARCH_RESULT_LIMIT = 20;

export function filterPersonsByName(
  persons: Person[],
  query: string,
  limit = PERSON_SEARCH_RESULT_LIMIT,
): Person[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return persons.filter((person) => person.fullName.toLowerCase().includes(normalized)).slice(0, limit);
}

export function personSearchSubtitle(person: Person, relationships: Relationship[]): string | null {
  const { father, mother } = extractPersonRelationships(person.id, relationships);
  const parts = [
    person.generation != null ? UI.GENERATION_SHORT(person.generation) : null,
    person.branch != null ? getBranchLabel(person.branch) : null,
    father ? `${UI.FATHER}: ${father.fullName}` : null,
    mother ? `${UI.MOTHER}: ${mother.fullName}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : null;
}
