'use client';

import { useMemo, useState, useCallback } from 'react';
import { ReactFlow,
   Background,
    Controls, StepEdge, 
    Node as ReactFlowNode, addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FamilyTreeData, Person } from '../types/family-tree-types';
import FamilyTreeNode from './FamilyTreeNode';
import { buildFamilyTreeGraph, FamilyTreeLayoutConfig } from './FamilyTreeGraphLayout';

type FamilyTreeGraphProps = {
  treeData: FamilyTreeData;
  layoutConfig?: FamilyTreeLayoutConfig;
  onNodeClick?: (personId: number, person: Person) => void;
  selectedNodeId?: number | null;
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
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => {
      console.log("Connecting - params:", params, "current edges:", edgesSnapshot);
      
      return addEdge(params, edgesSnapshot)
  }),
    [],
  );


  console.log("Rendering FamilyTreeGraph - nodes:", enhancedNodes, "edges:", edges);

  return (
    <div className="h-full w-full overflow-hidden">
      <ReactFlow
        nodes={enhancedNodes}
        edges={edges}
        nodeTypes={{ default: FamilyTreeNode }}
        edgeTypes={{ default: StepEdge, step: StepEdge }}
        minZoom={0.1}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background color="#f1f5f9" gap={16} />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  );
}
