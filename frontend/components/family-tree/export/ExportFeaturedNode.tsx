import type { ExportNode } from "@/lib/family-tree/export-tree-model";
import type { NodeCardStyle } from "@/lib/family-tree/svg-border";
import {
  EXPORT_NODE_SERIF,
  exportNodeFontWeight,
  formatExportNodeName,
} from "@/lib/family-tree/export-person-node-text";
import { featuredMaxFont, featuredNodeLayout } from "@/lib/family-tree/export-featured-node-text";
import { formatBirthDate } from "./tree-export-svg-utils";

type Props = {
  node: ExportNode;
  nodeCard: NodeCardStyle;
  nodeBorderColor: string;
  filter?: string;
  /** Nền thay màu đặc (đời 3 dùng gradient thẻ thường). */
  fillOverride?: string;
};

function featuredCaption(node: ExportNode): string {
  return ["THỦY TỔ", "ĐỜI THỨ HAI", "ĐỜI THỨ BA"][node.featuredRank ?? 1]!;
}

function Diamond({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return <path d={`M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z`} fill={fill} />;
}

/** Khung ngang lớn cho thủy tổ và đời thứ hai trên bản in. */
export default function ExportFeaturedNode(p: Props) {
  const { node, nodeCard, nodeBorderColor, filter, fillOverride } = p;
  const {
    nodeWidth: w,
    nodeHeight: h,
    nodeBgColor,
    nodeTextColor,
    nodeFontSize,
    nodeFontWeight,
    nodeTextCase,
  } = node.appearance;
  const name = formatExportNodeName(node.fullName, nodeTextCase);
  const caption = featuredCaption(node);
  const showCaption = caption.toLowerCase() !== name.toLowerCase();
  const birth = formatBirthDate(node.birthDate);

  const {
    inset,
    cx,
    captionFont,
    captionY,
    ruleHalf,
    birthFont,
    birthY,
    lines,
    fontSize,
    lineGap,
    firstBaseline,
  } = featuredNodeLayout({
    width: w,
    height: h,
    name,
    caption: showCaption ? caption : null,
    hasBirth: Boolean(birth),
    // Khung rộng: cho chữ lớn theo chiều cao khung, tự thu nếu tên dài.
    maxFontSize: featuredMaxFont(node.featuredRank ?? 1, h, nodeFontSize),
  });

  return (
    <g transform={`translate(${node.x} ${node.y})`} filter={filter}>
      {nodeCard.render(w, h, fillOverride ?? nodeBgColor, nodeBorderColor, node.isRoot ? 2.5 : 2)}
      <rect
        x={inset}
        y={inset}
        width={w - inset * 2}
        height={h - inset * 2}
        rx={3}
        fill="none"
        stroke={nodeBorderColor}
        strokeWidth={1.2}
      />
      <rect
        x={inset + 3}
        y={inset + 3}
        width={w - inset * 2 - 6}
        height={h - inset * 2 - 6}
        rx={2}
        fill="none"
        stroke={nodeBorderColor}
        strokeWidth={0.6}
        opacity={0.7}
      />
      {[inset + 3, w - inset - 3].map((x) =>
        [inset + 3, h - inset - 3].map((y) => (
          <Diamond key={`${x}-${y}`} cx={x} cy={y} r={inset * 0.55} fill={nodeBorderColor} />
        )),
      )}

      {showCaption ? (
        <g>
          <text
            x={cx}
            y={captionY}
            textAnchor="middle"
            fontFamily={EXPORT_NODE_SERIF}
            fontWeight={600}
            fontSize={captionFont}
            letterSpacing={captionFont * 0.25}
            fill={nodeTextColor}
            opacity={0.8}
          >
            {caption}
          </text>
          <line
            x1={cx - ruleHalf}
            x2={cx + ruleHalf}
            y1={captionY + captionFont * 0.45}
            y2={captionY + captionFont * 0.45}
            stroke={nodeBorderColor}
            strokeWidth={0.8}
          />
          <Diamond
            cx={cx}
            cy={captionY + captionFont * 0.45}
            r={captionFont * 0.28}
            fill={nodeBorderColor}
          />
        </g>
      ) : null}

      <text
        textAnchor="middle"
        fontFamily={EXPORT_NODE_SERIF}
        fontWeight={exportNodeFontWeight(nodeFontWeight)}
        fontSize={fontSize}
        fill={nodeTextColor}
      >
        {lines.map((line, i) => (
          <tspan key={i} x={cx} y={firstBaseline + i * lineGap}>
            {line}
          </tspan>
        ))}
      </text>

      {birth ? (
        <text
          x={cx}
          y={birthY}
          textAnchor="middle"
          fontFamily={EXPORT_NODE_SERIF}
          fontSize={birthFont}
          fill={nodeTextColor}
          opacity={0.75}
        >
          {birth}
        </text>
      ) : null}
    </g>
  );
}
