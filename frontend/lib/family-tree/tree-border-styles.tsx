import type { ReactNode } from "react";

/** A rectangle in SVG user-space coordinates. */
export type BorderRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TreeBorderStyle = {
  id: string;
  /** Human label shown in the style selector. */
  label: string;
  /** Render the border decoration for the given rect + colour. */
  render: (rect: BorderRect, color: string) => ReactNode;
};

/** Four L-shaped corner flourishes inset by `pad` from the frame corners. */
function cornerFlourishes(
  rect: BorderRect,
  color: string,
  pad: number,
  arm: number,
): ReactNode {
  const { x, y, width, height } = rect;
  const right = x + width;
  const bottom = y + height;
  const corner = (
    cx: number,
    cy: number,
    sx: number,
    sy: number,
    key: string,
  ) => (
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
      {corner(x + pad, y + pad, 1, 1, "tl")}
      {corner(right - pad, y + pad, -1, 1, "tr")}
      {corner(x + pad, bottom - pad, 1, -1, "bl")}
      {corner(right - pad, bottom - pad, -1, -1, "br")}
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

function frameRect(
  rect: BorderRect,
  color: string,
  strokeWidth: number,
  rx = 0,
  fill = "none",
): ReactNode {
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
  return {
    x: rect.x + by,
    y: rect.y + by,
    width: rect.width - by * 2,
    height: rect.height - by * 2,
  };
}

export const TREE_BORDER_STYLES: TreeBorderStyle[] = [
  {
    id: "classic",
    label: "Cổ điển",
    render: (rect, color) => (
      <g>
        {frameRect(rect, color, 3)}
        {frameRect(inset(rect, 8), color, 1.5)}
      </g>
    ),
  },
  {
    id: "double",
    label: "Khung kép",
    render: (rect, color) => (
      <g>
        {frameRect(rect, color, 5)}
        {frameRect(inset(rect, 16), color, 2.5)}
      </g>
    ),
  },
  {
    id: "ornate",
    label: "Hoa văn góc",
    render: (rect, color) => (
      <g>
        {frameRect(rect, color, 3)}
        {frameRect(inset(rect, 9), color, 1.5)}
        {cornerFlourishes(inset(rect, 24), color, 0, 26)}
      </g>
    ),
  },
  {
    id: "cloud",
    label: "Mây bo tròn",
    render: (rect, color) => (
      <g>
        {frameRect(rect, color, 3, 40)}
        {frameRect(inset(rect, 10), color, 1.5, 32)}
      </g>
    ),
  },
  {
    id: "modern",
    label: "Tối giản",
    render: (rect, color) => <g>{frameRect(rect, color, 2)}</g>,
  },
  {
    id: "plain",
    label: "Không viền",
    render: () => null,
  },
];

export const DEFAULT_TREE_BORDER_ID = "classic";

export function getTreeBorderStyle(id: string): TreeBorderStyle {
  return TREE_BORDER_STYLES.find((s) => s.id === id) ?? TREE_BORDER_STYLES[0];
}

export function isTreeBorderId(id: string): boolean {
  return TREE_BORDER_STYLES.some((s) => s.id === id);
}
