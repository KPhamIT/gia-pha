"use client";

import { Dispatch, SetStateAction } from "react";
import type { LayoutConfig, ThemeMode } from "@/components/types/family-tree-types";
import Icon from "@/components/icons/Icon";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

const labelClass = `block text-sm font-medium text-neutral-800`;
const fieldClass = BT.input;

const GAP_FIELDS = [
  { key: "horizontalGap" as const, label: UI.H_GAP_LABEL, min: 0 },
  { key: "verticalStep" as const, label: UI.V_GAP_LABEL, min: 0 },
];

type Props = {
  layoutConfig: LayoutConfig;
  setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
  theme: ThemeMode;
  setTheme: Dispatch<SetStateAction<ThemeMode>>;
};

/** Cài đặt toàn cây — không gồm kiểu thẻ từng node (chỉnh qua bottom sheet khi bấm node). */
export default function FamilyTreeSettingsFields({
  layoutConfig,
  setLayoutConfig,
  theme,
  setTheme,
}: Props) {
  return (
    <div className="mt-5 space-y-4">
      <label className={labelClass}>
        {UI.DISPLAY_MODE}
        <div
          className={`mt-2 flex items-center gap-3 rounded-xl border border-amber-200/80 bg-amber-50/40 px-3 py-2.5 text-sm text-neutral-900`}
        >
          <span>{theme === "dark" ? UI.THEME_DARK : UI.THEME_LIGHT}</span>
          <Icon
            path={theme === "dark" ? "sun" : "moon"}
            asButton
            buttonProps={{
              onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
              className:
                "ml-auto rounded-full border border-amber-200/80 bg-white p-2 text-neutral-900 transition active:bg-amber-50",
              "aria-label":
                theme === "dark" ? UI.SWITCH_TO_LIGHT : UI.SWITCH_TO_DARK,
            }}
            width={18}
            height={18}
            stroke="currentColor"
            strokeWidth={2}
          />
        </div>
      </label>

      {GAP_FIELDS.map(({ key, label, min }) => (
        <label key={key} className={labelClass}>
          {label}
          <input
            type="number"
            min={min}
            step={10}
            value={layoutConfig[key]}
            onChange={(event) =>
              setLayoutConfig((prev) => ({
                ...prev,
                [key]: Math.max(min, Number(event.target.value) || min),
              }))
            }
            className={`mt-2 ${fieldClass}`}
          />
        </label>
      ))}

      <label className={labelClass}>
        {UI.EDGE_COLOR_LABEL}
        <div className="mt-2 flex items-center gap-3">
          <input
            type="color"
            value={layoutConfig.edgeColor}
            onChange={(event) =>
              setLayoutConfig((prev) => ({
                ...prev,
                edgeColor: event.target.value,
              }))
            }
            className="h-10 w-14 cursor-pointer rounded-lg border border-amber-200/80 bg-white p-0.5"
          />
          <span className="text-xs text-neutral-500">{layoutConfig.edgeColor}</span>
        </div>
      </label>

      <p className="text-xs text-neutral-500">{UI.TREE_SETTINGS_NODE_HINT}</p>
    </div>
  );
}
