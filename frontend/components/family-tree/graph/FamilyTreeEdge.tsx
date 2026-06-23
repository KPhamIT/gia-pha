"use client";

import { memo } from "react";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import type { FamilyTreeEdgeData } from "@/components/types/family-tree-types";
import { deleteRelationshipById } from "@/lib/family-tree/mutations";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";

function FamilyTreeEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const edgeData = data as FamilyTreeEdgeData | undefined;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!edgeData?.relationshipId) return;

    try {
      await deleteRelationshipById(edgeData.relationshipId);
      edgeData.onRelationshipRemoved?.(edgeData.relationshipId);
      notify.success(UI.TOAST_RELATIONSHIP_DELETED);
    } catch (error) {
      notify.error(error, UI.ERR_DELETE_RELATIONSHIP);
    }
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: selected ? "#d97706" : "#94a3b8",
          strokeWidth: selected ? 2 : 1.5,
        }}
      />
      {edgeData?.canEdit ? (
        <EdgeLabelRenderer>
          <button
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className={`nodrag nopan flex h-6 w-6 items-center justify-center rounded-full border bg-white text-sm shadow-sm transition-opacity ${
              selected
                ? "border-red-400 text-red-500 opacity-100"
                : "border-slate-300 text-slate-400 opacity-0 group-hover:opacity-100"
            }`}
            onClick={handleDelete}
            aria-label={UI.DELETE_LINK}
            title={UI.DELETE_LINK}
          >
            ×
          </button>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

export default memo(FamilyTreeEdge);
