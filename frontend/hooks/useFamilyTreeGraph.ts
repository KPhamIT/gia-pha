'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import type { Edge, EdgeChange, Node, NodeChange } from '@xyflow/react';
import { buildFamilyTreeGraph, FamilyTreeLayoutConfig } from '@/components/family-tree/graph/layout';
import type { FamilyTreeData, Person, Relationship } from '@/components/types/family-tree-types';
import { collectMovedNodePositions, type NodePositionOverrides } from '@/lib/family-tree/node-position-overrides';
import { useGraphConnections } from '@/hooks/useGraphConnections';

export type FamilyTreeGraphApi = {
  collectMovedNodePositions: () => NodePositionOverrides;
};

type UseFamilyTreeGraphOptions = {
  treeData: FamilyTreeData;
  layoutConfig?: FamilyTreeLayoutConfig;
  graphApiRef?: RefObject<FamilyTreeGraphApi | null>;
  selectedNodeId?: number | null;
  onNodeClick?: (personId: number, person: Person) => void;
  onPersonAdded?: (person: Person, relationship: Relationship) => void;
  onRelationshipAdded?: (relationship: Relationship) => void;
  onRelationshipRemoved?: (relationshipId: number) => void;
  assertCanMutate?: () => boolean;
};

export function useFamilyTreeGraph({
  treeData,
  layoutConfig,
  graphApiRef,
  selectedNodeId,
  onPersonAdded,
  onRelationshipAdded,
  onRelationshipRemoved,
  assertCanMutate,
}: UseFamilyTreeGraphOptions) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const connections = useGraphConnections({ onPersonAdded, onRelationshipAdded, assertCanMutate });

  const onRelationshipRemovedRef = useRef(onRelationshipRemoved);
  useEffect(() => {
    onRelationshipRemovedRef.current = onRelationshipRemoved;
  });

  useEffect(() => {
    const graph = buildFamilyTreeGraph(treeData, layoutConfig);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNodes(graph.nodes);
    setEdges(graph.edges);
  }, [treeData, layoutConfig]);

  useEffect(() => {
    if (!graphApiRef) return;
    graphApiRef.current = {
      collectMovedNodePositions: () => collectMovedNodePositions(nodes, treeData, layoutConfig),
    };
    return () => {
      graphApiRef.current = null;
    };
  }, [graphApiRef, nodes, treeData, layoutConfig]);

  const enhancedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        selected: node.id === String(selectedNodeId),
        type: 'custom' as const,
      })),
    [nodes, selectedNodeId],
  );

  const enhancedEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          onRelationshipRemoved: (relationshipId: number) => onRelationshipRemovedRef.current?.(relationshipId),
        },
      })),
    [edges],
  );

  const onNodesChange = useCallback((changes: NodeChange<Node>[]) => {
    setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    const nonRemoveChanges = changes.filter((change) => change.type !== 'remove');
    if (nonRemoveChanges.length > 0) {
      setEdges((currentEdges) => applyEdgeChanges(nonRemoveChanges, currentEdges));
    }
  }, []);

  return {
    enhancedNodes,
    enhancedEdges,
    onNodesChange,
    onEdgesChange,
    ...connections,
  };
}
