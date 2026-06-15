'use client';

import { useRef, type MutableRefObject, type PointerEvent as ReactPointerEvent } from 'react';
import {
  COUPLET_LINE_FACTOR,
  coupletSyllables,
  DRAGON_ASPECT,
  SCROLL_ASPECT,
  type ExportGeometry,
  type ExportImageKey,
  type ExportModel,
  type ResolvedCouplet,
  type ResolvedImage,
  type ResolvedLayout,
  type Rect,
} from '@/lib/family-tree/export-tree-svg';
import { getNodeCardStyle, getTreeBorderStyle } from '@/lib/family-tree/svg-border';
import { getCalligraphyFont } from '@/components/family-tree/book/calligraphy-fonts';
import type { ExportBox, TreeExportSettings } from '@/lib/family-tree/tree-export-settings';

export type DraggableId = 'scroll' | 'dragonLeft' | 'dragonRight' | 'coupletLeft' | 'coupletRight';

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

const SERIF = "'Times New Roman', 'Songti SC', serif";
const birthDateFormatter = new Intl.DateTimeFormat('vi-VN');

function formatBirthDate(birthDate: string | null): string {
  if (!birthDate) return '';
  const d = new Date(birthDate);
  return Number.isNaN(d.getTime()) ? '' : birthDateFormatter.format(d);
}

const IMAGE_ASPECT: Record<'scroll' | 'dragonLeft' | 'dragonRight', number> = {
  scroll: SCROLL_ASPECT,
  dragonLeft: DRAGON_ASPECT,
  dragonRight: DRAGON_ASPECT,
};

type DragState = {
  id: DraggableId;
  mode: 'move' | 'resize';
  startX: number;
  startY: number;
  boxX: number;
  boxY: number;
};

const coupletLineGap = (fontSize: number) => fontSize * COUPLET_LINE_FACTOR;

/** Bounding rect of a couplet's vertical syllable column (x is the column centre). */
function coupletBounds(c: ResolvedCouplet): Rect {
  const count = Math.max(coupletSyllables(c.text).length, 1);
  const lineGap = coupletLineGap(c.fontSize);
  const height = count * lineGap;
  return { x: c.x - c.fontSize * 1.4, y: c.y - c.fontSize, width: c.fontSize * 2.8, height: height + c.fontSize * 0.4 };
}

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
  const dragRef = useRef<DragState | null>(null);
  const { canvasWidth, canvasHeight, borderRect, treeTranslateX, treeTranslateY } = geometry;
  const border = getTreeBorderStyle(settings.borderStyleId);
  const coupletFontFamily = getCalligraphyFont(settings.coupletFontId).cssValue;
  const { nodeBgColor, nodeTextColor, nodeBorderColor, nodeFontSize } = settings;
  const nodeCard = getNodeCardStyle(settings.nodeBorderStyleId);

  const toSvgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  };

  const beginDrag = (
    e: ReactPointerEvent,
    id: DraggableId,
    mode: 'move' | 'resize',
    box: { x: number; y: number },
  ) => {
    if (!interactive) return;
    e.stopPropagation();
    e.preventDefault();
    onSelect?.(id);
    const p = toSvgPoint(e.clientX, e.clientY);
    if (!p) return;
    dragRef.current = { id, mode, startX: p.x, startY: p.y, boxX: box.x, boxY: box.y };
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const p = toSvgPoint(e.clientX, e.clientY);
    if (!p) return;

    if (drag.mode === 'move') {
      onChange?.(drag.id, { x: drag.boxX + (p.x - drag.startX), y: drag.boxY + (p.y - drag.startY) });
      return;
    }
    // resize (images only): anchor at top-left, lock aspect ratio.
    const aspect = IMAGE_ASPECT[drag.id as 'scroll' | 'dragonLeft' | 'dragonRight'] ?? 1;
    const width = Math.max(40, p.x - drag.boxX);
    onChange?.(drag.id, { width, height: width / aspect });
  };

  const endDrag = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    svgRef.current?.releasePointerCapture(e.pointerId);
  };

  const renderImage = (id: 'scroll' | 'dragonLeft' | 'dragonRight', img: ResolvedImage, href: string) => {
    if (!img.visible) return null;
    return (
      <image
        key={id}
        href={href}
        xlinkHref={href}
        x={img.x}
        y={img.y}
        width={img.width}
        height={img.height}
        preserveAspectRatio="none"
        style={{ cursor: interactive ? 'move' : 'default' }}
        onPointerDown={(e) => beginDrag(e, id, 'move', img)}
      />
    );
  };

  const renderCouplet = (id: 'coupletLeft' | 'coupletRight', c: ResolvedCouplet) => {
    if (!c.visible || c.text.trim().length === 0) return null;
    const cells = coupletSyllables(c.text);
    const lineGap = coupletLineGap(c.fontSize);
    const bounds = coupletBounds(c);
    return (
      <g key={id}>
        <text
          x={c.x}
          y={c.y}
          textAnchor="middle"
          fontFamily={coupletFontFamily}
          fontSize={c.fontSize}
          fill={c.color}
          style={{ pointerEvents: 'none' }}
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
            style={{ cursor: 'move' }}
            onPointerDown={(e) => beginDrag(e, id, 'move', { x: c.x, y: c.y })}
          />
        ) : null}
      </g>
    );
  };

  const renderSelection = () => {
    if (!interactive || !selectedId) return null;
    const isImage = selectedId === 'scroll' || selectedId === 'dragonLeft' || selectedId === 'dragonRight';
    const bounds: Rect = isImage ? layout[selectedId] : coupletBounds(layout[selectedId]);
    if (isImage && !layout[selectedId].visible) return null;
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
            style={{ cursor: 'nwse-resize' }}
            onPointerDown={(e) => beginDrag(e, selectedId, 'resize', { x: bounds.x, y: bounds.y })}
          />
        ) : null}
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', touchAction: 'none' }}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerDown={() => interactive && onSelect?.(null)}
    >
      <rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill={settings.backgroundColor} />

      {border.render(borderRect, settings.borderColor)}

      {/* Tree (connectors + person cards) */}
      <g transform={`translate(${treeTranslateX} ${treeTranslateY})`}>
        {model.connectors.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
        ))}
        {model.nodes.map((n) => {
          const words = n.fullName.trim().split(/\s+/).filter(Boolean);
          const cx = model.nodeWidth / 2;
          const nameFont = nodeFontSize;
          const lineH = nameFont * 1.2;
          const birthFont = nameFont * 0.73;
          const birth = formatBirthDate(n.birthDate);
          const blockH = words.length * lineH + (birth ? birthFont + 5 : 0);
          const firstBaseline = Math.max(nameFont + 6, (model.nodeHeight - blockH) / 2 + nameFont);
          return (
            <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
              {nodeCard.render(model.nodeWidth, model.nodeHeight, nodeBgColor, nodeBorderColor, n.isRoot ? 2.5 : 1.5)}
              <text
                x={cx}
                textAnchor="middle"
                fontFamily={SERIF}
                fontWeight={600}
                fontSize={nameFont}
                fill={nodeTextColor}
              >
                {words.map((word, i) => (
                  <tspan key={i} x={cx} y={firstBaseline + i * lineH}>
                    {word}
                  </tspan>
                ))}
              </text>
              {birth ? (
                <text
                  x={cx}
                  y={firstBaseline + words.length * lineH + 4}
                  textAnchor="middle"
                  fontFamily={SERIF}
                  fontSize={birthFont}
                  fill={nodeTextColor}
                  opacity={0.7}
                >
                  {birth}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>

      {/* Decorative header */}
      {renderImage('dragonLeft', layout.dragonLeft, imageSources.dragonLeft)}
      {renderImage('dragonRight', layout.dragonRight, imageSources.dragonRight)}
      {renderCouplet('coupletLeft', layout.coupletLeft)}
      {renderCouplet('coupletRight', layout.coupletRight)}
      {renderImage('scroll', layout.scroll, imageSources.scroll)}

      {renderSelection()}
    </svg>
  );
}
