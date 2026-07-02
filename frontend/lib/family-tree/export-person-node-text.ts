import type { NodeFontWeight } from "@/components/types/family-tree-types";
import {
  formatNodeDisplayName,
  horizontalLineGap,
  nodeNameLines,
  verticalWordLineGap,
} from "@/lib/family-tree/node-name-lines";

export const EXPORT_NODE_SERIF =
  "'Times New Roman', 'Songti SC', serif";

const FONT_WEIGHT_SVG: Record<NodeFontWeight, number> = {
  normal: 400,
  semibold: 600,
  bold: 700,
};

export function exportNodeFontWeight(weight: NodeFontWeight): number {
  return FONT_WEIGHT_SVG[weight] ?? 600;
}

export const formatExportNodeName = formatNodeDisplayName;
export const exportNodeNameLines = nodeNameLines;

export function exportNodeTextLayout({
  lines,
  direction,
  nodeWidth,
  nodeHeight,
  fontSize,
  birthDate,
}: {
  lines: string[];
  direction: "horizontal" | "vertical";
  nodeWidth: number;
  nodeHeight: number;
  fontSize: number;
  birthDate: string;
}) {
  const lineGap =
    direction === "vertical"
      ? verticalWordLineGap(fontSize)
      : horizontalLineGap(fontSize);
  const birthFont = fontSize * 0.73;
  const birthBlock = birthDate ? birthFont + 5 : 0;
  const blockH = lines.length * lineGap + birthBlock;
  const cx = nodeWidth / 2;
  const firstBaseline = Math.max(
    fontSize + 6,
    (nodeHeight - blockH) / 2 + fontSize,
  );
  return { cx, lineGap, birthFont, firstBaseline };
}
