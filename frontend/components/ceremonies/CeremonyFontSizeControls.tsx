"use client";

import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

type Props = {
  scaleLabel: string;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

const stepBtnClass = `${BT.btnBase} ${BT.btnSm} ${BT.btnOnDark} min-w-[2.75rem] px-3 font-semibold`;

export default function CeremonyFontSizeControls({
  scaleLabel,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
}: Props) {
  return (
    <div
      className="mr-auto flex flex-wrap items-center gap-2"
      role="group"
      aria-label={UI.CEREMONY_FONT_SIZE}
    >
      <span className="text-xs font-medium text-amber-100/85">
        {UI.CEREMONY_FONT_SIZE}
      </span>
      <button
        type="button"
        className={stepBtnClass}
        disabled={!canDecrease}
        aria-label={UI.CEREMONY_FONT_SIZE_DECREASE}
        onClick={onDecrease}
      >
        A−
      </button>
      <span
        className="min-w-[3.25rem] text-center text-sm font-semibold tabular-nums text-amber-50"
        aria-live="polite"
      >
        {scaleLabel}
      </span>
      <button
        type="button"
        className={stepBtnClass}
        disabled={!canIncrease}
        aria-label={UI.CEREMONY_FONT_SIZE_INCREASE}
        onClick={onIncrease}
      >
        A+
      </button>
    </div>
  );
}
