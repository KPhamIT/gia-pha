import type { LayoutConfig, ThemeMode } from "@/components/types/family-tree-types";
import type { UserSettings } from "@/lib/api/modules/settings";
import { DEFAULT_USER_SETTINGS } from "@/lib/settings/default-user-settings";

export const INITIAL_LAYOUT_CONFIG: LayoutConfig = {
  horizontalGap: DEFAULT_USER_SETTINGS.horizontalGap as number,
  verticalStep: DEFAULT_USER_SETTINGS.verticalStep as number,
  nodeWidth: DEFAULT_USER_SETTINGS.nodeWidth as number,
  nodeHeight: DEFAULT_USER_SETTINGS.nodeHeight as number,
  nodeBgColor: DEFAULT_USER_SETTINGS.nodeBgColor as string,
  nodeTextColor: DEFAULT_USER_SETTINGS.nodeTextColor as string,
};

export function layoutConfigFromUserSettings(
  settings: UserSettings,
  base: LayoutConfig = INITIAL_LAYOUT_CONFIG,
): LayoutConfig {
  return {
    ...base,
    ...(typeof settings.horizontalGap === "number" && {
      horizontalGap: settings.horizontalGap,
    }),
    ...(typeof settings.verticalStep === "number" && {
      verticalStep: settings.verticalStep,
    }),
    ...(typeof settings.nodeWidth === "number" && {
      nodeWidth: settings.nodeWidth,
    }),
    ...(typeof settings.nodeHeight === "number" && {
      nodeHeight: settings.nodeHeight,
    }),
    ...(typeof settings.nodeBgColor === "string" && {
      nodeBgColor: settings.nodeBgColor,
    }),
    ...(typeof settings.nodeTextColor === "string" && {
      nodeTextColor: settings.nodeTextColor,
    }),
  };
}

export function themeFromUserSettings(
  settings: UserSettings,
  fallback: ThemeMode = "light",
): ThemeMode {
  return typeof settings.theme === "string"
    ? (settings.theme as ThemeMode)
    : fallback;
}
