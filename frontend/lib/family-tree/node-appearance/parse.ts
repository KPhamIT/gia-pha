import type { NodeFontWeight, NodeTextCase, NodeTextDirection } from "@/components/types/family-tree-types";
import type { NodeAppearancePatch } from "./types";

function parsePatch(raw: Record<string, unknown>): NodeAppearancePatch | null {
  const patch: NodeAppearancePatch = {};
  if (typeof raw.nodeWidth === "number") patch.nodeWidth = raw.nodeWidth;
  if (typeof raw.nodeHeight === "number") patch.nodeHeight = raw.nodeHeight;
  if (typeof raw.nodeBgColor === "string") patch.nodeBgColor = raw.nodeBgColor;
  if (typeof raw.nodeTextColor === "string") {
    patch.nodeTextColor = raw.nodeTextColor;
  }
  if (typeof raw.nodeFontSize === "number") patch.nodeFontSize = raw.nodeFontSize;
  if (
    raw.nodeFontWeight === "normal" ||
    raw.nodeFontWeight === "semibold" ||
    raw.nodeFontWeight === "bold"
  ) {
    patch.nodeFontWeight = raw.nodeFontWeight as NodeFontWeight;
  }
  if (
    raw.nodeTextDirection === "horizontal" ||
    raw.nodeTextDirection === "vertical"
  ) {
    patch.nodeTextDirection = raw.nodeTextDirection as NodeTextDirection;
  }
  if (
    raw.nodeTextCase === "none" ||
    raw.nodeTextCase === "uppercase" ||
    raw.nodeTextCase === "lowercase"
  ) {
    patch.nodeTextCase = raw.nodeTextCase as NodeTextCase;
  }
  return Object.keys(patch).length > 0 ? patch : null;
}

export function parseAppearanceMap(
  raw: unknown,
): Record<string, NodeAppearancePatch> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const result: Record<string, NodeAppearancePatch> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!val || typeof val !== "object") continue;
    const patch = parsePatch(val as Record<string, unknown>);
    if (patch) result[key] = patch;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}
