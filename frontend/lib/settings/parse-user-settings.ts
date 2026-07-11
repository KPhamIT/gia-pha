import type { LayoutConfig, ThemeMode } from "@/components/types/family-tree-types";
import type { UserSettings } from "@/lib/api/modules/settings";
import { parseAppearanceMap } from "@/lib/family-tree/node-appearance";
import { DEFAULT_USER_SETTINGS } from "@/lib/settings/default-user-settings";

export const INITIAL_LAYOUT_CONFIG: LayoutConfig = {
  horizontalGap: DEFAULT_USER_SETTINGS.horizontalGap as number,
  verticalStep: DEFAULT_USER_SETTINGS.verticalStep as number,
  edgeColor: DEFAULT_USER_SETTINGS.edgeColor as string,
  showSpouses: DEFAULT_USER_SETTINGS.showSpouses as boolean,
  nodeWidth: DEFAULT_USER_SETTINGS.nodeWidth as number,
  nodeHeight: DEFAULT_USER_SETTINGS.nodeHeight as number,
  nodeBgColor: DEFAULT_USER_SETTINGS.nodeBgColor as string,
  nodeTextColor: DEFAULT_USER_SETTINGS.nodeTextColor as string,
  nodeFontSize: DEFAULT_USER_SETTINGS.nodeFontSize as number,
  nodeFontWeight: DEFAULT_USER_SETTINGS.nodeFontWeight as LayoutConfig["nodeFontWeight"],
  nodeTextDirection:
    DEFAULT_USER_SETTINGS.nodeTextDirection as LayoutConfig["nodeTextDirection"],
  nodeTextCase:
    DEFAULT_USER_SETTINGS.nodeTextCase as LayoutConfig["nodeTextCase"],
  levelStyles: parseAppearanceMap(DEFAULT_USER_SETTINGS.levelStyles),
  nodeStyles: parseAppearanceMap(DEFAULT_USER_SETTINGS.nodeStyles),
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
    ...(typeof settings.edgeColor === "string" && {
      edgeColor: settings.edgeColor,
    }),
    ...(typeof settings.showSpouses === "boolean" && {
      showSpouses: settings.showSpouses,
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
    ...(typeof settings.nodeFontSize === "number" && {
      nodeFontSize: settings.nodeFontSize,
    }),
    ...((settings.nodeFontWeight === "normal" ||
      settings.nodeFontWeight === "semibold" ||
      settings.nodeFontWeight === "bold") && {
      nodeFontWeight: settings.nodeFontWeight,
    }),
    ...((settings.nodeTextDirection === "horizontal" ||
      settings.nodeTextDirection === "vertical") && {
      nodeTextDirection: settings.nodeTextDirection,
    }),
    ...((settings.nodeTextCase === "none" ||
      settings.nodeTextCase === "uppercase" ||
      settings.nodeTextCase === "lowercase") && {
      nodeTextCase: settings.nodeTextCase,
    }),
    ...((): Pick<LayoutConfig, "levelStyles" | "nodeStyles"> | Record<string, never> => {
      const levelStyles = parseAppearanceMap(settings.levelStyles);
      const nodeStyles = parseAppearanceMap(settings.nodeStyles);
      return {
        ...(levelStyles ? { levelStyles } : {}),
        ...(nodeStyles ? { nodeStyles } : {}),
      };
    })(),
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
