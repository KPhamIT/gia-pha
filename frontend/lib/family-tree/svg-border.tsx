import type { ReactNode } from 'react';

/** A rectangle in SVG user-space coordinates. */
export type BorderRect = { x: number; y: number; width: number; height: number };

export type TreeBorderStyle = {
  id: string;
  /** Human label shown in the style selector. */
  label: string;
  /** Render the border decoration for the given rect + colour. */
  render: (rect: BorderRect, color: string) => ReactNode;
};

/** Four L-shaped corner flourishes inset by `pad` from the frame corners. */
function cornerFlourishes(rect: BorderRect, color: string, pad: number, arm: number): ReactNode {
  const { x, y, width, height } = rect;
  const right = x + width;
  const bottom = y + height;
  const corner = (cx: number, cy: number, sx: number, sy: number, key: string) => (
    <path
      key={key}
      d={`M ${cx + sx * arm} ${cy} Q ${cx} ${cy} ${cx} ${cy + sy * arm}`}
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
  return (
    <g opacity={0.9}>
      {corner(x + pad, y + pad, 1, 1, 'tl')}
      {corner(right - pad, y + pad, -1, 1, 'tr')}
      {corner(x + pad, bottom - pad, 1, -1, 'bl')}
      {corner(right - pad, bottom - pad, -1, -1, 'br')}
      {[
        [x + pad, y + pad],
        [right - pad, y + pad],
        [x + pad, bottom - pad],
        [right - pad, bottom - pad],
      ].map(([dx, dy], i) => (
        <circle key={`dot-${i}`} cx={dx} cy={dy} r={4} fill={color} />
      ))}
    </g>
  );
}

function frameRect(rect: BorderRect, color: string, strokeWidth: number, rx = 0, fill = 'none'): ReactNode {
  return (
    <rect
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
      rx={rx}
      ry={rx}
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  );
}

function inset(rect: BorderRect, by: number): BorderRect {
  return { x: rect.x + by, y: rect.y + by, width: rect.width - by * 2, height: rect.height - by * 2 };
}

export const TREE_BORDER_STYLES: TreeBorderStyle[] = [
  {
    id: 'classic',
    label: 'Cổ điển',
    render: (rect, color) => (
      <g>
        {frameRect(rect, color, 3)}
        {frameRect(inset(rect, 8), color, 1.5)}
      </g>
    ),
  },
  {
    id: 'double',
    label: 'Khung kép',
    render: (rect, color) => (
      <g>
        {frameRect(rect, color, 5)}
        {frameRect(inset(rect, 16), color, 2.5)}
      </g>
    ),
  },
  {
    id: 'ornate',
    label: 'Hoa văn góc',
    render: (rect, color) => (
      <g>
        {frameRect(rect, color, 3)}
        {frameRect(inset(rect, 9), color, 1.5)}
        {cornerFlourishes(inset(rect, 24), color, 0, 26)}
      </g>
    ),
  },
  {
    id: 'cloud',
    label: 'Mây bo tròn',
    render: (rect, color) => (
      <g>
        {frameRect(rect, color, 3, 40)}
        {frameRect(inset(rect, 10), color, 1.5, 32)}
      </g>
    ),
  },
  {
    id: 'modern',
    label: 'Tối giản',
    render: (rect, color) => <g>{frameRect(rect, color, 2)}</g>,
  },
  {
    id: 'plain',
    label: 'Không viền',
    render: () => null,
  },
];

export const DEFAULT_TREE_BORDER_ID = 'classic';

export function getTreeBorderStyle(id: string): TreeBorderStyle {
  return TREE_BORDER_STYLES.find((s) => s.id === id) ?? TREE_BORDER_STYLES[0];
}

export function isTreeBorderId(id: string): boolean {
  return TREE_BORDER_STYLES.some((s) => s.id === id);
}

// ---------- Person card (node) border styles ----------

export type NodeCardStyle = {
  id: string;
  /** Human label shown in the style selector. */
  label: string;
  /** Render the full card: filled background + frame. */
  render: (width: number, height: number, fill: string, stroke: string, strokeWidth: number) => ReactNode;
};

const cardRect = (
  w: number,
  h: number,
  fill: string,
  stroke: string,
  strokeWidth: number,
  rx: number,
): ReactNode => (
  <rect width={w} height={h} rx={rx} ry={rx} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
);

/** Quarter-arc flourishes at the four corners of a node card. */
function nodeCornerFlourishes(w: number, h: number, stroke: string, sw: number): ReactNode {
  const inset = 4;
  const arm = Math.min(w, h) * 0.16;
  const c = (cx: number, cy: number, sx: number, sy: number, key: string) => (
    <path
      key={key}
      d={`M ${cx + sx * arm} ${cy} Q ${cx} ${cy} ${cx} ${cy + sy * arm}`}
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
    />
  );
  return (
    <g>
      {c(inset, inset, 1, 1, 'tl')}
      {c(w - inset, inset, -1, 1, 'tr')}
      {c(inset, h - inset, 1, -1, 'bl')}
      {c(w - inset, h - inset, -1, -1, 'br')}
    </g>
  );
}

/**
 * Node-card frames mirroring the book's page-border-styles set (same ids +
 * labels), drawn in SVG so they survive the export. Each renders the filled
 * card background plus its frame.
 */
export const NODE_CARD_STYLES: NodeCardStyle[] = [
  {
    id: 'classic',
    label: 'Cổ điển',
    render: (w, h, fill, stroke, sw) => (
      <g>
        {cardRect(w, h, fill, stroke, sw, 4)}
        <rect x={3} y={3} width={w - 6} height={h - 6} rx={2} ry={2} fill="none" stroke={stroke} strokeWidth={Math.max(0.6, sw * 0.55)} />
      </g>
    ),
  },
  {
    id: 'double',
    label: 'Khung kép',
    render: (w, h, fill, stroke, sw) => (
      <g>
        {cardRect(w, h, fill, stroke, sw * 1.3, 3)}
        <rect x={5} y={5} width={w - 10} height={h - 10} rx={2} ry={2} fill="none" stroke={stroke} strokeWidth={Math.max(0.7, sw * 0.8)} />
      </g>
    ),
  },
  {
    id: 'ornate',
    label: 'Hoa văn góc',
    render: (w, h, fill, stroke, sw) => (
      <g>
        {cardRect(w, h, fill, stroke, sw, 3)}
        {nodeCornerFlourishes(w, h, stroke, Math.max(1, sw))}
      </g>
    ),
  },
  {
    id: 'cloud',
    label: 'Mây bo tròn',
    render: (w, h, fill, stroke, sw) => {
      const rx = Math.min(w, h) * 0.28;
      return (
        <g>
          {cardRect(w, h, fill, stroke, sw, rx)}
          <rect x={4} y={4} width={w - 8} height={h - 8} rx={Math.max(0, rx - 4)} ry={Math.max(0, rx - 4)} fill="none" stroke={stroke} strokeWidth={Math.max(0.6, sw * 0.55)} />
        </g>
      );
    },
  },
  {
    id: 'modern',
    label: 'Tối giản',
    render: (w, h, fill, stroke, sw) => cardRect(w, h, fill, stroke, Math.max(0.8, sw * 0.8), 2),
  },
  {
    id: 'plain',
    label: 'Không viền',
    render: (w, h, fill) => cardRect(w, h, fill, 'none', 0, 6),
  },
];

export const DEFAULT_NODE_CARD_ID = 'classic';

export function getNodeCardStyle(id: string): NodeCardStyle {
  return NODE_CARD_STYLES.find((s) => s.id === id) ?? NODE_CARD_STYLES[0];
}

export function isNodeCardId(id: string): boolean {
  return NODE_CARD_STYLES.some((s) => s.id === id);
}
