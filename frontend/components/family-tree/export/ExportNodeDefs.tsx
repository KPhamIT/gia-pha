import type { TreeExportSettings } from "@/lib/family-tree/tree-export-settings";

const GRADIENT_ID = "export-node-fill";
const SHADOW_ID = "export-node-shadow";

/** Nền / bóng cho thẻ thành viên theo kiểu gia phả (chỉ khi đã chọn kiểu). */
export function exportNodePaint(
  settings: TreeExportSettings,
  featured: boolean,
): { fillOverride?: string; filter?: string } {
  if (!settings.themeId) return {};
  return {
    fillOverride:
      !featured && settings.nodeBgGradient ? `url(#${GRADIENT_ID})` : undefined,
    filter: settings.nodeShadow ? `url(#${SHADOW_ID})` : undefined,
  };
}

/**
 * Gradient dọc (ngà → vàng giấy) và bóng đổ mềm cho thẻ. Bóng dựng bằng
 * feGaussianBlur/feOffset/feMerge (SVG 1.1) để Illustrator / CorelDraw mở được.
 */
export default function ExportNodeDefs({ settings }: { settings: TreeExportSettings }) {
  if (!settings.themeId) return null;
  return (
    <defs>
      {settings.nodeBgGradient ? (
        <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={settings.nodeBgColor} />
          <stop offset="100%" stopColor={settings.nodeBgGradient} />
        </linearGradient>
      ) : null}
      {settings.nodeShadow ? (
        <filter id={SHADOW_ID} x="-20%" y="-15%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" />
          <feOffset dx="0" dy="2.6" result="blur" />
          {/* Bóng luôn tối (nâu sẫm) — lấy màu viền sẽ thành quầng sáng trên nền đỏ. */}
          <feFlood floodColor="#3b1206" floodOpacity="0.38" />
          <feComposite in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ) : null}
    </defs>
  );
}
