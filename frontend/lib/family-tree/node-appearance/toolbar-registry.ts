import type { IconName } from "@/components/icons/icon-paths";
import type { NodeAppearanceKey } from "./types";

export type ToolbarControl =
  | { type: "stepper"; key: NodeAppearanceKey; icon: IconName }
  | { type: "color"; key: NodeAppearanceKey; icon: IconName; swatch?: "bar" | "fill" }
  | { type: "weight" }
  | { type: "case" }
  | { type: "direction" };

export type ToolbarRow = ToolbarControl[];

/** Bố cục toolbar — thêm control mới tại đây. */
export const NODE_APPEARANCE_TOOLBAR: ToolbarRow[] = [
  [
    { type: "stepper", key: "nodeWidth", icon: "expandWidth" },
    { type: "stepper", key: "nodeHeight", icon: "expandHeight" },
    { type: "stepper", key: "nodeFontSize", icon: "fontSize" },
  ],
  [
    { type: "weight" },
    { type: "case" },
    { type: "color", key: "nodeBgColor", icon: "fillColor", swatch: "fill" },
    { type: "color", key: "nodeTextColor", icon: "textColor", swatch: "bar" },
    { type: "direction" },
  ],
];

export const NODE_APPEARANCE_STEPPER_LIMITS: Partial<
  Record<NodeAppearanceKey, { min: number; max?: number; step: number }>
> = {
  nodeWidth: { min: 40, step: 10 },
  nodeHeight: { min: 40, step: 10 },
  nodeFontSize: { min: 10, max: 32, step: 1 },
};
