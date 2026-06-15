"use client";

import { useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import { NODE_HEIGHT, NODE_WIDTH } from "./layout";

export const GRAPH_MIN_ZOOM = 0.01;
export const GRAPH_MAX_ZOOM = 2;

/** Shared fitView bounds — allow zoom-in on small/mobile viewports. */
export const GRAPH_FIT_VIEW_OPTIONS = {
  padding: 0.15,
  minZoom: GRAPH_MIN_ZOOM,
  maxZoom: GRAPH_MAX_ZOOM,
};

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
    void fitView({ ...GRAPH_FIT_VIEW_OPTIONS, duration: 400 });
  }, [centerTreeKey, fitView]);

  useEffect(() => {
    let frame = 0;
    const refit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        void fitView({ ...GRAPH_FIT_VIEW_OPTIONS, duration: 0 });
      });
    };

    window.addEventListener("resize", refit);
    window.visualViewport?.addEventListener("resize", refit);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", refit);
      window.visualViewport?.removeEventListener("resize", refit);
    };
  }, [fitView]);

  return null;
}
