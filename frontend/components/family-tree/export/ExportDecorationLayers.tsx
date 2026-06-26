import { type PointerEvent as ReactPointerEvent } from "react";
import { resolveExportTextFontFamily } from "@/components/family-tree/book/calligraphy-fonts";
import {
  coupletSyllables,
  type ResolvedCouplet,
  type ResolvedLayout,
} from "@/lib/family-tree/export-tree-svg";
import {
  type ExportDecorationLayer,
  type ExportLayerTier,
  sortExportLayers,
} from "@/lib/family-tree/export-decoration-layers";
import {
  buildEllipticalTextPath,
  curvedTextPathId,
  estimateHorizontalTextWidth,
  textPivot,
  textRotationTransform,
} from "@/lib/family-tree/export-text-curve";
import {
  coupletBounds,
  coupletLineGap,
  textLayerBounds,
  type BeginLayerDrag,
} from "./tree-export-svg-utils";

type Props = {
  layers: ExportDecorationLayer[];
  layout: ResolvedLayout;
  coupletFontFamily: string;
  layerImageHrefs: Record<string, string>;
  interactive: boolean;
  selectedId: string | null;
  beginDrag: BeginLayerDrag;
  onLayerContextMenu?: (id: string, clientX: number, clientY: number) => void;
  /** Which slice of the layer stack to paint in this group. */
  segment: "behind-tree" | "above-tree" | "above-text" | "selection";
};

function ExportLayerImage({
  layer,
  href,
  interactive,
  beginDrag,
  onLayerContextMenu,
}: {
  layer: Extract<ExportDecorationLayer, { type: "image" }>;
  href: string;
  interactive: boolean;
  selectedId: string | null;
  beginDrag: BeginLayerDrag;
  onLayerContextMenu?: (id: string, clientX: number, clientY: number) => void;
}) {
  return (
    <image
      href={href}
      xlinkHref={href}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      preserveAspectRatio="none"
      style={{ cursor: interactive ? "move" : "default" }}
      onPointerDown={(e) =>
        beginDrag(e, layer.id, "move", { x: layer.x, y: layer.y })
      }
      onContextMenu={(e) => {
        if (!interactive || !onLayerContextMenu) return;
        e.preventDefault();
        onLayerContextMenu(layer.id, e.clientX, e.clientY);
      }}
    />
  );
}

function ExportLayerText({
  layer,
  interactive,
  beginDrag,
}: {
  layer: Extract<ExportDecorationLayer, { type: "text" }>;
  interactive: boolean;
  beginDrag: BeginLayerDrag;
}) {
  if (!layer.text.trim()) return null;
  const fontFamily = resolveExportTextFontFamily(layer.fontId);
  const bounds = textLayerBounds(layer);

  if (layer.vertical) {
    const cells = coupletSyllables(layer.text);
    const lineGap = coupletLineGap(layer.fontSize);
    return (
      <g>
        <text
          x={layer.x}
          y={layer.y}
          textAnchor="middle"
          fontFamily={fontFamily}
          fontSize={layer.fontSize}
          fill={layer.color}
          style={{ pointerEvents: "none" }}
        >
          {cells.map((word, i) => (
            <tspan key={i} x={layer.x} dy={i === 0 ? 0 : lineGap}>
              {word}
            </tspan>
          ))}
        </text>
        {interactive ? (
          <rect
            x={bounds.x}
            y={bounds.y}
            width={bounds.width}
            height={bounds.height}
            fill="transparent"
            style={{ cursor: "move" }}
            onPointerDown={(e) =>
              beginDrag(e, layer.id, "move", { x: layer.x, y: layer.y })
            }
          />
        ) : null}
      </g>
    );
  }

  const curve = layer.textCurve ?? 0;
  const rotation = layer.textRotation ?? 0;
  const textWidth = estimateHorizontalTextWidth(layer.text, layer.fontSize);
  const pivot = textPivot(layer.x, layer.y, textWidth, layer.fontSize);
  const rotateTransform = textRotationTransform(rotation, pivot.x, pivot.y);
  const dragRect = interactive ? (
    <rect
      x={bounds.x}
      y={bounds.y}
      width={bounds.width}
      height={bounds.height}
      fill="transparent"
      style={{ cursor: "move" }}
      onPointerDown={(e) =>
        beginDrag(e, layer.id, "move", { x: layer.x, y: layer.y })
      }
    />
  ) : null;

  const textNode =
    curve !== 0 ? (
      <>
        <defs>
          <path
            id={curvedTextPathId(layer.id)}
            d={buildEllipticalTextPath(layer.x, layer.y, textWidth, curve)}
          />
        </defs>
        <text
          fontFamily={fontFamily}
          fontSize={layer.fontSize}
          fill={layer.color}
          style={{ pointerEvents: "none" }}
        >
          <textPath
            href={`#${curvedTextPathId(layer.id)}`}
            xlinkHref={`#${curvedTextPathId(layer.id)}`}
          >
            {layer.text}
          </textPath>
        </text>
      </>
    ) : (
      <text
        x={layer.x}
        y={layer.y}
        fontFamily={fontFamily}
        fontSize={layer.fontSize}
        fill={layer.color}
        style={{ pointerEvents: "none" }}
      >
        {layer.text}
      </text>
    );

  return (
    <g>
      {rotateTransform ? <g transform={rotateTransform}>{textNode}</g> : textNode}
      {dragRect}
    </g>
  );
}

function ExportCouplet({
  id,
  c,
  fontFamily,
  interactive,
  beginDrag,
}: {
  id: "coupletLeft" | "coupletRight";
  c: ResolvedCouplet;
  fontFamily: string;
  interactive: boolean;
  beginDrag: BeginLayerDrag;
}) {
  if (!c.visible || c.text.trim().length === 0) return null;
  const cells = coupletSyllables(c.text);
  const lineGap = coupletLineGap(c.fontSize);
  const bounds = coupletBounds(c);

  return (
    <g>
      <text
        x={c.x}
        y={c.y}
        textAnchor="middle"
        fontFamily={fontFamily}
        fontSize={c.fontSize}
        fill={c.color}
        style={{ pointerEvents: "none" }}
      >
        {cells.map((word, i) => (
          <tspan key={i} x={c.x} dy={i === 0 ? 0 : lineGap}>
            {word}
          </tspan>
        ))}
      </text>
      {interactive ? (
        <rect
          x={bounds.x}
          y={bounds.y}
          width={bounds.width}
          height={bounds.height}
          fill="transparent"
          style={{ cursor: "move" }}
          onPointerDown={(e) => beginDrag(e, id, "move", { x: c.x, y: c.y })}
        />
      ) : null}
    </g>
  );
}

function SelectionOverlay({
  layers,
  layout,
  selectedId,
  beginDrag,
}: Pick<Props, "layers" | "layout" | "selectedId" | "beginDrag">) {
  if (!selectedId) return null;

  const layer = layers.find((item) => item.id === selectedId);
  if (layer) {
    const bounds =
      layer.type === "text" ? textLayerBounds(layer) : layerBounds(layer);
    const isImage = layer.type === "image";
    return (
      <g data-export-ignore>
        <rect
          x={bounds.x}
          y={bounds.y}
          width={bounds.width}
          height={bounds.height}
          fill="none"
          stroke="#2563eb"
          strokeWidth={2}
          strokeDasharray="8 6"
        />
        {isImage ? (
          <rect
            x={bounds.x + bounds.width - 11}
            y={bounds.y + bounds.height - 11}
            width={22}
            height={22}
            fill="#2563eb"
            rx={3}
            style={{ cursor: "nwse-resize" }}
            onPointerDown={(e) =>
              beginDrag(
                e,
                layer.id,
                "resize",
                { x: bounds.x, y: bounds.y },
                layer.aspectRatio,
              )
            }
          />
        ) : null}
      </g>
    );
  }

  const isCouplet =
    selectedId === "coupletLeft" || selectedId === "coupletRight";
  if (!isCouplet || !layout[selectedId].visible) return null;
  const bounds = coupletBounds(layout[selectedId]);

  return (
    <g data-export-ignore>
      <rect
        x={bounds.x}
        y={bounds.y}
        width={bounds.width}
        height={bounds.height}
        fill="none"
        stroke="#2563eb"
        strokeWidth={2}
        strokeDasharray="8 6"
      />
    </g>
  );
}

function layerBounds(layer: Extract<ExportDecorationLayer, { type: "image" }>) {
  return {
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
  };
}

function layersForTier(
  layers: ExportDecorationLayer[],
  tier: ExportLayerTier,
) {
  return sortExportLayers(layers).filter((layer) => layer.tier === tier);
}

/** Dynamic image/text layers plus legacy couplets and selection handles. */
export default function ExportDecorationLayers({
  layers,
  layout,
  coupletFontFamily,
  layerImageHrefs,
  interactive,
  selectedId,
  beginDrag,
  segment,
  onLayerContextMenu,
}: Props) {
  if (segment === "selection") {
    return interactive ? (
      <SelectionOverlay
        layers={layers}
        layout={layout}
        selectedId={selectedId}
        beginDrag={beginDrag}
      />
    ) : null;
  }

  if (segment === "above-tree") {
    return (
      <>
        {layersForTier(layers, "above-tree").map((layer) =>
          layer.type === "image" ? (
            <ExportLayerImage
              key={layer.id}
              layer={layer}
              href={layerImageHrefs[layer.id] ?? layer.assetUrl}
              interactive={interactive}
              selectedId={selectedId}
              beginDrag={beginDrag}
              onLayerContextMenu={onLayerContextMenu}
            />
          ) : (
            <ExportLayerText
              key={layer.id}
              layer={layer}
              interactive={interactive}
              beginDrag={beginDrag}
            />
          ),
        )}
        <ExportCouplet
          id="coupletLeft"
          c={layout.coupletLeft}
          fontFamily={coupletFontFamily}
          interactive={interactive}
          beginDrag={beginDrag}
        />
        <ExportCouplet
          id="coupletRight"
          c={layout.coupletRight}
          fontFamily={coupletFontFamily}
          interactive={interactive}
          beginDrag={beginDrag}
        />
      </>
    );
  }

  return layersForTier(layers, segment).map((layer) =>
    layer.type === "image" ? (
      <ExportLayerImage
        key={layer.id}
        layer={layer}
        href={layerImageHrefs[layer.id] ?? layer.assetUrl}
        interactive={interactive}
        selectedId={selectedId}
        beginDrag={beginDrag}
        onLayerContextMenu={onLayerContextMenu}
      />
    ) : (
      <ExportLayerText
        key={layer.id}
        layer={layer}
        interactive={interactive}
        beginDrag={beginDrag}
      />
    ),
  );
}
