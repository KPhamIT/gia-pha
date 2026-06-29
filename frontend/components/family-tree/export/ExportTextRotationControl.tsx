"use client";

import { UI } from "@/lib/constants/ui-strings";
import {
  TEXT_ROTATION_MAX,
  TEXT_ROTATION_MIN,
  TEXT_ROTATION_STEP,
  clampTextRotation,
} from "@/lib/family-tree/export-text-curve";
import { fieldLabel, selectClass } from "./tree-export-control-bits";

function StepButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-300/50 bg-white text-lg leading-none text-slate-700"
    >
      {label}
    </button>
  );
}

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function ExportTextRotationControl({ value, onChange }: Props) {
  const setValue = (next: number) => onChange(clampTextRotation(next));
  const status =
    value === 0 ? UI.EXPORT_TEXT_ROTATION_NONE : `${value}°`;

  return (
    <div className="mb-2">
      <span className={fieldLabel}>{UI.EXPORT_TEXT_ROTATION}</span>
      <div className="flex items-center gap-1.5">
        <StepButton
          label="Xoay trái"
          onClick={() => setValue(value - TEXT_ROTATION_STEP)}
        />
        <input
          type="number"
          min={TEXT_ROTATION_MIN}
          max={TEXT_ROTATION_MAX}
          step={TEXT_ROTATION_STEP}
          className={`${selectClass} w-16 shrink-0 px-2 text-center`}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <StepButton
          label="Xoay phải"
          onClick={() => setValue(value + TEXT_ROTATION_STEP)}
        />
        <span className="ml-0.5 text-xs text-slate-500">{status}</span>
      </div>
    </div>
  );
}
