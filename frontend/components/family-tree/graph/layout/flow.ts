import { Edge, Node } from "@xyflow/react";
import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import { resolvePersonNodeAppearance } from "@/lib/family-tree/node-appearance";
import type { FamilyTreeLayoutConfig } from "./index";
import type { Coordinates } from "./types";

export function buildFlowNodes(
  persons: Person[],
  rootId: number,
  coordinates: Coordinates,
  generationMap: Map<number, number>,
  config: FamilyTreeLayoutConfig,
) {
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
        isRoot: person.id === rootId,
        personId: person.id,
        person,
        ...style,
      },
      position: pos,
    } as Node;
  });
}

export function buildFlowEdges(relationships: Relationship[]) {
  const flowEdges: Edge[] = [];
  const processedEdges = new Set<string>();

  relationships.forEach((relationship) => {
    let sourceId = relationship.fromId;
    let targetId = relationship.toId;

    if (relationship.type === "CHILD") {
      sourceId = relationship.fromId;
      targetId = relationship.toId;
    }

    // Prevent duplicate edges between same node pair
    const edgeKey = `${sourceId}-${targetId}`;

    if (processedEdges.has(edgeKey)) return;
    processedEdges.add(edgeKey);

    flowEdges.push({
      id: edgeKey,
      source: sourceId.toString(),
      target: targetId.toString(),
      type: "step",
      animated: false,
      data: { relationshipId: relationship.id },
    });
  });

  return flowEdges;
}
