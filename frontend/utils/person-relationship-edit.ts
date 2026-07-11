import type {
  Person,
  Relationship,
  RelationshipType,
} from "@/components/types/family-tree-types";
import {
  createRelationship,
  deleteRelationshipById,
} from "@/lib/family-tree/mutations";
import { extractPersonRelationships } from "@/utils/person-relationships";

export type PersonRelationsDraft = {
  fatherId: number | null;
  motherId: number | null;
  spouseId: number | null;
};

export function buildPersonRelationsDraft(
  personId: number,
  relationships: Relationship[],
): PersonRelationsDraft {
  const rels = extractPersonRelationships(personId, relationships);
  return {
    fatherId: rels.father?.id ?? null,
    motherId: rels.mother?.id ?? null,
    spouseId: rels.spouses[0]?.id ?? null,
  };
}

function findParentRel(
  relationships: Relationship[],
  personId: number,
  type: "FATHER" | "MOTHER",
): Relationship | undefined {
  return relationships.find((r) => r.toId === personId && r.type === type);
}

function spousePartnerId(rel: Relationship, personId: number): number {
  return rel.fromId === personId ? rel.toId : rel.fromId;
}

function spouseRels(
  relationships: Relationship[],
  personId: number,
): Relationship[] {
  return relationships.filter(
    (r) =>
      r.type === "SPOUSE" &&
      (r.fromId === personId || r.toId === personId),
  );
}

function hasSpousePartner(
  relationships: Relationship[],
  personId: number,
  partnerId: number,
): boolean {
  return spouseRels(relationships, personId).some(
    (r) => spousePartnerId(r, personId) === partnerId,
  );
}

type ParentSync = {
  relId?: number;
  currentId: number | null;
  nextId: number | null;
  type: "FATHER" | "MOTHER";
};

function parentChanges(
  relationships: Relationship[],
  personId: number,
  draft: PersonRelationsDraft,
): ParentSync[] {
  return (
    [
      {
        relId: findParentRel(relationships, personId, "FATHER")?.id,
        currentId: findParentRel(relationships, personId, "FATHER")?.fromId ?? null,
        nextId: draft.fatherId,
        type: "FATHER" as const,
      },
      {
        relId: findParentRel(relationships, personId, "MOTHER")?.id,
        currentId: findParentRel(relationships, personId, "MOTHER")?.fromId ?? null,
        nextId: draft.motherId,
        type: "MOTHER" as const,
      },
    ] as ParentSync[]
  ).filter((item) => item.currentId !== item.nextId);
}

function spouseRelIdsToRemove(
  relationships: Relationship[],
  personId: number,
  nextSpouseId: number | null,
): number[] {
  const rels = spouseRels(relationships, personId);
  if (nextSpouseId == null) return rels.map((r) => r.id);
  return rels
    .filter((r) => spousePartnerId(r, personId) !== nextSpouseId)
    .map((r) => r.id);
}

function validateRelationsDraft(
  personId: number,
  draft: PersonRelationsDraft,
): string | null {
  const ids = [draft.fatherId, draft.motherId, draft.spouseId].filter(
    (id): id is number => id != null,
  );
  if (ids.some((id) => id === personId)) {
    return "INVALID_SELF_RELATION";
  }
  if (draft.fatherId != null && draft.fatherId === draft.motherId) {
    return "INVALID_SAME_PARENTS";
  }
  return null;
}

export type SyncPersonRelationshipsResult = {
  added: Relationship[];
  removedIds: number[];
};

/** Apply relationship edits for father, mother, and one spouse link. */
export async function syncPersonRelationships(
  personId: number,
  relationships: Relationship[],
  draft: PersonRelationsDraft,
  persons: Person[],
): Promise<SyncPersonRelationshipsResult> {
  const invalid = validateRelationsDraft(personId, draft);
  if (invalid) throw new Error(invalid);

  const removedIds: number[] = [];
  const added: Relationship[] = [];

  for (const change of parentChanges(relationships, personId, draft)) {
    if (change.relId != null) removedIds.push(change.relId);
    if (change.nextId != null) {
      const rel = await createRelationship(change.nextId, personId, change.type);
      added.push(enrichRelationship(rel, persons));
    }
  }

  const spouseDeletes = spouseRelIdsToRemove(
    relationships,
    personId,
    draft.spouseId,
  );
  removedIds.push(...spouseDeletes);

  const nextSpouseId = draft.spouseId;
  if (
    nextSpouseId != null &&
    !hasSpousePartner(relationships, personId, nextSpouseId)
  ) {
    const rel = await createRelationship(
      personId,
      nextSpouseId,
      "SPOUSE" satisfies RelationshipType,
    );
    added.push(enrichRelationship(rel, persons));
  }

  for (const id of removedIds) {
    await deleteRelationshipById(id);
  }

  return { added, removedIds };
}

function enrichRelationship(
  relationship: Relationship,
  persons: Person[],
): Relationship {
  const from =
    relationship.from ?? persons.find((p) => p.id === relationship.fromId);
  const to =
    relationship.to ?? persons.find((p) => p.id === relationship.toId);
  if (!from || !to) return relationship;
  return { ...relationship, from, to };
}

export function relationsDraftDirty(
  personId: number,
  relationships: Relationship[],
  draft: PersonRelationsDraft,
): boolean {
  const initial = buildPersonRelationsDraft(personId, relationships);
  return (
    initial.fatherId !== draft.fatherId ||
    initial.motherId !== draft.motherId ||
    initial.spouseId !== draft.spouseId
  );
}
