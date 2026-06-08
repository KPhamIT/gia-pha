'use client';

import { useMemo, useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import type { Connection, EdgeChange } from '@xyflow/react';
import FamilyTreeEdge from './FamilyTreeEdge';
import '@xyflow/react/dist/style.css';
import { FamilyTreeData, Person, RelationshipType } from '../types/family-tree-types';
import FamilyTreeNode from './FamilyTreeNode';
import { buildFamilyTreeGraph, FamilyTreeLayoutConfig } from './FamilyTreeGraphLayout';
import { api } from '@/lib/api';

type FamilyTreeGraphProps = {
  treeData: FamilyTreeData;
  layoutConfig?: FamilyTreeLayoutConfig;
  onNodeClick?: (personId: number, person: Person) => void;
  selectedNodeId?: number | null;
};

const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  FATHER: 'Bố',
  MOTHER: 'Mẹ',
  CHILD: 'Con',
  SPOUSE: 'Vợ/Chồng',
};

export default function FamilyTreeGraph({
  treeData,
  layoutConfig,
  onNodeClick,
  selectedNodeId,
}: FamilyTreeGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildFamilyTreeGraph(treeData, layoutConfig),
    [treeData, layoutConfig],
  );

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [pendingType, setPendingType] = useState<RelationshipType>('CHILD');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const enhancedNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      selected: node.id === String(selectedNodeId),
      data: {
        ...node.data,
        onNodeClick: () => {
          const person = (node.data as any).person as Person | undefined;
          if (onNodeClick && person) {
            onNodeClick(person.id, person);
          }
        },
      },
    }));
  }, [nodes, selectedNodeId, onNodeClick]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    // Chỉ xử lý non-remove changes — việc xóa do nút × trong FamilyTreeEdge đảm nhận
    const nonRemoveChanges = changes.filter((c) => c.type !== 'remove');
    if (nonRemoveChanges.length > 0) {
      setEdges((eds) => applyEdgeChanges(nonRemoveChanges, eds));
    }
  }, []);

  const onConnect = useCallback((params: Connection) => {
    setSaveError(null);
    setPendingConnection(params);
    setPendingType('CHILD');
  }, []);

  const handleConfirmConnection = async () => {
    if (!pendingConnection) return;
    const fromId = Number(pendingConnection.source);
    const toId = Number(pendingConnection.target);
    try {
      setSaving(true);
      setSaveError(null);
      const newRel = await api.relationship.create({ fromId, toId, type: pendingType });
      setEdges((eds) => addEdge({ ...pendingConnection, data: { relationshipId: newRel.id } }, eds));
      setPendingConnection(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Lỗi khi lưu quan hệ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ReactFlow
        nodes={enhancedNodes}
        edges={edges}
        nodeTypes={{ default: FamilyTreeNode }}
        edgeTypes={{ default: FamilyTreeEdge, step: FamilyTreeEdge }}
        minZoom={0.1}
        fitView
        deleteKeyCode={null}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background color="#f1f5f9" gap={16} />
        <Controls position="bottom-right" />
      </ReactFlow>

      {pendingConnection && (
        <div className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl">
          <p className="mb-3 text-sm font-semibold text-slate-700">Chọn loại quan hệ</p>
          <div className="flex items-center gap-3">
            <select
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={pendingType}
              onChange={(e) => setPendingType(e.target.value as RelationshipType)}
            >
              {(Object.keys(RELATIONSHIP_LABELS) as RelationshipType[]).map((type) => (
                <option key={type} value={type}>{RELATIONSHIP_LABELS[type]}</option>
              ))}
            </select>
            <button
              onClick={handleConfirmConnection}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              onClick={() => { setPendingConnection(null); setSaveError(null); }}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
            </button>
          </div>
          {saveError && <p className="mt-2 text-xs text-red-500">{saveError}</p>}
        </div>
      )}
    </div>
  );
}
