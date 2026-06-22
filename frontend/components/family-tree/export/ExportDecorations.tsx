import { type PointerEvent as ReactPointerEvent } from "react";
import {
  coupletSyllables,
  type ResolvedCouplet,
  type ResolvedImage,
  type ResolvedLayout,
  type Rect,
} from "@/lib/family-tree/export-tree-svg";
import {
  coupletBounds,
  coupletLineGap,
  type DraggableId,
} from "./tree-export-svg-utils";

type BeginDrag = (
  e: ReactPointerEvent,
  id: DraggableId,
  mode: "move" | "resize",
  box: { x: number; y: number },
) => void;

type Props = {
  layout: ResolvedLayout;
  imageSources: Record<"scroll" | "dragonLeft" | "dragonRight", string>;
  coupletFontFamily: string;
  interactive: boolean;
  selectedId: DraggableId | null;
  beginDrag: BeginDrag;
};

function ExportImage({
  id,
  img,
  href,
  interactive,
  beginDrag,
}: {
  id: "scroll" | "dragonLeft" | "dragonRight";
  img: ResolvedImage;
  href: string;
  interactive: boolean;
  beginDrag: BeginDrag;
}) {
  if (!img.visible) return null;
  return (
    <image
      href={href}
      xlinkHref={href}
      x={img.x}
      y={img.y}
      width={img.width}
      height={img.height}
      preserveAspectRatio="none"
      style={{ cursor: interactive ? "move" : "default" }}
      onPointerDown={(e) => beginDrag(e, id, "move", img)}
    />
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
  beginDrag: BeginDrag;
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
  layout,
  selectedId,
  beginDrag,
}: Pick<Props, "layout" | "selectedId" | "beginDrag">) {
  if (!selectedId) return null;
  const isImage =
    selectedId === "scroll" ||
    selectedId === "dragonLeft" ||
    selectedId === "dragonRight";
  if (isImage && !layout[selectedId].visible) return null;
  const bounds: Rect = isImage
    ? layout[selectedId]
    : coupletBounds(layout[selectedId]);

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
            beginDrag(e, selectedId, "resize", { x: bounds.x, y: bounds.y })
          }
        />
      ) : null}
    </g>
  );
}

/** Decorative header images, vertical couplets, and the selection handles. */
export default function ExportDecorations({
  layout,
  imageSources,
  coupletFontFamily,
  interactive,
  selectedId,
  beginDrag,
}: Props) {
  return (
    <>
      <ExportImage
        id="dragonLeft"
        img={layout.dragonLeft}
        href={imageSources.dragonLeft}
        interactive={interactive}
        beginDrag={beginDrag}
      />
      <ExportImage
        id="dragonRight"
        img={layout.dragonRight}
        href={imageSources.dragonRight}
        interactive={interactive}
        beginDrag={beginDrag}
      />
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
      <ExportImage
        id="scroll"
        img={layout.scroll}
        href={imageSources.scroll}
        interactive={interactive}
        beginDrag={beginDrag}
      />
      {interactive ? (
        <SelectionOverlay
          layout={layout}
          selectedId={selectedId}
          beginDrag={beginDrag}
        />
      ) : null}
    </>
  );
}
