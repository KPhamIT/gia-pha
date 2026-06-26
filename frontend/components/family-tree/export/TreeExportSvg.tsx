"use client";

import { type MutableRefObject } from "react";
import {
  type ExportGeometry,
  type ExportModel,
  type ResolvedLayout,
} from "@/lib/family-tree/export-tree-svg";
import {
  getNodeCardStyle,
  getTreeBorderStyle,
} from "@/lib/family-tree/svg-border";
import { getCalligraphyFont } from "@/components/family-tree/book/calligraphy-fonts";
import type { TreeExportSettings, ExportBox } from "@/lib/family-tree/tree-export-settings";
import type { DraggableId } from "./tree-export-svg-utils";
import { useExportSvgDrag } from "./useExportSvgDrag";
import ExportPersonNode from "./ExportPersonNode";
import ExportDecorationLayers from "./ExportDecorationLayers";

export type { DraggableId } from "./tree-export-svg-utils";

type TreeExportSvgProps = {
  svgRef: MutableRefObject<SVGSVGElement | null>;
  model: ExportModel;
  geometry: ExportGeometry;
  layout: ResolvedLayout;
  settings: TreeExportSettings;
  layerImageHrefs: Record<string, string>;
  interactive?: boolean;
  selectedId?: DraggableId | null;
  onSelect?: (id: DraggableId | null) => void;
  onChange?: (id: DraggableId, patch: Partial<ExportBox>) => void;
  onLayerContextMenu?: (id: string, clientX: number, clientY: number) => void;
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
  model,
  geometry,
  layout,
  settings,
  layerImageHrefs,
  interactive = false,
  selectedId = null,
  onSelect,
  onChange,
  onLayerContextMenu,
}: TreeExportSvgProps) {
  const { beginDrag, handlePointerMove, endDrag } = useExportSvgDrag(svgRef, {
    interactive,
    onSelect,
    onChange,
  });
  const {
    canvasWidth,
    canvasHeight,
    borderRect,
    treeTranslateX,
    treeTranslateY,
  } = geometry;
  const border = getTreeBorderStyle(settings.borderStyleId);
  const { nodeBgColor, nodeTextColor, nodeBorderColor, nodeFontSize } =
    settings;
  const nodeCard = getNodeCardStyle(settings.nodeBorderStyleId);
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
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
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

      <g transform={`translate(${treeTranslateX} ${treeTranslateY})`}>
        {model.connectors.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
        ))}
        {model.nodes.map((n) => (
          <ExportPersonNode
            key={n.id}
            node={n}
            nodeWidth={model.nodeWidth}
            nodeHeight={model.nodeHeight}
            nodeCard={nodeCard}
            nodeBgColor={nodeBgColor}
            nodeTextColor={nodeTextColor}
            nodeBorderColor={nodeBorderColor}
            nodeFontSize={nodeFontSize}
          />
        ))}
      </g>

      <ExportDecorationLayers {...group} segment="above-tree" />
      <ExportDecorationLayers {...group} segment="above-text" />
      <ExportDecorationLayers {...group} segment="selection" />
    </svg>
  );
}
