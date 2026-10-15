import { useId } from "react";
import { getCalligraphyFont } from "@/components/family-tree/book/calligraphy-fonts";
import type { Rect } from "@/lib/family-tree/export-tree-model";
import type { ExportTitleCfg } from "@/lib/family-tree/tree-export-settings";
import { EXPORT_NODE_SERIF } from "@/lib/family-tree/export-person-node-text";

type Props = {
  rects: Rect[];
  lines: string[];
  title: ExportTitleCfg;
};

/** Bề ngang ước lượng một ký tự in hoa (theo cỡ chữ). */
const CHAR_WIDTH = 0.72;
/** Dòng "GIA PHẢ" lớn hơn dòng "HỌ …". */
const LINE_WEIGHTS = [1, 0.62];
const LINE_GAP = 1.12;
/** Phần trên baseline dòng đầu — đủ cho dấu tiếng Việt (Ả, Ấ…). */
const ASCENT = 1.05;
/** Phần dưới baseline dòng cuối — dấu nặng (Ọ, Ạ). */
const DESCENT = 0.22;

/** Chiều cao khối chữ theo cỡ từng dòng (đỉnh dấu dòng đầu → đáy dấu dòng cuối). */
function blockHeight(sizes: number[]): number {
  const middle = sizes.slice(1).reduce((a, f) => a + f * LINE_GAP, 0);
  return sizes[0]! * ASCENT + middle + sizes[sizes.length - 1]! * DESCENT;
}

type LineLayout = { text: string; size: number; baseline: number };

/** Độ võng hai đầu so với đỉnh khi chữ chạy trên cung bán kính r, dây cung w. */
function sagitta(r: number, w: number): number {
  const half = Math.min(w / 2, r);
  return r - Math.sqrt(r * r - half * half);
}

/**
 * Cỡ chữ + baseline tại đỉnh cung cho từng dòng. Chữ cong làm hai đầu tụt xuống,
 * nên chừa phần võng đó khỏi chiều cao ô chữ.
 */
function layoutLines(rect: Rect, lines: string[], radius: number): LineLayout[] {
  const weights = lines.length > 1 ? LINE_WEIGHTS : [1];
  const fit = (height: number) => {
    const unit = height / blockHeight(weights);
    return lines.map((line, i) =>
      Math.min(unit * weights[i]!, rect.width / (Math.max(line.length, 1) * CHAR_WIDTH)),
    );
  };
  // Lượt 1 bỏ qua độ cong; lượt 2 chừa phần võng theo bề ngang thật của dòng rộng nhất.
  const first = fit(rect.height);
  const widest = Math.max(...lines.map((l, i) => l.length * CHAR_WIDTH * first[i]!));
  const drop = radius > 0 ? sagitta(radius, widest) : 0;
  const usable = Math.max(rect.height - drop, rect.height * 0.6);
  const sizes = fit(usable);
  let baseline = rect.y + (usable - blockHeight(sizes)) / 2;
  return lines.map((text, i) => {
    baseline += sizes[i]! * (i === 0 ? ASCENT : LINE_GAP);
    return { text, size: sizes[i]!, baseline };
  });
}

/** Cung vồng lên, tâm chung (cx, cy) — đi qua (cx, baseline) ở đỉnh. */
function arcPath(cx: number, cy: number, baseline: number, span: number): string {
  const r = cy - baseline;
  const half = Math.min(span / 2, r * 0.95);
  const y = cy - Math.sqrt(r * r - half * half);
  return `M ${cx - half} ${y} A ${r} ${r} 0 0 1 ${cx + half} ${y}`;
}

/** Chữ "GIA PHẢ / HỌ …" đặt lên dải cuốn thư, cong theo mép trên dải. */
export default function ExportClanTitle({ rects, lines, title }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9-_]/g, "");
  if (lines.length === 0 || rects.length === 0) return null;
  const fontFamily = title.fontId
    ? getCalligraphyFont(title.fontId).cssValue
    : EXPORT_NODE_SERIF;
  const textProps = (size: number) => ({
    fontFamily,
    fontWeight: title.fontId ? 400 : 700,
    fontSize: size,
    letterSpacing: title.fontId ? 0 : size * 0.04,
    fill: title.color,
    stroke: title.strokeColor || undefined,
    strokeWidth: title.strokeColor ? size * 0.07 : undefined,
    strokeLinejoin: "round" as const,
    paintOrder: "stroke",
  });

  return (
    <g style={{ pointerEvents: "none" }}>
      {rects.map((rect, ri) => {
        const radius = title.arc > 0 ? title.arc * rect.width : 0;
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + radius;
        return (
          <g key={ri}>
            {layoutLines(rect, lines, radius).map((line, i) => {
              if (radius <= 0) {
                return (
                  <text key={i} x={cx} y={line.baseline} textAnchor="middle" {...textProps(line.size)}>
                    {line.text}
                  </text>
                );
              }
              const id = `clan-title-${uid}-${ri}-${i}`;
              return (
                <g key={i}>
                  <defs>
                    <path id={id} d={arcPath(cx, cy, line.baseline, rect.width * 1.3)} />
                  </defs>
                  <text textAnchor="middle" {...textProps(line.size)}>
                    <textPath href={`#${id}`} xlinkHref={`#${id}`} startOffset="50%">
                      {line.text}
                    </textPath>
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
