import type { Relationship } from "@/components/types/family-tree-types";
import type { SpousePlacement } from "./spouse-layout";
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

/**
 * Khi hiện vợ/chồng, không vẽ đường từ người dâu/rể (satellite) xuống con:
 * bỏ hẳn nếu con đã có cha/mẹ khác; nếu satellite là cha/mẹ duy nhất thì
 * chuyển đường sang xuất phát từ người trong dòng họ đứng cạnh.
 */
export function withoutSatelliteParentEdges(
  relationships: Relationship[],
  placements: SpousePlacement[],
): Relationship[] {
  const anchorOf = new Map(placements.map((p) => [p.satelliteId, p.anchorId]));
  const parentChild = (rel: Relationship) => {
    if (rel.type === "CHILD") return { parentId: rel.toId, childId: rel.fromId };
    if (rel.type === "FATHER" || rel.type === "MOTHER") {
      return { parentId: rel.fromId, childId: rel.toId };
    }
    return null;
  };
  const parentsOf = new Map<number, Set<number>>();
  for (const rel of relationships) {
    const edge = parentChild(rel);
    if (!edge) continue;
    const set = parentsOf.get(edge.childId) ?? new Set<number>();
    set.add(edge.parentId);
    parentsOf.set(edge.childId, set);
  }
  return relationships.flatMap((rel) => {
    const edge = parentChild(rel);
    const anchorId = edge ? anchorOf.get(edge.parentId) : undefined;
    if (!edge || anchorId === undefined) return [rel];
    if ((parentsOf.get(edge.childId)?.size ?? 0) >= 2) return [];
    return [
      rel.type === "CHILD" ? { ...rel, toId: anchorId } : { ...rel, fromId: anchorId },
    ];
  });
}
