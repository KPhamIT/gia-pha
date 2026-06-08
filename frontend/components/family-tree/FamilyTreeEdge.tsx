'use client';

import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, useReactFlow } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { api } from '@/lib/api';

export default function FamilyTreeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const relationshipId = (data as Record<string, unknown>)?.relationshipId as number | undefined;
    if (!relationshipId) return;
    try {
      await api.relationship.delete(relationshipId);
      setEdges((eds) => eds.filter((edge) => edge.id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa quan hệ:', err);
    }
  };

  return (
    <>
      <BaseEdge path={edgePath} style={{ stroke: selected ? '#3b82f6' : '#94a3b8', strokeWidth: selected ? 2 : 1.5 }} />
      <EdgeLabelRenderer>
        <button
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className={`nodrag nopan flex h-5 w-5 items-center justify-center rounded-full border bg-white text-xs shadow-sm transition-opacity ${
            selected
              ? 'border-red-400 text-red-500 opacity-100'
              : 'border-slate-300 text-slate-400 opacity-0 group-hover:opacity-100'
          }`}
          onClick={handleDelete}
          title="Xóa liên kết"
        >
          ×
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
