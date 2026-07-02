import type { ExportModel } from "@/lib/family-tree/export-tree-svg";
import type { NodeFontWeight } from "@/components/types/family-tree-types";
import type { NodeCardStyle } from "@/lib/family-tree/svg-border";
import {
  EXPORT_NODE_SERIF,
  exportNodeFontWeight,
  exportNodeNameLines,
  exportNodeTextLayout,
  formatExportNodeName,
} from "@/lib/family-tree/export-person-node-text";
import { formatBirthDate } from "./tree-export-svg-utils";

type Props = {
  node: ExportModel["nodes"][number];
  nodeCard: NodeCardStyle;
  nodeBorderColor: string;
};

function ExportNodeName({
  lines,
  cx,
  firstBaseline,
  lineGap,
  fontSize,
  fontWeight,
  textColor,
}: {
  lines: string[];
  cx: number;
  firstBaseline: number;
  lineGap: number;
  fontSize: number;
  fontWeight: NodeFontWeight;
  textColor: string;
}) {
  const weight = exportNodeFontWeight(fontWeight);
  return (
    <text
      textAnchor="middle"
      fontFamily={EXPORT_NODE_SERIF}
      fontWeight={weight}
      fontSize={fontSize}
      fill={textColor}
    >
      {lines.map((line, i) => (
        <tspan key={i} x={cx} y={firstBaseline + i * lineGap}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

/** One person card inside the exported tree SVG. */
export default function ExportPersonNode({
  node,
  nodeCard,
  nodeBorderColor,
}: Props) {
  const { appearance } = node;
  const {
    nodeWidth,
    nodeHeight,
    nodeBgColor,
    nodeTextColor,
    nodeFontSize,
    nodeFontWeight,
    nodeTextDirection,
    nodeTextCase,
  } = appearance;
  const displayName = formatExportNodeName(node.fullName, nodeTextCase);
  const lines = exportNodeNameLines(displayName, nodeTextDirection);
  const birth = formatBirthDate(node.birthDate);
  const { cx, lineGap, birthFont, firstBaseline } = exportNodeTextLayout({
    lines,
    direction: nodeTextDirection,
    nodeWidth,
    nodeHeight,
    fontSize: nodeFontSize,
    birthDate: birth,
  });
  const nameEndY = firstBaseline + Math.max(lines.length - 1, 0) * lineGap;
  const birthY =
    nodeTextDirection === "vertical"
      ? nameEndY + lineGap
      : firstBaseline + lines.length * lineGap + 4;

  return (
    <g transform={`translate(${node.x} ${node.y})`}>
      {nodeCard.render(
        nodeWidth,
        nodeHeight,
        nodeBgColor,
        nodeBorderColor,
        node.isRoot ? 2.5 : 1.5,
      )}
      <ExportNodeName
        lines={lines}
        cx={cx}
        firstBaseline={firstBaseline}
        lineGap={lineGap}
        fontSize={nodeFontSize}
        fontWeight={nodeFontWeight}
        textColor={nodeTextColor}
      />
      {birth ? (
        <text
          x={cx}
          y={birthY}
          textAnchor="middle"
          fontFamily={EXPORT_NODE_SERIF}
          fontSize={birthFont}
          fill={nodeTextColor}
          opacity={0.7}
        >
          {birth}
        </text>
      ) : null}
    </g>
  );
}
