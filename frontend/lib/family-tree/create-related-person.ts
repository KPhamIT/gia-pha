import type { CreatePersonDto } from "@/lib/api/modules/person";
import { api } from "@/lib/api";
import type {
  Person,
  Relationship,
  RelationshipType,
} from "@/components/types/family-tree-types";

export type RelatedPersonRole = "father" | "mother" | "spouse";

export type CreateRelatedPersonInput = {
  fullName: string;
  gender?: string;
  birthDate?: string;
};

function roleDefaults(
  role: RelatedPersonRole,
  subject: Person,
): { gender: string; generation: number | null; type: RelationshipType } {
  if (role === "father") {
    return {
      gender: "Nam",
      generation:
        subject.generation != null ? Math.max(0, subject.generation - 1) : null,
      type: "FATHER",
    };
  }
  if (role === "mother") {
    return {
      gender: "Nữ",
      generation:
        subject.generation != null ? Math.max(0, subject.generation - 1) : null,
      type: "MOTHER",
    };
  }
  const spouseGender =
    subject.gender?.trim() === "Nam"
      ? "Nữ"
      : subject.gender?.trim() === "Nữ"
        ? "Nam"
        : "";
  return {
    gender: spouseGender,
    generation: subject.generation ?? null,
    type: "SPOUSE",
  };
}

/** Create a new person and link as father / mother / spouse of `subject`. */
export async function createRelatedPerson(
  subject: Person,
  role: RelatedPersonRole,
  data: CreateRelatedPersonInput,
): Promise<{ person: Person; relationship: Relationship }> {
  const defaults = roleDefaults(role, subject);
  const body: CreatePersonDto = {
    fullName: data.fullName.trim(),
    gender: data.gender || defaults.gender || undefined,
    birthDate: data.birthDate || undefined,
    generation: defaults.generation,
    branch: subject.branch ?? 1,
    organizationId: subject.organizationId ?? undefined,
  };

  const person = await api.person.create(body);
  const relationship =
    role === "spouse"
      ? await api.relationship.create({
          fromId: subject.id,
          toId: person.id,
          type: "SPOUSE",
        })
      : await api.relationship.create({
          fromId: person.id,
          toId: subject.id,
          type: defaults.type,
        });

  return { person, relationship };
}
