import { Edge, Node } from "@xyflow/react";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import { resolvePersonNodeAppearance } from "@/lib/family-tree/node-appearance";
import type { FamilyTreeLayoutConfig } from "./index";
import type { Coordinates } from "./types";
import type { SpousePair } from "./spouse-layout";

/** Which spouse side-handles each person needs for visible SPOUSE edges. */
export function spouseHandleFlags(spousePairs: SpousePair[]) {
  const hasSpouseLeft = new Set<number>();
  const hasSpouseRight = new Set<number>();
  for (const { leftId, rightId } of spousePairs) {
    hasSpouseRight.add(leftId);
    hasSpouseLeft.add(rightId);
  }
  return { hasSpouseLeft, hasSpouseRight };
}

/** Parent/child handles: bottom if has kids, top if has parents (on this tree). */
export function childHandleFlags(
  childMap: Map<number, number[]>,
  parentMap: Map<number, number[]>,
  relevantPersonIds: Set<number>,
) {
  const hasChildSource = new Set<number>();
  const hasChildTarget = new Set<number>();

  for (const [parentId, children] of childMap) {
    if (!relevantPersonIds.has(parentId)) continue;
    if (children.some((id) => relevantPersonIds.has(id))) {
      hasChildSource.add(parentId);
    }
  }
  for (const [childId, parents] of parentMap) {
    if (!relevantPersonIds.has(childId)) continue;
    if (parents.some((id) => relevantPersonIds.has(id))) {
      hasChildTarget.add(childId);
    }
  }
  return { hasChildSource, hasChildTarget };
}

export function buildFlowNodes(
  persons: Person[],
  rootId: number,
  coordinates: Coordinates,
  generationMap: Map<number, number>,
  config: FamilyTreeLayoutConfig,
  spousePairs: SpousePair[] = [],
  childMap: Map<number, number[]> = new Map(),
  parentMap: Map<number, number[]> = new Map(),
) {
  const relevantPersonIds = new Set(persons.map((p) => p.id));
  const { hasSpouseLeft, hasSpouseRight } = spouseHandleFlags(spousePairs);
  const { hasChildSource, hasChildTarget } = childHandleFlags(
    childMap,
    parentMap,
    relevantPersonIds,
  );
  return persons.map((person) => {
    const pos = coordinates.get(person.id) || { x: 0, y: 0 };
    const generation = generationMap.get(person.id);
    const style = resolvePersonNodeAppearance(
      person.id,
      generation,
      config,
    );
    return {
      id: person.id.toString(),
      type: "default",
      data: {
        fullName: person.fullName,
        avatar: person.avatar,
        gender: person.gender,
        birthDate: person.birthDate,
        deathDate: person.deathDate,
        isRoot: person.id === rootId,
        personId: person.id,
        person,
        hasSpouseLeft: hasSpouseLeft.has(person.id),
        hasSpouseRight: hasSpouseRight.has(person.id),
        hasChildSource: hasChildSource.has(person.id),
        hasChildTarget: hasChildTarget.has(person.id),
        ...style,
      },
      position: pos,
    } as Node;
  });
}

function spousePairKey(a: number, b: number) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

export function buildFlowEdges(
  relationships: Relationship[],
  spousePairs: SpousePair[] = [],
) {
  const flowEdges: Edge[] = [];
  const processedEdges = new Set<string>();
  const spouseOrient = new Map(
    spousePairs.map((pair) => [
      spousePairKey(pair.leftId, pair.rightId),
      pair,
    ]),
  );

  relationships.forEach((relationship) => {
    let sourceId = relationship.fromId;
    let targetId = relationship.toId;
    let sourceHandle = "child-source";
    let targetHandle = "child-target";

    if (relationship.type === "SPOUSE") {
      const pair = spouseOrient.get(spousePairKey(sourceId, targetId));
      if (pair) {
        sourceId = pair.leftId;
        targetId = pair.rightId;
        sourceHandle = "spouse-right";
        targetHandle = "spouse-left";
      }
    } else if (relationship.type === "CHILD") {
      // CHILD stores child→parent; draw parent bottom → child top.
      sourceId = relationship.toId;
      targetId = relationship.fromId;
    }

    const edgeKey = `${sourceId}-${targetId}`;
    if (processedEdges.has(edgeKey)) return;
    processedEdges.add(edgeKey);

    flowEdges.push({
      id: edgeKey,
      source: sourceId.toString(),
      target: targetId.toString(),
      sourceHandle,
      targetHandle,
      type: "step",
      animated: false,
      data: {
        relationshipId: relationship.id,
        relationshipType: relationship.type,
      },
    });
  });

  return flowEdges;
}
