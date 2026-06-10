'use client';

import { ReactFlow, ReactFlowProvider, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { FamilyTreeData, Person, Relationship } from '../types/family-tree-types';
import FamilyTreeEdge from './FamilyTreeEdge';
import ConnectRelationshipModal from './ConnectRelationshipModal';
import FamilyTreeNode from './FamilyTreeNode';
import type { FamilyTreeLayoutConfig } from './FamilyTreeGraphLayout';
import { useFamilyTreeGraph } from '@/hooks/useFamilyTreeGraph';

export type FamilyTreeGraphProps = {
  treeData: FamilyTreeData;
  layoutConfig?: FamilyTreeLayoutConfig;
  onNodeClick?: (personId: number, person: Person) => void;
  selectedNodeId?: number | null;
  onPersonAdded?: (person: Person, relationship: Relationship) => void;
  onRelationshipAdded?: (relationship: Relationship) => void;
  onRelationshipRemoved?: (relationshipId: number) => void;
};

function FamilyTreeGraphInner(props: FamilyTreeGraphProps) {
  const graph = useFamilyTreeGraph(props);

  return (
    <div className="wrapper relative h-full w-full overflow-hidden">
      <ReactFlow
        nodes={graph.enhancedNodes}
        edges={graph.enhancedEdges}
        nodeTypes={{ default: FamilyTreeNode }}
        edgeTypes={{ default: FamilyTreeEdge, step: FamilyTreeEdge }}
        minZoom={0.1}
        fitView
        deleteKeyCode={null}
        onNodesChange={graph.onNodesChange}
        onEdgesChange={graph.onEdgesChange}
        onConnect={graph.onConnect}
        onConnectEnd={graph.onConnectEnd}
      >
        <Background color="#f1f5f9" gap={16} />
        <Controls position="bottom-right" />
      </ReactFlow>

      {graph.saveError ? (
        <div className="absolute bottom-4 left-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {graph.saveError}
        </div>
      ) : null}

      {graph.pendingConnection ? (
        <ConnectRelationshipModal
          pendingType={graph.pendingType}
          saving={graph.saving}
          saveError={graph.saveError}
          onTypeChange={graph.setPendingType}
          onConfirm={graph.confirmConnection}
          onCancel={graph.cancelConnection}
        />
      ) : null}
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
