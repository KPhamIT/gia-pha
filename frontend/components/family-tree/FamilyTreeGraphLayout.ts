import { Edge, Node } from '@xyflow/react';
import { FamilyTreeData, Person, Relationship } from '../types/family-tree-types';

type ParentChildEdge = {
  parentId: number;
  childId: number;
};

type Coordinates = Map<number, { x: number; y: number }>;

export type FamilyTreeLayoutConfig = {
  horizontalGap?: number;
  verticalStep?: number;
};

const NODE_WIDTH = 260;
const DEFAULT_HORIZONTAL_GAP = 40;
const DEFAULT_VERTICAL_STEP = 220;

function getEffectiveRelationships(relationships: Relationship[]) {
  const parentRelations = new Set(
    relationships
      .filter(
        (relationship) =>
          (relationship.type === 'FATHER' || relationship.type === 'MOTHER') && relationship.fromId !== relationship.toId,
      )
      .map((relationship) => `${relationship.fromId}-${relationship.toId}`),
  );

  return relationships.filter((relationship) => {
    if (relationship.fromId === relationship.toId) {
      return false;
    }
    if (relationship.type === 'CHILD') {
      return !parentRelations.has(`${relationship.toId}-${relationship.fromId}`);
    }
    return true;
  });
}

function getTreeEdges(relationships: Relationship[]) {
  return relationships.filter(
    (relationship) => relationship.type === 'FATHER' || relationship.type === 'MOTHER' || relationship.type === 'CHILD',
  );
}

function normalizeParentChildEdges(treeEdges: Relationship[]): ParentChildEdge[] {
  return treeEdges.map((relationship) => {
    if (relationship.type === 'CHILD') {
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

function buildRelationMaps(normalizedEdges: ParentChildEdge[]) {
  const childMap = new Map<number, number[]>();
  const parentMap = new Map<number, number[]>();

  normalizedEdges.forEach((edge) => {
    childMap.set(edge.parentId, [...(childMap.get(edge.parentId) ?? []), edge.childId]);
    parentMap.set(edge.childId, [...(parentMap.get(edge.childId) ?? []), edge.parentId]);
  });

  return { childMap, parentMap };
}

function computeLevels(
  rootId: number,
  childMap: Map<number, number[]>,
  parentMap: Map<number, number[]>,
  relevantPersonIds: Set<number>,
) {
  const levels = new Map<number, number>();
  const levelQueue = [rootId];
  levels.set(rootId, 0);

  while (levelQueue.length > 0) {
    const current = levelQueue.shift()!;
    const currentLevel = levels.get(current) ?? 0;

    const children = childMap.get(current) ?? [];
    for (const childId of children) {
      if (relevantPersonIds.has(childId) && !levels.has(childId)) {
        levels.set(childId, currentLevel + 1);
        levelQueue.push(childId);
      }
    }

    const parents = parentMap.get(current) ?? [];
    for (const parentId of parents) {
      if (relevantPersonIds.has(parentId) && !levels.has(parentId)) {
        levels.set(parentId, currentLevel - 1);
        levelQueue.push(parentId);
      }
    }
  }

  return levels;
}

function buildGenerationMap(persons: Person[], levels: Map<number, number>) {
  const generationMap = new Map<number, number>();

  persons.forEach((person) => {
    if (person.generation != null) {
      const generation = Number(person.generation);
      if (!Number.isNaN(generation)) {
        generationMap.set(person.id, generation);
      }
    }
  });

  persons.forEach((person) => {
    if (!generationMap.has(person.id)) {
      generationMap.set(person.id, levels.get(person.id) ?? 0);
    }
  });

  return generationMap;
}

function buildYMap(generationMap: Map<number, number>, verticalStep: number) {
  const sortedGenerations = Array.from(generationMap.values()).sort((a, b) => a - b);
  const minGeneration = sortedGenerations[0] ?? 0;
  const yMap = new Map<number, number>();

  generationMap.forEach((generation, personId) => {
    yMap.set(personId, (generation - minGeneration) * verticalStep);
  });

  return yMap;
}

function computeCoordinates(
  generationMap: Map<number, number>,
  childMap: Map<number, number[]>,
  relevantPersonIds: Set<number>,
  rootId: number,
  horizontalGap: number,
  verticalStep: number,
) {
  const yMap = buildYMap(generationMap, verticalStep);
  const coordinates: Coordinates = new Map();
  const assigned = new Set<number>();
  const subtreeWidthMap = new Map<number, number>();
  const computing = new Set<number>();
  const layoutComputing = new Set<number>();

  const shiftSubtree = (personId: number, dx: number) => {
    const pos = coordinates.get(personId);
    if (pos) {
      coordinates.set(personId, { x: pos.x + dx, y: pos.y });
    }
    const children = (childMap.get(personId) ?? []).filter((id) => relevantPersonIds.has(id));
    for (const child of children) {
      shiftSubtree(child, dx);
    }
  };

  const computeSubtreeWidth = (personId: number): number => {
    if (subtreeWidthMap.has(personId)) return subtreeWidthMap.get(personId)!;

    // protect against cycles in the relationship graph
    if (computing.has(personId)) {
      // fallback to single node width when a cycle is detected
      subtreeWidthMap.set(personId, NODE_WIDTH);
      return NODE_WIDTH;
    }

    // ensure unique, filtered and sorted children
    const children = Array.from(new Set(childMap.get(personId) ?? [])).filter((id) => relevantPersonIds.has(id)).sort((a, b) => a - b);
    computing.add(personId);
    if (children.length === 0) {
      subtreeWidthMap.set(personId, NODE_WIDTH);
      computing.delete(personId);
      return NODE_WIDTH;
    }
    let total = 0;
    for (const child of children) {
      const w = computeSubtreeWidth(child);
      total += w;
    }
    if (children.length > 1) total += horizontalGap * (children.length - 1);
    const width = Math.max(total, NODE_WIDTH);
    subtreeWidthMap.set(personId, width);
    computing.delete(personId);
    return width;
  };

  const layoutNode = (personId: number, left: number): number => {
    if (assigned.has(personId)) {
      const width = subtreeWidthMap.get(personId) ?? NODE_WIDTH;
      const oldX = coordinates.get(personId)?.x ?? 0;
      if (oldX !== left) {
        shiftSubtree(personId, left - oldX);
      }
      return width;
    }
    // guard against cycles during layout recursion
    if (layoutComputing.has(personId)) {
      return subtreeWidthMap.get(personId) ?? NODE_WIDTH;
    }

    // ensure unique, filtered and sorted children
    const children = Array.from(new Set(childMap.get(personId) ?? [])).filter((childId) => relevantPersonIds.has(childId)).sort((a, b) => a - b);
    layoutComputing.add(personId);
    const y = yMap.get(personId) ?? 0;
    if (children.length === 0) {
      coordinates.set(personId, { x: left, y });
      assigned.add(personId);
      subtreeWidthMap.set(personId, NODE_WIDTH);
      layoutComputing.delete(personId);
      return NODE_WIDTH;
    }

    let currentLeft = left;
    const childXPositions: number[] = [];
    let subtreeWidth = 0;

    // first compute widths for all children deterministically
    const childWidths = children.map((childId) => computeSubtreeWidth(childId));

    for (let i = 0; i < children.length; i++) {
      const childId = children[i];
      const plannedWidth = childWidths[i];
      layoutNode(childId, currentLeft);
      const childX = coordinates.get(childId)?.x ?? currentLeft;

      childXPositions.push(childX);
      currentLeft += plannedWidth + horizontalGap;
      subtreeWidth += plannedWidth;
    }

    if (children.length > 1) {
      subtreeWidth += horizontalGap * (children.length - 1);
    }

    const minChildX = Math.min(...childXPositions);
    const maxChildX = Math.max(...childXPositions) + NODE_WIDTH;
    const x = minChildX + (maxChildX - minChildX) / 2 - NODE_WIDTH / 2;
    coordinates.set(personId, { x, y });
    assigned.add(personId);
    const width = Math.max(subtreeWidth, NODE_WIDTH);
    subtreeWidthMap.set(personId, width);
    layoutComputing.delete(personId);
    return width;
  };

  const totalWidth = layoutNode(rootId, 0);
  let nextLeft = totalWidth + horizontalGap;

  Array.from(generationMap.keys()).forEach((personId) => {
    if (!assigned.has(personId)) {
      const width = layoutNode(personId, nextLeft);
      nextLeft += width + horizontalGap;
    }
  });

  return coordinates;
}

function buildFlowNodes(persons: Person[], rootId: number, coordinates: Coordinates) {
  return persons.map((person) => {
    const pos = coordinates.get(person.id) || { x: 0, y: 0 };
    return {
      id: person.id.toString(),
      type: 'default',
      data: {
        fullName: person.fullName,
        avatar: person.avatar,
        gender: person.gender,
        birthDate: person.birthDate,
        isRoot: person.id === rootId,
        personId: person.id,
        person,
      },
      position: pos,
    } as Node;
  });
}

function buildFlowEdges(
  relationships: Relationship[],
) {
  const flowEdges: Edge[] = [];
  const processedEdges = new Set<string>();

  relationships.forEach((relationship) => {

    let sourceId = relationship.fromId;
    let targetId = relationship.toId;

    if (relationship.type === 'CHILD') {
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
      type: 'step',
      animated: false,
      data: { relationshipId: relationship.id },
    });
  });

  return flowEdges;
}

export function buildFamilyTreeGraph(treeData: FamilyTreeData, config: FamilyTreeLayoutConfig = {}) {
  const { root, persons, relationships } = treeData;
  const relevantPersonIds = new Set(persons.map((person) => person.id));
  const effectiveRelationships = getEffectiveRelationships(relationships);
  const treeEdges = getTreeEdges(effectiveRelationships);
  const normalizedEdges = normalizeParentChildEdges(treeEdges);
  const { childMap, parentMap } = buildRelationMaps(normalizedEdges);
  const levels = computeLevels(root.id, childMap, parentMap, relevantPersonIds);
  const generationMap = buildGenerationMap(persons, levels);
  const horizontalGap = config.horizontalGap ?? DEFAULT_HORIZONTAL_GAP;
  const verticalStep = config.verticalStep ?? DEFAULT_VERTICAL_STEP;
  const coordinates = computeCoordinates(
    generationMap,
    childMap,
    relevantPersonIds,
    root.id,
    horizontalGap,
    verticalStep,
  );
  const nodes = buildFlowNodes(persons, root.id, coordinates);
  const edges = buildFlowEdges(effectiveRelationships);

  return { nodes, edges };
}
