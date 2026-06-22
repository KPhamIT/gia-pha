"use client";

import { Dispatch, SetStateAction } from "react";
import type {
  LayoutConfig,
  ThemeMode,
} from "@/components/types/family-tree-types";
import Icon from "@/components/icons/Icon";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";

const labelClass = `block text-sm font-medium text-neutral-800`;
const fieldClass = BT.input;
const colorRowClass = `mt-2 flex items-center gap-2 rounded-xl border border-amber-200/80 bg-white px-3 py-2`;
const colorPickerClass =
  "h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-amber-200/80 bg-white p-0.5";
const colorHexClass = "min-w-0 flex-1 text-sm text-neutral-900";

type NumberKey = "horizontalGap" | "verticalStep" | "nodeWidth" | "nodeHeight";
type ColorKey = "nodeBgColor" | "nodeTextColor";

const NUMBER_FIELDS: { key: NumberKey; label: string; min: number }[] = [
  { key: "horizontalGap", label: UI.H_GAP_LABEL, min: 0 },
  { key: "verticalStep", label: UI.V_GAP_LABEL, min: 0 },
  { key: "nodeWidth", label: UI.NODE_WIDTH_LABEL, min: 40 },
  { key: "nodeHeight", label: UI.NODE_HEIGHT_LABEL, min: 40 },
];

const COLOR_FIELDS: { key: ColorKey; label: string }[] = [
  { key: "nodeBgColor", label: UI.NODE_BG_COLOR },
  { key: "nodeTextColor", label: UI.NODE_TEXT_COLOR },
];

type Props = {
  layoutConfig: LayoutConfig;
  setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
  theme: ThemeMode;
  setTheme: Dispatch<SetStateAction<ThemeMode>>;
};

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

      {NUMBER_FIELDS.map(({ key, label, min }) => (
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

      {COLOR_FIELDS.map(({ key, label }) => (
        <label key={key} className={labelClass}>
          {label}
          <div className={colorRowClass}>
            <input
              type="color"
              value={layoutConfig[key]}
              onChange={(event) =>
                setLayoutConfig((prev) => ({
                  ...prev,
                  [key]: event.target.value,
                }))
              }
              className={colorPickerClass}
              aria-label={label}
            />
            <span className={`${colorHexClass} font-mono`}>
              {layoutConfig[key]}
            </span>
          </div>
        </label>
      ))}
    </div>
  );
}
