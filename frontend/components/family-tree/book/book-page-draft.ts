import type { PersonDetail, UpdatePersonDetailInput } from '@/components/types/family-tree-types';
import { toDateInputValue } from '@/utils/person-relationships';

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
