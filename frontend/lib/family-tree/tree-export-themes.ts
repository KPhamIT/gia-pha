import { EXPORT_OUTER_MARGIN } from "./export-tree-geometry";
import type { ExportImageLayer } from "./export-decoration-layers";
import {
  defaultTreeExportSettings,
  normalizeTreeExportSettings,
  type TreeExportSettings,
} from "./tree-export-settings";
import {
  FRAME_H,
  FRAME_W,
  TREE_EXPORT_THEMES,
  type TreeExportTheme,
} from "./tree-export-theme-data";

export { TREE_EXPORT_THEMES, type TreeExportTheme } from "./tree-export-theme-data";

const hidden = { x: null, y: null, width: null, height: null, visible: false };

export function getTreeExportTheme(id: string | null): TreeExportTheme | null {
  return TREE_EXPORT_THEMES.find((t) => t.id === id) ?? null;
}

function frameLayer(theme: TreeExportTheme): ExportImageLayer | null {
  if (!theme.frame) return null;
  return {
    id: "theme-frame",
    type: "image",
    tier: "behind-tree",
    order: -1,
    x: EXPORT_OUTER_MARGIN,
    y: EXPORT_OUTER_MARGIN,
    width: FRAME_W,
    height: FRAME_H,
    assetUrl: theme.frame.url,
    assetProvider: "static",
    name: theme.label,
    aspectRatio: theme.frame.aspectRatio,
    locked: true,
  };
}

/**
 * Áp kiểu: dựng lại toàn bộ cài đặt từ mặc định + kiểu (bỏ chỉnh tay cũ),
 * chỉ giữ tên dòng họ người dùng đã nhập.
 */
export function applyTreeExportTheme(
  theme: TreeExportTheme,
  current: TreeExportSettings,
): TreeExportSettings {
  const usesScroll = theme.frame == null || theme.scrollHeader === true;
  const base = normalizeTreeExportSettings({
    ...defaultTreeExportSettings(),
    ...(usesScroll ? {} : { scroll: hidden, dragonLeft: hidden, dragonRight: hidden }),
    ...theme.overrides,
    themeId: theme.id,
    clanName: current.clanName,
    // Không truyền layers → dựng lại cuốn thư / rồng theo cờ hiển thị.
    layers: undefined,
  });
  const frame = frameLayer(theme);
  return { ...base, layers: frame ? [frame, ...base.layers] : base.layers };
}
