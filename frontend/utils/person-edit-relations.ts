import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import { extractPersonRelationships } from "@/utils/person-relationships";
import {
  createRelationship,
  deleteRelationshipById,
} from "@/lib/family-tree/mutations";

export type PersonRelationDraft = {
  fatherId: number | null;
  motherId: number | null;
  spouseId: number | null;
};

export function buildRelationDraft(
  personId: number,
  relationships: Relationship[],
): PersonRelationDraft {
  const { father, mother, spouses } = extractPersonRelationships(
    personId,
    relationships,
  );
  return {
    fatherId: father?.id ?? null,
    motherId: mother?.id ?? null,
    spouseId: spouses[0]?.id ?? null,
  };
}

export function personById(
  persons: Person[],
  id: number | null,
): Person | null {
  if (id == null) return null;
  return persons.find((p) => p.id === id) ?? null;
}

function idsToDeleteForParent(
  personId: number,
  parentId: number | null,
  type: "FATHER" | "MOTHER",
  relationships: Relationship[],
): number[] {
  const ids: number[] = [];
  for (const rel of relationships) {
    if (rel.type === type && rel.toId === personId) ids.push(rel.id);
    if (
      parentId != null &&
      rel.type === "CHILD" &&
      rel.fromId === personId &&
      rel.toId === parentId
    ) {
      ids.push(rel.id);
    }
  }
  return ids;
}

function idsToDeleteForSpouse(
  personId: number,
  relationships: Relationship[],
): number[] {
  return relationships
    .filter(
      (rel) =>
        rel.type === "SPOUSE" &&
        (rel.fromId === personId || rel.toId === personId),
    )
    .map((rel) => rel.id);
}

async function deleteIds(
  ids: number[],
  onRemoved: (id: number) => void,
): Promise<void> {
  const unique = [...new Set(ids)];
  for (const id of unique) {
    await deleteRelationshipById(id);
    onRemoved(id);
  }
}

/** Apply father/mother/spouse edits; notify tree as each link changes. */
export async function syncPersonRelations(args: {
  personId: number;
  draft: PersonRelationDraft;
  relationships: Relationship[];
  onRemoved: (id: number) => void;
  onAdded: (rel: Relationship) => void;
}): Promise<void> {
  const { personId, draft, onRemoved, onAdded } = args;
  const snapshot = [...args.relationships];
  const current = extractPersonRelationships(personId, snapshot);

  if (current.father?.id !== draft.fatherId) {
    await deleteIds(
      idsToDeleteForParent(
        personId,
        current.father?.id ?? null,
        "FATHER",
        snapshot,
      ),
      onRemoved,
    );
    if (draft.fatherId != null) {
      onAdded(await createRelationship(draft.fatherId, personId, "FATHER"));
    }
  }

  if (current.mother?.id !== draft.motherId) {
    await deleteIds(
      idsToDeleteForParent(
        personId,
        current.mother?.id ?? null,
        "MOTHER",
        snapshot,
      ),
      onRemoved,
    );
    if (draft.motherId != null) {
      onAdded(await createRelationship(draft.motherId, personId, "MOTHER"));
    }
  }

  const currentSpouseId = current.spouses[0]?.id ?? null;
  const spouseChanged =
    currentSpouseId !== draft.spouseId || current.spouses.length > 1;
  if (spouseChanged) {
    await deleteIds(idsToDeleteForSpouse(personId, snapshot), onRemoved);
    if (draft.spouseId != null) {
      onAdded(await createRelationship(personId, draft.spouseId, "SPOUSE"));
    }
  }
}
