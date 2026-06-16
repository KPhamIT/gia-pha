import type { Node } from '@xyflow/react';
import { buildFamilyTreeGraph, type FamilyTreeLayoutConfig } from '@/components/family-tree/graph/layout';
import type { FamilyTreeData } from '@/components/types/family-tree-types';

export type NodePositionOverride = { x: number; y: number };
export type NodePositionOverrides = Record<number, NodePositionOverride>;

const POSITION_EPSILON = 0.5;

/** Positions that differ from the auto layout — only nodes the user dragged on the tree. */
export function collectMovedNodePositions(
  currentNodes: Node[],
  treeData: FamilyTreeData,
  layoutConfig: FamilyTreeLayoutConfig = {},
): NodePositionOverrides {
  const { nodes: defaultNodes } = buildFamilyTreeGraph(treeData, layoutConfig);
  const defaultById = new Map(defaultNodes.map((node) => [node.id, node.position]));
  const moved: NodePositionOverrides = {};

  for (const node of currentNodes) {
    const defaultPosition = defaultById.get(node.id);
    if (!defaultPosition) continue;

    const dx = Math.abs(node.position.x - defaultPosition.x);
    const dy = Math.abs(node.position.y - defaultPosition.y);
    if (dx > POSITION_EPSILON || dy > POSITION_EPSILON) {
      moved[Number(node.id)] = { x: node.position.x, y: node.position.y };
    }
  }

  return moved;
}
