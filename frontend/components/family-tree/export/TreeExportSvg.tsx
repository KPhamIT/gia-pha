"use client";

import { type MutableRefObject } from "react";
import {
  type ExportGeometry,
  type ExportImageKey,
  type ExportModel,
  type ResolvedLayout,
} from "@/lib/family-tree/export-tree-svg";
import {
  getNodeCardStyle,
  getTreeBorderStyle,
} from "@/lib/family-tree/svg-border";
import { getCalligraphyFont } from "@/components/family-tree/book/calligraphy-fonts";
import type {
  ExportBox,
  TreeExportSettings,
} from "@/lib/family-tree/tree-export-settings";
import type { DraggableId } from "./tree-export-svg-utils";
import { useExportSvgDrag } from "./useExportSvgDrag";
import ExportPersonNode from "./ExportPersonNode";
import ExportDecorations from "./ExportDecorations";

export type { DraggableId } from "./tree-export-svg-utils";

type TreeExportSvgProps = {
  svgRef: MutableRefObject<SVGSVGElement | null>;
  model: ExportModel;
  geometry: ExportGeometry;
  layout: ResolvedLayout;
  settings: TreeExportSettings;
  imageSources: Record<ExportImageKey, string>;
  interactive?: boolean;
  selectedId?: DraggableId | null;
  onSelect?: (id: DraggableId | null) => void;
  onChange?: (id: DraggableId, patch: Partial<ExportBox>) => void;
};

export default function TreeExportSvg({
  svgRef,
  model,
  geometry,
  layout,
  settings,
  imageSources,
  interactive = false,
  selectedId = null,
  onSelect,
  onChange,
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
  const coupletFontFamily = getCalligraphyFont(settings.coupletFontId).cssValue;
  const { nodeBgColor, nodeTextColor, nodeBorderColor, nodeFontSize } =
    settings;
  const nodeCard = getNodeCardStyle(settings.nodeBorderStyleId);

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

      {border.render(borderRect, settings.borderColor)}

      {/* Tree (connectors + person cards) */}
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

      <ExportDecorations
        layout={layout}
        imageSources={imageSources}
        coupletFontFamily={coupletFontFamily}
        interactive={interactive}
        selectedId={selectedId}
        beginDrag={beginDrag}
      />
    </svg>
  );
}
