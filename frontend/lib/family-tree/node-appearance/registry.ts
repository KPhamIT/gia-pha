import type { NodeFontWeight, NodeTextCase, NodeTextDirection } from "@/components/types/family-tree-types";
import { UI } from "@/lib/constants/ui-strings";
import type { NodeAppearanceKey, NodeAppearanceValues } from "./types";

type NumberFieldDef = {
  kind: "number";
  key: Extract<
    NodeAppearanceKey,
    "nodeWidth" | "nodeHeight" | "nodeFontSize"
  >;
  label: string;
  min: number;
  max?: number;
  step: number;
};

type ColorFieldDef = {
  kind: "color";
  key: Extract<NodeAppearanceKey, "nodeBgColor" | "nodeTextColor">;
  label: string;
};

type SelectFieldDef<K extends NodeAppearanceKey> = {
  kind: "select";
  key: K;
  label: string;
  options: { value: NodeAppearanceValues[K]; label: string }[];
};

export type NodeAppearanceFieldDef =
  | NumberFieldDef
  | ColorFieldDef
  | SelectFieldDef<"nodeFontWeight">
  | SelectFieldDef<"nodeTextDirection">
  | SelectFieldDef<"nodeTextCase">;

/** Khai báo field UI — thêm thuộc tính mới tại đây, không sửa component form. */
export const NODE_APPEARANCE_FIELDS: NodeAppearanceFieldDef[] = [
  {
    kind: "number",
    key: "nodeWidth",
    label: UI.NODE_WIDTH_LABEL,
    min: 40,
    step: 10,
  },
  {
    kind: "number",
    key: "nodeHeight",
    label: UI.NODE_HEIGHT_LABEL,
    min: 40,
    step: 10,
  },
  { kind: "color", key: "nodeBgColor", label: UI.NODE_BG_COLOR },
  { kind: "color", key: "nodeTextColor", label: UI.NODE_TEXT_COLOR },
  {
    kind: "number",
    key: "nodeFontSize",
    label: UI.NODE_FONT_SIZE_LABEL,
    min: 10,
    max: 32,
    step: 1,
  },
  {
    kind: "select",
    key: "nodeFontWeight",
    label: UI.NODE_FONT_WEIGHT_LABEL,
    options: [
      { value: "normal" as NodeFontWeight, label: UI.NODE_FONT_WEIGHT_NORMAL },
      {
        value: "semibold" as NodeFontWeight,
        label: UI.NODE_FONT_WEIGHT_SEMIBOLD,
      },
      { value: "bold" as NodeFontWeight, label: UI.NODE_FONT_WEIGHT_BOLD },
    ],
  },
  {
    kind: "select",
    key: "nodeTextDirection",
    label: UI.NODE_TEXT_DIRECTION_LABEL,
    options: [
      {
        value: "horizontal" as NodeTextDirection,
        label: UI.NODE_TEXT_DIRECTION_HORIZONTAL,
      },
      {
        value: "vertical" as NodeTextDirection,
        label: UI.NODE_TEXT_DIRECTION_VERTICAL,
      },
    ],
  },
  {
    kind: "select",
    key: "nodeTextCase",
    label: UI.NODE_TEXT_CASE_LABEL,
    options: [
      { value: "none" as const, label: UI.NODE_TEXT_CASE_AS_TYPED },
      { value: "uppercase" as const, label: UI.NODE_TEXT_CASE_UPPER },
      { value: "lowercase" as const, label: UI.NODE_TEXT_CASE_LOWER },
    ],
  },
];
