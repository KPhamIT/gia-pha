'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges, useReactFlow } from '@xyflow/react';
import type { Connection, EdgeChange, Node, NodeChange, FinalConnectionState } from '@xyflow/react';
import FamilyTreeEdge from './FamilyTreeEdge';
import ConnectRelationshipModal from './ConnectRelationshipModal';
import '@xyflow/react/dist/style.css';
import { FamilyTreeData, Person, RelationshipType } from '../types/family-tree-types';
import FamilyTreeNode from './FamilyTreeNode';
import { buildFamilyTreeGraph, FamilyTreeLayoutConfig } from './FamilyTreeGraphLayout';
import { api } from '@/lib/api';
import { useCreateChild } from '@/hooks/useCreateChild';

type FamilyTreeGraphProps = {
  treeData: FamilyTreeData;
  layoutConfig?: FamilyTreeLayoutConfig;
  onNodeClick?: (personId: number, person: Person) => void;
  selectedNodeId?: number | null;
};

function FamilyTreeGraphInner({
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
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const { createChild } = useCreateChild();

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
    (changes: NodeChange<Node>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
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

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      if (!connectionState.isValid && connectionState.fromNode) {
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;
        const position = screenToFlowPosition({ x: clientX, y: clientY });
        const fromNodeId = connectionState.fromNode.id;
        const fromId = Number(fromNodeId);

        (async () => {
          try {
            if (!connectionState.fromNode) return

            const { person, relationship } = await createChild(fromId, { fullName: 'Người mới' }, connectionState.fromNode.data.person as Person);

            setNodes((nds) => nds.concat({
              id: person.id.toString(),
              type: 'default',
              position,
              data: {
                fullName: person.fullName,
                avatar: person.avatar,
                gender: person.gender,
                birthDate: person.birthDate,
                isRoot: false,
                personId: person.id,
                person,
              },
              origin: [0.5, 0.0] as [number, number],
            }));
            setEdges((eds) =>
              eds.concat({
                id: relationship.id.toString(),
                source:  person.id.toString() ,
                target: fromNodeId,
                data: { relationshipId: relationship.id },
              }),
            );
          } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Lỗi khi tạo người mới');
          }
        })();
      }
    },
    [screenToFlowPosition, createChild],
  );

  return (
    <div className="relative h-full w-full overflow-hidden wrapper" ref={reactFlowWrapper}>
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
        onConnectEnd={onConnectEnd}
      >
        <Background color="#f1f5f9" gap={16} />
        <Controls position="bottom-right" />
      </ReactFlow>

      {pendingConnection && (
        <ConnectRelationshipModal
          pendingType={pendingType}
          saving={saving}
          saveError={saveError}
          onTypeChange={setPendingType}
          onConfirm={handleConfirmConnection}
          onCancel={() => { setPendingConnection(null); setSaveError(null); }}
        />
      )}
    </div>
  );
}

export default function FamilyTreeGraph(props: FamilyTreeGraphProps) {
  return (
    <ReactFlowProvider>
      <FamilyTreeGraphInner {...props} />
    </ReactFlowProvider>
  );
}
