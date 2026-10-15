import type { LevelNodeStyle } from "@/components/types/family-tree-types";
import type { FamilyTreeLayoutConfig } from "@/components/family-tree/graph/layout";
import type { TreeExportSettings } from "./tree-export-settings";

function stripColors(
  styles: Record<string, LevelNodeStyle> | undefined,
): Record<string, LevelNodeStyle> | undefined {
  if (!styles) return undefined;
  return Object.fromEntries(
    Object.entries(styles).map(([key, style]) => {
      const rest = { ...style };
      delete rest.nodeBgColor;
      delete rest.nodeTextColor;
      return [key, rest];
    }),
  );
}

/**
 * Khi đã chọn kiểu gia phả: bản in dùng màu thẻ của kiểu, bỏ màu riêng theo
 * đời / thành viên trên cây tương tác; giữ kích thước, hướng chữ, kiểu chữ.
 * Chưa chọn kiểu (bản lưu cũ): giữ nguyên màu theo cây.
 */
export function exportLayoutConfig(
  config: FamilyTreeLayoutConfig,
  settings: TreeExportSettings,
): FamilyTreeLayoutConfig {
  if (!settings.themeId) return config;
  return {
    ...config,
    nodeBgColor: settings.nodeBgColor,
    nodeTextColor: settings.nodeTextColor,
    levelStyles: stripColors(config.levelStyles),
    nodeStyles: stripColors(config.nodeStyles),
  };
}
