import type { ExportModel } from '@/lib/family-tree/export-tree-svg';
import type { NodeCardStyle } from '@/lib/family-tree/svg-border';
import { SERIF, formatBirthDate } from './tree-export-svg-utils';

type Props = {
  node: ExportModel['nodes'][number];
  nodeWidth: number;
  nodeHeight: number;
  nodeCard: NodeCardStyle;
  nodeBgColor: string;
  nodeTextColor: string;
  nodeBorderColor: string;
  nodeFontSize: number;
};

/** One person card inside the exported tree SVG. */
export default function ExportPersonNode({
  node,
  nodeWidth,
  nodeHeight,
  nodeCard,
  nodeBgColor,
  nodeTextColor,
  nodeBorderColor,
  nodeFontSize,
}: Props) {
  const words = node.fullName.trim().split(/\s+/).filter(Boolean);
  const cx = nodeWidth / 2;
  const lineH = nodeFontSize * 1.2;
  const birthFont = nodeFontSize * 0.73;
  const birth = formatBirthDate(node.birthDate);
  const blockH = words.length * lineH + (birth ? birthFont + 5 : 0);
  const firstBaseline = Math.max(nodeFontSize + 6, (nodeHeight - blockH) / 2 + nodeFontSize);

  return (
    <g transform={`translate(${node.x} ${node.y})`}>
      {nodeCard.render(nodeWidth, nodeHeight, nodeBgColor, nodeBorderColor, node.isRoot ? 2.5 : 1.5)}
      <text x={cx} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={nodeFontSize} fill={nodeTextColor}>
        {words.map((word, i) => (
          <tspan key={i} x={cx} y={firstBaseline + i * lineH}>
            {word}
          </tspan>
        ))}
      </text>
      {birth ? (
        <text
          x={cx}
          y={firstBaseline + words.length * lineH + 4}
          textAnchor="middle"
          fontFamily={SERIF}
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
