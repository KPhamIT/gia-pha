import type {
  PersonDetail,
  UpdatePersonDetailInput,
} from "@/components/types/family-tree-types";
import { toDateInputValue } from "@/utils/person-relationships";

/** Flat, all-string form of {@link PersonDetail} shared by the edit sheet and the book page. */
export type PersonDraft = {
  fullName: string;
  gender: string;
  birthDate: string;
  deathDate: string;
  deathLunarDay: string;
  deathLunarMonth: string;
  /** '1' when the person is deceased, '' otherwise (kept string for the form). */
  deceased: string;
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

/** Các field chỉ dùng khi `deceased === "1"`. */
export function clearDeceasedDraftFields(draft: PersonDraft): PersonDraft {
  return {
    ...draft,
    deceased: "",
    deathDate: "",
    deathLunarDay: "",
    deathLunarMonth: "",
    cemetery: "",
    graveAddress: "",
    graveNotes: "",
  };
}

/**
 * Build the editable draft from a person detail.
 * `branchFallback` lets the edit sheet default an unset branch to "1" while the
 * book page leaves it blank.
 */
export function buildPersonDraft(
  detail: PersonDetail | null,
  branchFallback = "",
): PersonDraft {
  const person = detail?.person;
  return {
    fullName: person?.fullName ?? "",
    gender: person?.gender ?? "",
    birthDate: toDateInputValue(person?.birthDate),
    deathDate: toDateInputValue(person?.deathDate),
    deathLunarDay:
      person?.deathLunarDay != null ? String(person.deathLunarDay) : "",
    deathLunarMonth:
      person?.deathLunarMonth != null ? String(person.deathLunarMonth) : "",
    deceased: person?.deceased ? "1" : "",
    generation: person?.generation != null ? String(person.generation) : "",
    branch: person?.branch != null ? String(person.branch) : branchFallback,
    birthPlace: person?.birthPlace ?? "",
    currentLocation: person?.currentLocation ?? "",
    education: person?.education ?? "",
    occupation: person?.occupation ?? "",
    religion: person?.religion ?? "",
    ethnicity: person?.ethnicity ?? "",
    achievements: person?.achievements ?? "",
    biography: person?.biography?.content ?? "",
    cemetery: person?.graveInfo?.cemetery ?? "",
    graveAddress: person?.graveInfo?.address ?? "",
    graveNotes: person?.graveInfo?.notes ?? "",
  };
}

export function draftToUpdateInput(
  draft: PersonDraft,
): UpdatePersonDetailInput {
  const isDeceased = draft.deceased === "1";

  const base: UpdatePersonDetailInput = {
    fullName: draft.fullName.trim() || undefined,
    gender: draft.gender || undefined,
    birthDate: draft.birthDate || undefined,
    deceased: isDeceased,
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
  };

  if (!isDeceased) return base;

  return {
    ...base,
    deathDate: draft.deathDate || undefined,
    deathLunarDay: draft.deathLunarDay
      ? Number(draft.deathLunarDay)
      : undefined,
    deathLunarMonth: draft.deathLunarMonth
      ? Number(draft.deathLunarMonth)
      : undefined,
    graveInfo: {
      cemetery: draft.cemetery || undefined,
      address: draft.graveAddress || undefined,
      notes: draft.graveNotes || undefined,
    },
  };
}
