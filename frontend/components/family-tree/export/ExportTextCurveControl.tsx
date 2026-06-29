"use client";

import { UI } from "@/lib/constants/ui-strings";
import {
  TEXT_CURVE_MAX,
  TEXT_CURVE_MIN,
  TEXT_CURVE_STEP,
  clampTextCurve,
} from "@/lib/family-tree/export-text-curve";
import { fieldLabel, selectClass } from "./tree-export-control-bits";

function ArcIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      width="20"
      height="12"
      viewBox="0 0 20 12"
      className="shrink-0 text-slate-500"
      aria-hidden
    >
      <path
        d={direction === "up" ? "M2 10 Q10 0 18 10" : "M2 2 Q10 12 18 2"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

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

export default function ExportTextCurveControl({ value, onChange }: Props) {
  const setValue = (next: number) => onChange(clampTextCurve(next));
  const status =
    value === 0 ? UI.EXPORT_TEXT_CURVE_STRAIGHT : String(value);

  return (
    <div className="mb-2">
      <span className={fieldLabel}>{UI.EXPORT_TEXT_CURVE}</span>
      <div className="flex items-center gap-1.5">
        <ArcIcon direction="up" />
        <StepButton label="Giảm" onClick={() => setValue(value - TEXT_CURVE_STEP)} />
        <input
          type="number"
          min={TEXT_CURVE_MIN}
          max={TEXT_CURVE_MAX}
          step={TEXT_CURVE_STEP}
          className={`${selectClass} w-16 shrink-0 px-2 text-center`}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <StepButton label="Tăng" onClick={() => setValue(value + TEXT_CURVE_STEP)} />
        <ArcIcon direction="down" />
        <span className="ml-0.5 text-xs text-slate-500">{status}</span>
      </div>
    </div>
  );
}
