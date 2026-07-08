"use client";

import { UI } from "@/lib/constants/ui-strings";
import {
  TEXT_ROTATION_MAX,
  TEXT_ROTATION_MIN,
  TEXT_ROTATION_STEP,
  clampTextRotation,
} from "@/lib/family-tree/export-text-curve";
import { fieldLabel } from "./tree-export-control-bits";

const stepBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-300/50 bg-white text-base font-semibold leading-none text-slate-700";
const numInputClass =
  "w-14 shrink-0 rounded-lg border border-amber-300/50 bg-amber-50/90 px-1.5 py-2 text-center text-sm text-amber-950 outline-none focus:border-amber-500";

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
      <div className="flex min-w-0 items-center gap-1.5">
        <button
          type="button"
          aria-label={UI.EXPORT_TEXT_ROTATION_LEFT}
          onClick={() => setValue(value - TEXT_ROTATION_STEP)}
          className={stepBtnClass}
        >
          ↺
        </button>
        <input
          type="number"
          min={TEXT_ROTATION_MIN}
          max={TEXT_ROTATION_MAX}
          step={TEXT_ROTATION_STEP}
          className={numInputClass}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <button
          type="button"
          aria-label={UI.EXPORT_TEXT_ROTATION_RIGHT}
          onClick={() => setValue(value + TEXT_ROTATION_STEP)}
          className={stepBtnClass}
        >
          ↻
        </button>
        <span className="min-w-0 truncate text-xs text-slate-500">{status}</span>
      </div>
    </div>
  );
}
