import type { FamilyTreeData } from "@/components/types/family-tree-types";
import {
  buildFamilyTreeGraph,
  NODE_HEIGHT,
  NODE_WIDTH,
  type FamilyTreeLayoutConfig,
} from "@/components/family-tree/graph/layout";
import type { NodePositionOverrides } from "./node-position-overrides";

export type Rect = { x: number; y: number; width: number; height: number };

export type ExportNode = {
  id: number;
  x: number;
  y: number;
  fullName: string;
  birthDate: string | null;
  isRoot: boolean;
};

export type ExportModel = {
  nodes: ExportNode[];
  /** One orthogonal connector path (`d` attribute) per parent. */
  connectors: string[];
  nodeWidth: number;
  nodeHeight: number;
  bounds: Rect;
  /** Export-only horizontal anchor for centring (root / first ancestor centre x). */
  rootCenterX: number;
};

function computeNodeBounds(
  exportNodes: ExportNode[],
  nodeWidth: number,
  nodeHeight: number,
): Rect {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of exportNodes) {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + nodeWidth);
    maxY = Math.max(maxY, n.y + nodeHeight);
  }
  if (!Number.isFinite(minX)) {
    minX = 0;
    minY = 0;
    maxX = nodeWidth;
    maxY = nodeHeight;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function buildConnectors(
  childrenByParent: Map<number, number[]>,
  posById: Map<number, ExportNode>,
  nodeWidth: number,
  nodeHeight: number,
): string[] {
  const connectors: string[] = [];
  for (const [parentId, childIds] of childrenByParent) {
    const parent = posById.get(parentId);
    if (!parent) continue;
    const children = childIds
      .map((id) => posById.get(id))
      .filter((c): c is ExportNode => Boolean(c));
    if (children.length === 0) continue;

    const stemX = parent.x + nodeWidth / 2;
    const parentBottomY = parent.y + nodeHeight;
    const childCenters = children.map((c) => ({
      x: c.x + nodeWidth / 2,
      top: c.y,
    }));
    const minTop = Math.min(...childCenters.map((c) => c.top));
    const busY = (parentBottomY + minTop) / 2;
    const busLeft = Math.min(stemX, ...childCenters.map((c) => c.x));
    const busRight = Math.max(stemX, ...childCenters.map((c) => c.x));

    let d = `M ${stemX} ${parentBottomY} L ${stemX} ${busY} `;
    d += `M ${busLeft} ${busY} L ${busRight} ${busY} `;
    for (const c of childCenters) {
      d += `M ${c.x} ${busY} L ${c.x} ${c.top} `;
    }
    connectors.push(d.trim());
  }
  return connectors;
}

/**
 * Export-only: move the root (first ancestor) to the horizontal centre of the
 * tree extent. No other node coordinates are changed — layout algorithm untouched.
 */
function applyExportRootXOnly(
  exportNodes: ExportNode[],
  nodeWidth: number,
  layoutBounds: Rect,
): void {
  const root = exportNodes.find((n) => n.isRoot);
  if (!root) return;
  root.x = layoutBounds.x + layoutBounds.width / 2 - nodeWidth / 2;
}

/** Build the geometric model (positioned nodes + connector paths) for the tree. */
export function buildExportModel(
  treeData: FamilyTreeData,
  layoutConfig: FamilyTreeLayoutConfig = {},
  positionOverrides?: NodePositionOverrides,
): ExportModel {
  const { nodes, edges } = buildFamilyTreeGraph(treeData, layoutConfig);
  const nodeWidth = layoutConfig.nodeWidth ?? NODE_WIDTH;
  const nodeHeight = layoutConfig.nodeHeight ?? NODE_HEIGHT;

  const exportNodes: ExportNode[] = nodes.map((node) => {
    const data = node.data as {
      fullName?: string;
      birthDate?: string | null;
      isRoot?: boolean;
      personId?: number;
    };
    const id = data.personId ?? Number(node.id);
    const override = positionOverrides?.[id];
    return {
      id,
      x: override?.x ?? node.position.x,
      y: override?.y ?? node.position.y,
      fullName: data.fullName ?? "",
      birthDate: data.birthDate ?? null,
      isRoot: Boolean(data.isRoot),
    };
  });

  const posById = new Map(exportNodes.map((n) => [n.id, n]));

  // Group children by their parent (the upper node of each vertical edge).
  const childrenByParent = new Map<number, number[]>();
  for (const edge of edges) {
    const a = posById.get(Number(edge.source));
    const b = posById.get(Number(edge.target));
    if (!a || !b || a.y === b.y) continue; // skip spouse / same-generation links
    const [parent, child] = a.y < b.y ? [a, b] : [b, a];
    const list = childrenByParent.get(parent.id) ?? [];
    list.push(child.id);
    childrenByParent.set(parent.id, list);
  }

  const layoutBounds = computeNodeBounds(exportNodes, nodeWidth, nodeHeight);
  const root = exportNodes.find((n) => n.isRoot);
  const rootMoved = root != null && positionOverrides?.[root.id] != null;
  if (!rootMoved) {
    applyExportRootXOnly(exportNodes, nodeWidth, layoutBounds);
  }

  const bounds = computeNodeBounds(exportNodes, nodeWidth, nodeHeight);
  const connectors = buildConnectors(
    childrenByParent,
    posById,
    nodeWidth,
    nodeHeight,
  );
  const rootCenterX = root
    ? root.x + nodeWidth / 2
    : bounds.x + bounds.width / 2;

  return {
    nodes: exportNodes,
    connectors,
    nodeWidth,
    nodeHeight,
    bounds,
    rootCenterX,
  };
}
