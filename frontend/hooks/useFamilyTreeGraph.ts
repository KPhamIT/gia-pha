'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import type { Connection, Edge, EdgeChange, FinalConnectionState, Node, NodeChange } from '@xyflow/react';
import { buildFamilyTreeGraph, FamilyTreeLayoutConfig } from '@/components/family-tree/graph/layout';
import type { FamilyTreeData, Person, Relationship, RelationshipType } from '@/components/types/family-tree-types';
import { createChildPerson, createRelationship } from '@/lib/family-tree/mutations';
import {
  collectMovedNodePositions,
  type NodePositionOverrides,
} from '@/lib/family-tree/node-position-overrides';
import { getErrorMessage } from '@/utils/errors';
import { UI } from '@/lib/constants/ui-strings';

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
};

export function useFamilyTreeGraph({
  treeData,
  layoutConfig,
  graphApiRef,
  selectedNodeId,
  onPersonAdded,
  onRelationshipAdded,
  onRelationshipRemoved,
}: UseFamilyTreeGraphOptions) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [pendingType, setPendingType] = useState<RelationshipType>('CHILD');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const onRelationshipRemovedRef = useRef(onRelationshipRemoved);
  onRelationshipRemovedRef.current = onRelationshipRemoved;

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
          onRelationshipRemoved: (relationshipId: number) =>
            onRelationshipRemovedRef.current?.(relationshipId),
        },
      })),
    [edges],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
    },
    [],
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    const nonRemoveChanges = changes.filter((change) => change.type !== 'remove');
    if (nonRemoveChanges.length > 0) {
      setEdges((currentEdges) => applyEdgeChanges(nonRemoveChanges, currentEdges));
    }
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setSaveError(null);
    setPendingConnection(connection);
    setPendingType('CHILD');
  }, []);

  const cancelConnection = useCallback(() => {
    setPendingConnection(null);
    setSaveError(null);
  }, []);

  const confirmConnection = useCallback(async () => {
    if (!pendingConnection) return;

    const fromId = Number(pendingConnection.source);
    const toId = Number(pendingConnection.target);

    try {
      setSaving(true);
      setSaveError(null);
      const relationship = await createRelationship(fromId, toId, pendingType);
      onRelationshipAdded?.(relationship);
      setPendingConnection(null);
    } catch (error) {
      setSaveError(getErrorMessage(error, UI.ERR_SAVE_RELATIONSHIP));
    } finally {
      setSaving(false);
    }
  }, [onRelationshipAdded, pendingConnection, pendingType]);

  const onConnectEnd = useCallback(
    (_event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      if (connectionState.isValid || !connectionState.fromNode) {
        return;
      }

      const parentPerson = connectionState.fromNode.data.person as Person;

      void (async () => {
        try {
          const result = await createChildPerson(parentPerson, { fullName: UI.DEFAULT_NEW_PERSON });
          onPersonAdded?.(result.person, result.relationship);
        } catch (error) {
          setSaveError(getErrorMessage(error, UI.ERR_CREATE_PERSON));
        }
      })();
    },
    [onPersonAdded],
  );

  return {
    enhancedNodes,
    enhancedEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectEnd,
    pendingConnection,
    pendingType,
    setPendingType,
    saving,
    saveError,
    confirmConnection,
    cancelConnection,
  };
}
