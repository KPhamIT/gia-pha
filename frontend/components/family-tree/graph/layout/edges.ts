import type { Relationship } from "@/components/types/family-tree-types";
import type { ParentChildEdge } from "./types";

/** Drop self edges and CHILD edges that duplicate an existing FATHER/MOTHER link. */
export function getEffectiveRelationships(relationships: Relationship[]) {
  const parentRelations = new Set(
    relationships
      .filter(
        (relationship) =>
          (relationship.type === "FATHER" || relationship.type === "MOTHER") &&
          relationship.fromId !== relationship.toId,
      )
      .map((relationship) => `${relationship.fromId}-${relationship.toId}`),
  );

  return relationships.filter((relationship) => {
    if (relationship.fromId === relationship.toId) {
      return false;
    }
    if (relationship.type === "CHILD") {
      return !parentRelations.has(
        `${relationship.toId}-${relationship.fromId}`,
      );
    }
    return true;
  });
}

export function getTreeEdges(relationships: Relationship[]) {
  return relationships.filter(
    (relationship) =>
      relationship.type === "FATHER" ||
      relationship.type === "MOTHER" ||
      relationship.type === "CHILD",
  );
}

export function normalizeParentChildEdges(
  treeEdges: Relationship[],
): ParentChildEdge[] {
  return treeEdges.map((relationship) => {
    if (relationship.type === "CHILD") {
      return {
        parentId: relationship.toId,
        childId: relationship.fromId,
      };
    }

    return {
      parentId: relationship.fromId,
      childId: relationship.toId,
    };
  });
}

export function buildRelationMaps(normalizedEdges: ParentChildEdge[]) {
  const childMap = new Map<number, number[]>();
  const parentMap = new Map<number, number[]>();

  normalizedEdges.forEach((edge) => {
    childMap.set(edge.parentId, [
      ...(childMap.get(edge.parentId) ?? []),
      edge.childId,
    ]);
    parentMap.set(edge.childId, [
      ...(parentMap.get(edge.childId) ?? []),
      edge.parentId,
    ]);
  });

  return { childMap, parentMap };
}
