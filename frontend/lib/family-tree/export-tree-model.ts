import type { FamilyTreeData } from "@/components/types/family-tree-types";
import {
  buildFamilyTreeGraph,
  NODE_HEIGHT,
  NODE_WIDTH,
  type FamilyTreeLayoutConfig,
} from "@/components/family-tree/graph/layout";
import {
  DEFAULT_NODE_APPEARANCE,
  type ResolvedNodeAppearance,
} from "@/lib/family-tree/node-appearance";
import type { NodePositionOverrides } from "./node-position-overrides";

export type Rect = { x: number; y: number; width: number; height: number };

export type ExportNode = {
  id: number;
  x: number;
  y: number;
  fullName: string;
  birthDate: string | null;
  isRoot: boolean;
  appearance: ResolvedNodeAppearance;
};

type FlowNodeData = {
  fullName?: string;
  birthDate?: string | null;
  isRoot?: boolean;
  personId?: number;
} & Partial<ResolvedNodeAppearance>;

function appearanceFromFlowData(data: FlowNodeData): ResolvedNodeAppearance {
  return {
    nodeWidth: data.nodeWidth ?? DEFAULT_NODE_APPEARANCE.nodeWidth,
    nodeHeight: data.nodeHeight ?? DEFAULT_NODE_APPEARANCE.nodeHeight,
    nodeBgColor: data.nodeBgColor ?? DEFAULT_NODE_APPEARANCE.nodeBgColor,
    nodeTextColor: data.nodeTextColor ?? DEFAULT_NODE_APPEARANCE.nodeTextColor,
    nodeFontSize: data.nodeFontSize ?? DEFAULT_NODE_APPEARANCE.nodeFontSize,
    nodeFontWeight:
      data.nodeFontWeight ?? DEFAULT_NODE_APPEARANCE.nodeFontWeight,
    nodeTextDirection:
      data.nodeTextDirection ?? DEFAULT_NODE_APPEARANCE.nodeTextDirection,
    nodeTextCase: data.nodeTextCase ?? DEFAULT_NODE_APPEARANCE.nodeTextCase,
  };
}

function nodeSize(node: ExportNode) {
  return {
    width: node.appearance.nodeWidth,
    height: node.appearance.nodeHeight,
  };
}

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

function computeNodeBounds(exportNodes: ExportNode[]): Rect {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of exportNodes) {
    const { width, height } = nodeSize(n);
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + width);
    maxY = Math.max(maxY, n.y + height);
  }
  if (!Number.isFinite(minX)) {
    minX = 0;
    minY = 0;
    maxX = NODE_WIDTH;
    maxY = NODE_HEIGHT;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function buildConnectors(
  childrenByParent: Map<number, number[]>,
  posById: Map<number, ExportNode>,
): string[] {
  const connectors: string[] = [];
  for (const [parentId, childIds] of childrenByParent) {
    const parent = posById.get(parentId);
    if (!parent) continue;
    const children = childIds
      .map((id) => posById.get(id))
      .filter((c): c is ExportNode => Boolean(c));
    if (children.length === 0) continue;

    const parentSize = nodeSize(parent);
    const stemX = parent.x + parentSize.width / 2;
    const parentBottomY = parent.y + parentSize.height;
    const childCenters = children.map((c) => {
      const childSize = nodeSize(c);
      return {
        x: c.x + childSize.width / 2,
        top: c.y,
      };
    });
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

/** Horizontal spouse links: right edge of left partner → left edge of right. */
function buildSpouseConnectors(
  pairs: Array<{ left: ExportNode; right: ExportNode }>,
): string[] {
  return pairs.map(({ left, right }) => {
    const leftSize = nodeSize(left);
    const y = left.y + leftSize.height / 2;
    const x1 = left.x + leftSize.width;
    const x2 = right.x;
    return `M ${x1} ${y} L ${x2} ${y}`;
  });
}

/**
 * Export-only: move the root (first ancestor) to the horizontal centre of the
 * tree extent. No other node coordinates are changed — layout algorithm untouched.
 */
function applyExportRootXOnly(
  exportNodes: ExportNode[],
  layoutBounds: Rect,
): void {
  const root = exportNodes.find((n) => n.isRoot);
  if (!root) return;
  const { width } = nodeSize(root);
  root.x = layoutBounds.x + layoutBounds.width / 2 - width / 2;
}

/** Build the geometric model (positioned nodes + connector paths) for the tree. */
export function buildExportModel(
  treeData: FamilyTreeData,
  layoutConfig: FamilyTreeLayoutConfig = {},
  positionOverrides?: NodePositionOverrides,
): ExportModel {
  const { nodes, edges } = buildFamilyTreeGraph(treeData, layoutConfig);
  const defaultWidth = layoutConfig.nodeWidth ?? NODE_WIDTH;
  const defaultHeight = layoutConfig.nodeHeight ?? NODE_HEIGHT;

  const exportNodes: ExportNode[] = nodes.map((node) => {
    const data = node.data as FlowNodeData;
    const id = data.personId ?? Number(node.id);
    const override = positionOverrides?.[id];
    return {
      id,
      x: override?.x ?? node.position.x,
      y: override?.y ?? node.position.y,
      fullName: data.fullName ?? "",
      birthDate: data.birthDate ?? null,
      isRoot: Boolean(data.isRoot),
      appearance: appearanceFromFlowData(data),
    };
  });

  const posById = new Map(exportNodes.map((n) => [n.id, n]));

  // Group children by parent; collect same-row spouse links separately.
  const childrenByParent = new Map<number, number[]>();
  const spousePairs: Array<{ left: ExportNode; right: ExportNode }> = [];
  const seenSpouse = new Set<string>();
  for (const edge of edges) {
    const a = posById.get(Number(edge.source));
    const b = posById.get(Number(edge.target));
    if (!a || !b) continue;
    if (a.y === b.y) {
      const [left, right] = a.x <= b.x ? [a, b] : [b, a];
      const key = `${left.id}-${right.id}`;
      if (seenSpouse.has(key)) continue;
      seenSpouse.add(key);
      spousePairs.push({ left, right });
      continue;
    }
    const [parent, child] = a.y < b.y ? [a, b] : [b, a];
    const list = childrenByParent.get(parent.id) ?? [];
    list.push(child.id);
    childrenByParent.set(parent.id, list);
  }

  const layoutBounds = computeNodeBounds(exportNodes);
  const root = exportNodes.find((n) => n.isRoot);
  const rootMoved = root != null && positionOverrides?.[root.id] != null;
  if (!rootMoved) {
    applyExportRootXOnly(exportNodes, layoutBounds);
  }

  const bounds = computeNodeBounds(exportNodes);
  const connectors = [
    ...buildConnectors(childrenByParent, posById),
    ...buildSpouseConnectors(spousePairs),
  ];
  const rootCenterX = root
    ? root.x + nodeSize(root).width / 2
    : bounds.x + bounds.width / 2;

  return {
    nodes: exportNodes,
    connectors,
    nodeWidth: defaultWidth,
    nodeHeight: defaultHeight,
    bounds,
    rootCenterX,
  };
}
