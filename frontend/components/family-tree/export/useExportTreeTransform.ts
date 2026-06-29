"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { TREE_SCALE_STEP } from "@/lib/family-tree/export-tree-transform";
import type { TreeExportSettings } from "@/lib/family-tree/tree-export-settings";

type PanState = {
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
};

type Options = {
  interactive: boolean;
  settings: Pick<TreeExportSettings, "treeOffsetX" | "treeOffsetY">;
  onPatch: (patch: Partial<TreeExportSettings>) => void;
  onZoomBy: (factor: number) => void;
  onResetTransform?: () => void;
};

function toSvgPoint(
  svg: SVGSVGElement | null,
  clientX: number,
  clientY: number,
) {
  if (!svg) return null;
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  return pt.matrixTransform(ctm.inverse());
}

/** Pan + zoom chỉ nhóm cây gia phả trong khung A0. */
export function useExportTreeTransform(
  svgRef: MutableRefObject<SVGSVGElement | null>,
  viewportRef: RefObject<HTMLDivElement | null>,
  { interactive, settings, onPatch, onZoomBy, onResetTransform }: Options,
) {
  const panRef = useRef<PanState | null>(null);
  const onZoomByRef = useRef(onZoomBy);
  onZoomByRef.current = onZoomBy;

  const zoomBy = useCallback((factor: number) => {
    onZoomByRef.current(factor);
  }, []);

  const resetTreeTransform = useCallback(() => {
    onResetTransform?.();
  }, [onResetTransform]);

  const beginPan = useCallback(
    (e: ReactPointerEvent) => {
      if (!interactive) return;
      e.stopPropagation();
      const p = toSvgPoint(svgRef.current, e.clientX, e.clientY);
      if (!p) return;
      panRef.current = {
        startX: p.x,
        startY: p.y,
        offsetX: settings.treeOffsetX ?? 0,
        offsetY: settings.treeOffsetY ?? 0,
      };
      svgRef.current?.setPointerCapture(e.pointerId);
    },
    [interactive, settings.treeOffsetX, settings.treeOffsetY, svgRef],
  );

  const movePan = useCallback(
    (e: ReactPointerEvent) => {
      const pan = panRef.current;
      if (!pan) return;
      const p = toSvgPoint(svgRef.current, e.clientX, e.clientY);
      if (!p) return;
      onPatch({
        treeOffsetX: pan.offsetX + (p.x - pan.startX),
        treeOffsetY: pan.offsetY + (p.y - pan.startY),
      });
    },
    [onPatch, svgRef],
  );

  const endPan = useCallback(
    (e: ReactPointerEvent) => {
      if (!panRef.current) return;
      panRef.current = null;
      svgRef.current?.releasePointerCapture(e.pointerId);
    },
    [svgRef],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !interactive) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const factor = e.deltaY > 0 ? 1 / TREE_SCALE_STEP : TREE_SCALE_STEP;
      onZoomByRef.current(factor);
    };
    el.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => el.removeEventListener("wheel", onWheel, { capture: true });
  }, [interactive, viewportRef]);

  return {
    beginPan,
    movePan,
    endPan,
    zoomIn: () => zoomBy(TREE_SCALE_STEP),
    zoomOut: () => zoomBy(1 / TREE_SCALE_STEP),
    resetTreeTransform,
  };
}
