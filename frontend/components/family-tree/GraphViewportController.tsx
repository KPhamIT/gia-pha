"use client";

import { useEffect } from "react";
import { useReactFlow } from "@xyflow/react";

export const GRAPH_MIN_ZOOM = 0.01;
export const GRAPH_INITIAL_ZOOM = 0.5;

const NODE_WIDTH = 260;
const NODE_HEIGHT = 80;

type GraphViewportControllerProps = {
  focusNodeId?: number | null;
  centerTreeKey?: number;
};

export default function GraphViewportController({
  focusNodeId,
  centerTreeKey,
}: GraphViewportControllerProps) {
  const { setCenter, fitView, getNode } = useReactFlow();

  useEffect(() => {
    if (focusNodeId == null) return;
    const node = getNode(String(focusNodeId));
    if (!node) return;

    setCenter(
      node.position.x + NODE_WIDTH / 2,
      node.position.y + NODE_HEIGHT / 2,
      {
        zoom: 1,
        duration: 400,
      },
    );
  }, [focusNodeId, getNode, setCenter]);

  useEffect(() => {
    if (centerTreeKey == null || centerTreeKey === 0) return;
    void fitView({
      padding: 0.2,
      duration: 400,
      minZoom: GRAPH_INITIAL_ZOOM,
      maxZoom: GRAPH_INITIAL_ZOOM,
    });
  }, [centerTreeKey, fitView]);

  return null;
}
