"use client";

import { Fragment } from "react";
import Icon from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/icon-paths";
import type { NodeFontWeight, NodeTextCase, NodeTextDirection } from "@/components/types/family-tree-types";
import { UI } from "@/lib/constants/ui-strings";
import {
  NODE_APPEARANCE_FIELDS,
  NODE_APPEARANCE_STEPPER_LIMITS,
  NODE_APPEARANCE_TOOLBAR,
} from "@/lib/family-tree/node-appearance";
import type {
  NodeAppearanceKey,
  NodeAppearanceValues,
} from "@/lib/family-tree/node-appearance";

const toolbarShell =
  "rounded-lg border border-neutral-200 bg-neutral-50/80 p-1.5 shadow-sm";
const rowClass = "flex flex-wrap items-center gap-0.5";
const dividerClass = "mx-0.5 h-6 w-px shrink-0 bg-neutral-300";
const btnBase =
  "inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded border border-transparent text-neutral-800 transition hover:bg-white hover:shadow-sm active:bg-neutral-100 disabled:opacity-40";
const btnActive = "border-amber-300 bg-amber-100 text-amber-950 shadow-sm";

type Props = {
  values: NodeAppearanceValues;
  onChange: (
    key: NodeAppearanceKey,
    value: NodeAppearanceValues[NodeAppearanceKey],
  ) => void;
};

function fieldLabel(key: NodeAppearanceKey): string {
  return NODE_APPEARANCE_FIELDS.find((f) => f.key === key)?.label ?? key;
}

function ToolbarDivider() {
  return <div className={dividerClass} role="separator" />;
}

function ToolbarIconBtn({
  icon,
  label,
  active,
  onClick,
  children,
}: {
  icon?: IconName;
  label: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`${btnBase} ${active ? btnActive : ""}`}
    >
      {children ??
        (icon ? (
          <Icon path={icon} size={16} stroke="currentColor" strokeWidth={2} />
        ) : null)}
    </button>
  );
}

function ToolbarStepper({
  icon,
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  icon: IconName;
  label: string;
  value: number;
  min: number;
  max?: number;
  step: number;
  onChange: (next: number) => void;
}) {
  const clamp = (n: number) => {
    const floored = Math.max(min, n);
    return max != null ? Math.min(max, floored) : floored;
  };

  return (
    <div
      className="inline-flex h-8 items-stretch overflow-hidden rounded border border-neutral-200 bg-white"
      title={label}
    >
      <span
        className="grid w-7 place-items-center border-r border-neutral-200 bg-neutral-50 text-neutral-600"
        aria-hidden
      >
        <Icon path={icon} size={14} stroke="currentColor" strokeWidth={2} />
      </span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
        className="w-10 border-0 bg-transparent px-0.5 text-center text-xs tabular-nums text-neutral-900 focus:outline-none"
      />
      <div className="flex flex-col border-l border-neutral-200">
        <button
          type="button"
          aria-label={`${label} +`}
          className="grid h-4 w-5 place-items-center text-neutral-600 hover:bg-neutral-100"
          onClick={() => onChange(clamp(value + step))}
        >
          <Icon path="chevronUp" size={12} stroke="currentColor" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          aria-label={`${label} −`}
          className="grid h-4 w-5 place-items-center border-t border-neutral-200 text-neutral-600 hover:bg-neutral-100"
          onClick={() => onChange(clamp(value - step))}
        >
          <Icon path="chevronDown" size={12} stroke="currentColor" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function ToolbarColorBtn({
  icon,
  label,
  value,
  swatch,
  onChange,
}: {
  icon: IconName;
  label: string;
  value: string;
  swatch: "bar" | "fill";
  onChange: (color: string) => void;
}) {
  return (
    <label
      className={`${btnBase} relative cursor-pointer px-1.5`}
      title={label}
    >
      <span className="relative flex flex-col items-center">
        <Icon path={icon} size={16} stroke="currentColor" strokeWidth={2} />
        <span
          className={`mt-0.5 rounded-sm ${
            swatch === "fill" ? "h-2 w-5" : "h-1 w-5"
          }`}
          style={{ backgroundColor: value }}
        />
      </span>
      <input
        type="color"
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  );
}

function ToolbarWeightGroup({
  value,
  onChange,
}: {
  value: NodeFontWeight;
  onChange: (w: NodeFontWeight) => void;
}) {
  const opts: { value: NodeFontWeight; label: string; className: string }[] = [
    { value: "normal", label: UI.NODE_FONT_WEIGHT_NORMAL, className: "font-normal" },
    {
      value: "semibold",
      label: UI.NODE_FONT_WEIGHT_SEMIBOLD,
      className: "font-semibold",
    },
    { value: "bold", label: UI.NODE_FONT_WEIGHT_BOLD, className: "font-bold" },
  ];

  return (
    <>
      {opts.map((opt) => (
        <button
          key={opt.value}
          type="button"
          title={opt.label}
          aria-label={opt.label}
          onClick={() => onChange(opt.value)}
          className={`${btnBase} w-8 text-sm ${opt.className} ${
            value === opt.value ? btnActive : ""
          }`}
        >
          B
        </button>
      ))}
    </>
  );
}

function ToolbarCaseGroup({
  value,
  onChange,
}: {
  value: NodeTextCase;
  onChange: (c: NodeTextCase) => void;
}) {
  const opts: { value: NodeTextCase; label: string; display: string }[] = [
    { value: "none", label: UI.NODE_TEXT_CASE_AS_TYPED, display: "Aa" },
    { value: "uppercase", label: UI.NODE_TEXT_CASE_UPPER, display: "AA" },
    { value: "lowercase", label: UI.NODE_TEXT_CASE_LOWER, display: "aa" },
  ];

  return (
    <>
      {opts.map((opt) => (
        <button
          key={opt.value}
          type="button"
          title={opt.label}
          aria-label={opt.label}
          onClick={() => onChange(opt.value)}
          className={`${btnBase} w-8 text-xs font-medium ${
            value === opt.value ? btnActive : ""
          }`}
        >
          {opt.display}
        </button>
      ))}
    </>
  );
}

function ToolbarDirectionGroup({
  value,
  onChange,
}: {
  value: NodeTextDirection;
  onChange: (d: NodeTextDirection) => void;
}) {
  return (
    <>
      <ToolbarIconBtn
        icon="textHorizontal"
        label={UI.NODE_TEXT_DIRECTION_HORIZONTAL}
        active={value === "horizontal"}
        onClick={() => onChange("horizontal")}
      />
      <ToolbarIconBtn
        icon="textVertical"
        label={UI.NODE_TEXT_DIRECTION_VERTICAL}
        active={value === "vertical"}
        onClick={() => onChange("vertical")}
      />
    </>
  );
}

function renderControl(
  control: (typeof NODE_APPEARANCE_TOOLBAR)[number][number],
  values: NodeAppearanceValues,
  onChange: Props["onChange"],
) {
  if (control.type === "stepper") {
    const limits = NODE_APPEARANCE_STEPPER_LIMITS[control.key]!;
    const val = values[control.key] as number;
    return (
      <ToolbarStepper
        icon={control.icon}
        label={fieldLabel(control.key)}
        value={val}
        min={limits.min}
        max={limits.max}
        step={limits.step}
        onChange={(n) => onChange(control.key, n)}
      />
    );
  }

  if (control.type === "color") {
    const val = values[control.key] as string;
    return (
      <ToolbarColorBtn
        icon={control.icon}
        label={fieldLabel(control.key)}
        value={val}
        swatch={control.swatch ?? "bar"}
        onChange={(c) => onChange(control.key, c)}
      />
    );
  }

  if (control.type === "weight") {
    return (
      <ToolbarWeightGroup
        value={values.nodeFontWeight}
        onChange={(w) => onChange("nodeFontWeight", w)}
      />
    );
  }

  if (control.type === "case") {
    return (
      <ToolbarCaseGroup
        value={values.nodeTextCase}
        onChange={(c) => onChange("nodeTextCase", c)}
      />
    );
  }

  if (control.type === "direction") {
    return (
      <ToolbarDirectionGroup
        value={values.nodeTextDirection}
        onChange={(d) => onChange("nodeTextDirection", d)}
      />
    );
  }

  return null;
}

export default function NodeAppearanceToolbar({ values, onChange }: Props) {
  return (
    <div className={`${toolbarShell} space-y-1`}>
      {NODE_APPEARANCE_TOOLBAR.map((row, rowIndex) => (
        <div key={rowIndex} className={rowClass}>
          {row.map((control, index) => (
            <Fragment key={control.type === "stepper" || control.type === "color" ? control.key : control.type}>
              {index > 0 ? <ToolbarDivider /> : null}
              {renderControl(control, values, onChange)}
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
