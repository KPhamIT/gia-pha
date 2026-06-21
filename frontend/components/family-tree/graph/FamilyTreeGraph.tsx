"use client";

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
} from "@xyflow/react";
import type { Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import type {
  FamilyTreeData,
  Person,
  Relationship,
  ThemeMode,
} from "@/components/types/family-tree-types";
import FamilyTreeEdge from "./FamilyTreeEdge";
import ConnectRelationshipModal from "./ConnectRelationshipModal";
import FamilyTreeNode from "./FamilyTreeNode";
import GraphViewportController, {
  GRAPH_FIT_VIEW_OPTIONS,
  GRAPH_MIN_ZOOM,
} from "./GraphViewportController";
import type { FamilyTreeLayoutConfig } from "./layout";
import type { FamilyTreeGraphApi } from "@/hooks/useFamilyTreeGraph";
import { useFamilyTreeGraph } from "@/hooks/useFamilyTreeGraph";
import "@xyflow/react/dist/base.css";

const NODE_TYPES = { custom: FamilyTreeNode };
const EDGE_TYPES = { default: FamilyTreeEdge, step: FamilyTreeEdge };

export type FamilyTreeGraphProps = {
  treeData: FamilyTreeData;
  layoutConfig?: FamilyTreeLayoutConfig;
  graphApiRef?: RefObject<FamilyTreeGraphApi | null>;
  onNodeClick?: (personId: number, person: Person) => void;
  selectedNodeId?: number | null;
  focusNodeId?: number | null;
  centerTreeKey?: number;
  onPersonAdded?: (person: Person, relationship: Relationship) => void;
  onRelationshipAdded?: (relationship: Relationship) => void;
  onRelationshipRemoved?: (relationshipId: number) => void;
  assertCanMutate?: () => boolean;
  theme?: ThemeMode;
};

function FamilyTreeGraphInner(props: FamilyTreeGraphProps) {
  const graph = useFamilyTreeGraph(props);
  const onNodeClickRef = useRef(props.onNodeClick);
  useEffect(() => {
    onNodeClickRef.current = props.onNodeClick;
  });

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const person = (node.data as { person?: Person }).person;
    if (person && onNodeClickRef.current) {
      onNodeClickRef.current(person.id, person);
    }
  }, []);

  return (
    <div className="wrapper relative h-full w-full overflow-hidden">
      <ReactFlow
        nodes={graph.enhancedNodes}
        edges={graph.enhancedEdges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        colorMode={props.theme ?? "light"}
        minZoom={GRAPH_MIN_ZOOM}
        fitView
        fitViewOptions={GRAPH_FIT_VIEW_OPTIONS}
        onlyRenderVisibleElements
        deleteKeyCode={null}
        onNodeClick={handleNodeClick}
        onNodesChange={graph.onNodesChange}
        onEdgesChange={graph.onEdgesChange}
        onConnect={graph.onConnect}
        onConnectEnd={graph.onConnectEnd}
      >
        <Background color="#f1f5f9" gap={16} />
        <Controls position="bottom-right" />
        <GraphViewportController
          focusNodeId={props.focusNodeId}
          centerTreeKey={props.centerTreeKey}
        />
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
