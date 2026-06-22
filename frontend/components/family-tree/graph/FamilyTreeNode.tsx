import { Handle, Position } from "@xyflow/react";
import { memo } from "react";
import { NODE_HEIGHT, NODE_WIDTH } from "@/components/family-tree/graph/layout";

type PersonNodeData = {
  fullName: string;
  avatar?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  isRoot: boolean;
  personId?: number;
  nodeBgColor?: string;
  nodeTextColor?: string;
  nodeWidth?: number;
  nodeHeight?: number;
};

type FamilyTreeNodeProps = {
  data: PersonNodeData;
  selected?: boolean;
};

const birthDateFormatter = new Intl.DateTimeFormat("vi-VN");

function formatBirthDate(birthDate?: string | null) {
  if (!birthDate) return "";
  return birthDateFormatter.format(new Date(birthDate));
}

function FamilyTreeNode({ data, selected }: FamilyTreeNodeProps) {
  const birthDate = formatBirthDate(data.birthDate);

  return (
    <div
      style={{
        backgroundColor: data.nodeBgColor ?? "#ffffff",
        color: data.nodeTextColor ?? "#0f172a",
        width: data.nodeWidth ?? NODE_WIDTH,
        height: data.nodeHeight ?? NODE_HEIGHT,
      }}
      className={`px-2 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 ${
        selected
          ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
          : "border-slate-200 shadow-sm hover:border-blue-300"
      }`}
    >
      <Handle type="source" position={Position.Top} />
      <div className="flex flex-col items-center">
        {data.fullName.split(" ").map((word, i) => (
          <p key={i} className="font-semibold text-lg leading-snug text-center">
            {word}
          </p>
        ))}
      </div>
      {birthDate ? (
        <div className="mt-2 text-center text-xs opacity-70">{birthDate}</div>
      ) : null}
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
}

export default memo(FamilyTreeNode);
