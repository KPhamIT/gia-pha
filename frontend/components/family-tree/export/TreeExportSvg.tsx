"use client";

import { type MutableRefObject } from "react";
import {
  type ExportGeometry,
  type ExportModel,
  type ResolvedLayout,
} from "@/lib/family-tree/export-tree-svg";
import {
  buildExportTreeTransform,
  getTreeScalePivot,
  type TreeTransform,
} from "@/lib/family-tree/export-tree-transform";
import { DEFAULT_EDGE_COLOR } from "@/components/family-tree/graph/layout";
import {
  getNodeCardStyle,
  getTreeBorderStyle,
} from "@/lib/family-tree/svg-border";
import { getCalligraphyFont } from "@/components/family-tree/book/calligraphy-fonts";
import type { TreeExportSettings, ExportBox } from "@/lib/family-tree/tree-export-settings";
import type { DraggableId } from "./tree-export-svg-utils";
import { useExportSvgDrag } from "./useExportSvgDrag";
import type { useExportTreeTransform } from "./useExportTreeTransform";
import ExportPersonNode from "./ExportPersonNode";
import ExportDecorationLayers from "./ExportDecorationLayers";

export type { DraggableId } from "./tree-export-svg-utils";

type TreeExportSvgProps = {
  svgRef: MutableRefObject<SVGSVGElement | null>;
  treeTransform: TreeTransform;
  model: ExportModel;
  geometry: ExportGeometry;
  layout: ResolvedLayout;
  settings: TreeExportSettings;
  layerImageHrefs: Record<string, string>;
  edgeColor?: string;
  interactive?: boolean;
  selectedId?: DraggableId | null;
  onSelect?: (id: DraggableId | null) => void;
  onChange?: (id: DraggableId, patch: Partial<ExportBox>) => void;
  onLayerContextMenu?: (id: string, clientX: number, clientY: number) => void;
  beginTreePan?: ReturnType<typeof useExportTreeTransform>["beginPan"];
  moveTreePan?: ReturnType<typeof useExportTreeTransform>["movePan"];
  endTreePan?: ReturnType<typeof useExportTreeTransform>["endPan"];
};

const layerGroupProps = (
  settings: TreeExportSettings,
  layout: ResolvedLayout,
  layerImageHrefs: Record<string, string>,
  interactive: boolean,
  selectedId: DraggableId | null,
  beginDrag: ReturnType<typeof useExportSvgDrag>["beginDrag"],
  onLayerContextMenu?: (id: string, clientX: number, clientY: number) => void,
) => ({
  layers: settings.layers,
  layout,
  coupletFontFamily: getCalligraphyFont(settings.coupletFontId).cssValue,
  layerImageHrefs,
  interactive,
  selectedId,
  beginDrag,
  onLayerContextMenu,
});

export default function TreeExportSvg({
  svgRef,
  treeTransform,
  model,
  geometry,
  layout,
  settings,
  layerImageHrefs,
  edgeColor = DEFAULT_EDGE_COLOR,
  interactive = false,
  selectedId = null,
  onSelect,
  onChange,
  onLayerContextMenu,
  beginTreePan,
  moveTreePan,
  endTreePan,
}: TreeExportSvgProps) {
  const { beginDrag, handlePointerMove, endDrag } = useExportSvgDrag(svgRef, {
    interactive,
    onSelect,
    onChange,
  });
  const { canvasWidth, canvasHeight, borderRect } = geometry;
  const treeTransformAttr = buildExportTreeTransform(
    geometry,
    getTreeScalePivot(model),
    treeTransform.treeOffsetX,
    treeTransform.treeOffsetY,
    treeTransform.treeScale,
  );
  const treeHitPad = 24;
  const border = getTreeBorderStyle(settings.borderStyleId);
  const nodeCard = getNodeCardStyle(settings.nodeBorderStyleId);
  const { nodeBorderColor } = settings;
  const group = layerGroupProps(
    settings,
    layout,
    layerImageHrefs,
    interactive,
    selectedId,
    beginDrag,
    onLayerContextMenu,
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", touchAction: "none" }}
      onPointerMove={(e) => {
        handlePointerMove(e);
        moveTreePan?.(e);
      }}
      onPointerUp={(e) => {
        endDrag(e);
        endTreePan?.(e);
      }}
      onPointerCancel={(e) => {
        endDrag(e);
        endTreePan?.(e);
      }}
      onPointerDown={() => interactive && onSelect?.(null)}
    >
      <rect
        x={0}
        y={0}
        width={canvasWidth}
        height={canvasHeight}
        fill={settings.backgroundColor}
      />

      <ExportDecorationLayers {...group} segment="behind-tree" />

      {border.render(borderRect, settings.borderColor)}

      <g
        data-export-tree
        transform={treeTransformAttr}
        style={{ cursor: interactive ? "grab" : undefined }}
        onPointerDown={beginTreePan}
      >
        {interactive ? (
          <rect
            x={model.bounds.x - treeHitPad}
            y={model.bounds.y - treeHitPad}
            width={model.bounds.width + treeHitPad * 2}
            height={model.bounds.height + treeHitPad * 2}
            fill="transparent"
          />
        ) : null}
        {model.connectors.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={edgeColor}
            strokeWidth={1.5}
          />
        ))}
        {model.nodes.map((n) => (
          <ExportPersonNode
            key={n.id}
            node={n}
            nodeCard={nodeCard}
            nodeBorderColor={nodeBorderColor}
          />
        ))}
      </g>

      <ExportDecorationLayers {...group} segment="above-tree" />
      <ExportDecorationLayers {...group} segment="above-text" />
      <ExportDecorationLayers {...group} segment="selection" />
    </svg>
  );
}
