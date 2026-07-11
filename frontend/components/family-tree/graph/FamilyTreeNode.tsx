import { Handle, Position } from "@xyflow/react";
import { memo } from "react";
import type { NodeFontWeight, NodeTextCase, NodeTextDirection } from "@/components/types/family-tree-types";
import { NODE_HEIGHT, NODE_WIDTH } from "@/components/family-tree/graph/layout";
import {
  formatNodeDisplayName,
  nodeNameLines,
  verticalWordLineGap,
} from "@/lib/family-tree/node-name-lines";
import { DEFAULT_NODE_APPEARANCE } from "@/lib/family-tree/node-appearance";

type PersonNodeData = {
  fullName: string;
  avatar?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  deathDate?: string | null;
  isRoot: boolean;
  personId?: number;
  hasSpouseLeft?: boolean;
  hasSpouseRight?: boolean;
  hasChildSource?: boolean;
  hasChildTarget?: boolean;
  nodeBgColor?: string;
  nodeTextColor?: string;
  nodeWidth?: number;
  nodeHeight?: number;
  nodeFontSize?: number;
  nodeFontWeight?: NodeFontWeight;
  nodeTextDirection?: NodeTextDirection;
  nodeTextCase?: NodeTextCase;
};

type FamilyTreeNodeProps = {
  data: PersonNodeData;
  selected?: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN");

const FONT_WEIGHT_CLASS: Record<NodeFontWeight, string> = {
  normal: "font-normal",
  semibold: "font-semibold",
  bold: "font-bold",
};

function formatPersonDate(value?: string | null) {
  if (!value) return "";
  return dateFormatter.format(new Date(value));
}

function PersonNameLabel({
  fullName,
  fontSize,
  fontWeight,
  direction,
  textCase,
}: {
  fullName: string;
  fontSize: number;
  fontWeight: NodeFontWeight;
  direction: NodeTextDirection;
  textCase: NodeTextCase;
}) {
  const weightClass = FONT_WEIGHT_CLASS[fontWeight] ?? "font-semibold";
  const displayName = formatNodeDisplayName(fullName, textCase);
  const lines = nodeNameLines(displayName, direction);

  if (direction === "vertical") {
    const lineGap = verticalWordLineGap(fontSize);
    return (
      <div
        className={`${weightClass} flex flex-col items-center`}
        style={{ fontSize, gap: Math.max(4, lineGap - fontSize) }}
      >
        {lines.map((word, i) => (
          <span key={`${i}-${word}`} className="block text-center leading-none">
            {word}
          </span>
        ))}
      </div>
    );
  }

  return (
    <p
      className={`${weightClass} text-center`}
      style={{ fontSize, whiteSpace: "nowrap" }}
    >
      {displayName}
    </p>
  );
}

function FamilyTreeNode({ data, selected }: FamilyTreeNodeProps) {
  const birthLabel = formatPersonDate(data.birthDate);
  const deathLabel = formatPersonDate(data.deathDate);
  const fontSize = data.nodeFontSize ?? 18;
  const fontWeight = data.nodeFontWeight ?? "semibold";
  const textDirection =
    data.nodeTextDirection ?? DEFAULT_NODE_APPEARANCE.nodeTextDirection;
  const textCase = data.nodeTextCase ?? "none";
  const dateFontSize = Math.max(10, fontSize - 6);

  return (
    <div
      style={{
        backgroundColor: data.nodeBgColor ?? "#ffffff",
        color: data.nodeTextColor ?? "#0f172a",
        width: data.nodeWidth ?? NODE_WIDTH,
        height: data.nodeHeight ?? NODE_HEIGHT,
      }}
      className={`flex flex-col px-2 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 ${
        selected
          ? "border-amber-600 shadow-lg ring-2 ring-amber-300"
          : "border-slate-200 shadow-sm hover:border-amber-400"
      }`}
    >
      {data.hasChildTarget ? (
        <Handle id="child-target" type="target" position={Position.Top} />
      ) : null}
      {data.hasSpouseLeft ? (
        <Handle
          id="spouse-left"
          type="target"
          position={Position.Left}
          className="!bg-stone-400"
        />
      ) : null}
      {data.hasSpouseRight ? (
        <Handle
          id="spouse-right"
          type="source"
          position={Position.Right}
          className="!bg-stone-400"
        />
      ) : null}
      <div className="flex min-h-0 flex-1 items-center justify-center py-1">
        <PersonNameLabel
          fullName={data.fullName}
          fontSize={fontSize}
          fontWeight={fontWeight}
          direction={textDirection}
          textCase={textCase}
        />
      </div>
      {birthLabel || deathLabel ? (
        <div
          className="shrink-0 text-center leading-tight"
          style={{ fontSize: dateFontSize }}
        >
          {birthLabel ? (
            <div className="font-semibold opacity-90">{birthLabel}</div>
          ) : null}
          {deathLabel ? (
            <div className="font-normal opacity-60">{deathLabel}</div>
          ) : null}
        </div>
      ) : null}
      {data.hasChildSource ? (
        <Handle id="child-source" type="source" position={Position.Bottom} />
      ) : null}
    </div>
  );
}

export default memo(FamilyTreeNode);
