import type { LayoutConfig } from "@/components/types/family-tree-types";
import type { FamilyTreeLayoutConfig } from "@/components/family-tree/graph/layout";
import {
  NODE_HEIGHT,
  NODE_WIDTH,
} from "@/components/family-tree/graph/layout";
import type {
  NodeAppearancePatch,
  NodeAppearanceValues,
  ResolvedNodeAppearance,
} from "./types";

export const DEFAULT_NODE_APPEARANCE: NodeAppearanceValues = {
  nodeWidth: NODE_WIDTH,
  nodeHeight: NODE_HEIGHT,
  nodeBgColor: "#ffffff",
  nodeTextColor: "#0f172a",
  nodeFontSize: 18,
  nodeFontWeight: "semibold",
  nodeTextDirection: "vertical",
  nodeTextCase: "none",
};

export type NodeAppearanceConfig = LayoutConfig | FamilyTreeLayoutConfig;

function globalBase(config: NodeAppearanceConfig): NodeAppearanceValues {
  return {
    nodeWidth: config.nodeWidth ?? DEFAULT_NODE_APPEARANCE.nodeWidth,
    nodeHeight: config.nodeHeight ?? DEFAULT_NODE_APPEARANCE.nodeHeight,
    nodeBgColor: config.nodeBgColor ?? DEFAULT_NODE_APPEARANCE.nodeBgColor,
    nodeTextColor:
      config.nodeTextColor ?? DEFAULT_NODE_APPEARANCE.nodeTextColor,
    nodeFontSize: config.nodeFontSize ?? DEFAULT_NODE_APPEARANCE.nodeFontSize,
    nodeFontWeight:
      config.nodeFontWeight ?? DEFAULT_NODE_APPEARANCE.nodeFontWeight,
    nodeTextDirection:
      config.nodeTextDirection ?? DEFAULT_NODE_APPEARANCE.nodeTextDirection,
    nodeTextCase: config.nodeTextCase ?? DEFAULT_NODE_APPEARANCE.nodeTextCase,
  };
}

function mergePatch(
  base: NodeAppearanceValues,
  patch?: NodeAppearancePatch,
): ResolvedNodeAppearance {
  if (!patch) return base;
  return { ...base, ...patch };
}

/** Mặc định toàn cây (không theo node / đời). */
export function resolveGlobalNodeAppearance(
  config: NodeAppearanceConfig,
): ResolvedNodeAppearance {
  return globalBase(config);
}

/** Kiểu đã gộp cho một đời thứ. */
export function resolveLevelNodeAppearance(
  generation: number | null | undefined,
  config: NodeAppearanceConfig,
): ResolvedNodeAppearance {
  const base = globalBase(config);
  if (generation == null) return base;
  return mergePatch(base, config.levelStyles?.[String(generation)]);
}

/** Kiểu đã gộp cho một thành viên: node → đời → mặc định. */
export function resolvePersonNodeAppearance(
  personId: number,
  generation: number | null | undefined,
  config: NodeAppearanceConfig,
): ResolvedNodeAppearance {
  const level = resolveLevelNodeAppearance(generation, config);
  return mergePatch(level, config.nodeStyles?.[String(personId)]);
}
