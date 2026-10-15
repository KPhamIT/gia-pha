import type { ReactNode } from "react";
import type { BorderRect, TreeBorderStyle } from "./tree-border-styles";

/** Bề dày dải viền (đơn vị SVG A0, 1000 ≈ 1 inch → ~18 mm). */
export const IMPERIAL_BAND = 700;
const GOLD = "#d4a017";
const GOLD_LIGHT = "#f1c75b";
/** Ô hồi văn mong muốn; được làm tròn để mỗi cạnh chứa số ô nguyên. */
const KEY_TILE = 420;
const KEY_INSET = 140;

/** Một ô hồi văn (vuông xoắn chữ 回), toạ độ chuẩn hoá 0–1, nối liền ô kế tiếp. */
const KEY_PATH = "M0 0.9 H1 M0.8 0.9 V0.12 H0.2 V0.7 H0.6 V0.35 H0.4 V0.52";

function keyPattern(id: string, w: number, h: number, vertical: boolean): ReactNode {
  // Ô dọc: xoay 90° để hoa văn chạy dọc cạnh trái / phải.
  const size = vertical ? h : w;
  const band = vertical ? w : h;
  return (
    <pattern
      id={id}
      patternUnits="userSpaceOnUse"
      width={vertical ? band : size}
      height={vertical ? size : band}
    >
      <path
        d={KEY_PATH}
        transform={
          vertical
            ? `translate(${band} 0) rotate(90) scale(${size} ${band})`
            : `scale(${size} ${band})`
        }
        fill="none"
        stroke={GOLD_LIGHT}
        strokeWidth={0.1}
        strokeLinecap="square"
        vectorEffect="none"
      />
    </pattern>
  );
}

/** Hoa văn tròn ở góc: vòng kép + hoa bốn cánh + nhụy. */
function cornerMedallion(cx: number, cy: number, size: number, key: string): ReactNode {
  const r = size * 0.36;
  const petal = (angle: number) => (
    <ellipse
      key={angle}
      cx={cx}
      cy={cy - r * 0.48}
      rx={r * 0.22}
      ry={r * 0.42}
      fill={GOLD_LIGHT}
      transform={`rotate(${angle} ${cx} ${cy})`}
    />
  );
  return (
    <g key={key}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={GOLD} strokeWidth={size * 0.05} />
      <circle cx={cx} cy={cy} r={r * 0.8} fill="none" stroke={GOLD_LIGHT} strokeWidth={size * 0.015} />
      {[0, 90, 180, 270].map(petal)}
      {[45, 135, 225, 315].map((a) => (
        <circle
          key={`d${a}`}
          cx={cx + Math.sin((a * Math.PI) / 180) * r * 0.62}
          cy={cy - Math.cos((a * Math.PI) / 180) * r * 0.62}
          r={r * 0.08}
          fill={GOLD_LIGHT}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.16} fill={GOLD} />
    </g>
  );
}

/** Chia đoạn `length` thành ô gần `target` nhất, số ô nguyên. */
function fitTile(length: number, target: number): number {
  return length / Math.max(1, Math.round(length / target));
}

/**
 * Viền "Cung đình hồi văn": dải đỏ son, chỉ vàng hai mép, hồi văn vàng chạy liền
 * bốn cạnh, góc là ô hoa văn tròn, trong cùng là chỉ vàng mảnh + vignette nhẹ.
 */
export function renderImperialBorder(rect: BorderRect, color: string): ReactNode {
  const { x, y, width: w, height: h } = rect;
  const T = IMPERIAL_BAND;
  const keyBand = T - KEY_INSET * 2;
  const tileH = fitTile(w - T * 2, KEY_TILE);
  const tileV = fitTile(h - T * 2, KEY_TILE);
  const line = (by: number, sw: number, stroke: string, k: string) => (
    <rect
      key={k}
      x={x + by}
      y={y + by}
      width={w - by * 2}
      height={h - by * 2}
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
    />
  );
  const corners: [number, number][] = [
    [x, y],
    [x + w - T, y],
    [x, y + h - T],
    [x + w - T, y + h - T],
  ];

  return (
    <g>
      <defs>
        {keyPattern("imperial-key-h", tileH, keyBand, false)}
        {keyPattern("imperial-key-v", keyBand, tileV, true)}
        <radialGradient id="imperial-vignette" cx="50%" cy="50%" r="75%">
          <stop offset="70%" stopColor={color} stopOpacity={0} />
          <stop offset="100%" stopColor={color} stopOpacity={0.12} />
        </radialGradient>
      </defs>
      <rect x={x + T} y={y + T} width={w - T * 2} height={h - T * 2} fill="url(#imperial-vignette)" />
      <path
        d={`M${x} ${y}h${w}v${h}h${-w}Z M${x + T} ${y + T}v${h - T * 2}h${w - T * 2}v${-(h - T * 2)}Z`}
        fill={color}
        fillRule="evenodd"
      />
      <g transform={`translate(${x + T} ${y + KEY_INSET})`}>
        <rect width={w - T * 2} height={keyBand} fill="url(#imperial-key-h)" />
      </g>
      <g transform={`translate(${x + T} ${y + h - T + KEY_INSET})`}>
        <rect width={w - T * 2} height={keyBand} fill="url(#imperial-key-h)" />
      </g>
      <g transform={`translate(${x + KEY_INSET} ${y + T})`}>
        <rect width={keyBand} height={h - T * 2} fill="url(#imperial-key-v)" />
      </g>
      <g transform={`translate(${x + w - T + KEY_INSET} ${y + T})`}>
        <rect width={keyBand} height={h - T * 2} fill="url(#imperial-key-v)" />
      </g>
      {corners.map(([cx, cy], i) => (
        <rect key={`c${i}`} x={cx} y={cy} width={T} height={T} fill={color} />
      ))}
      {line(40, 30, GOLD, "o1")}
      {line(T - 40, 30, GOLD, "o2")}
      {corners.map(([cx, cy], i) => (
        <rect
          key={`cb${i}`}
          x={cx + 40}
          y={cy + 40}
          width={T - 80}
          height={T - 80}
          fill="none"
          stroke={GOLD}
          strokeWidth={30}
        />
      ))}
      {corners.map(([cx, cy], i) => cornerMedallion(cx + T / 2, cy + T / 2, T, `m${i}`))}
      {line(T + 90, 14, GOLD, "in")}
    </g>
  );
}

export const IMPERIAL_BORDER_STYLE: TreeBorderStyle = {
  id: "imperial",
  label: "Cung đình hồi văn",
  render: renderImperialBorder,
  band: IMPERIAL_BAND,
};
