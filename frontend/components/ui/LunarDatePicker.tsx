"use client";

import { inputClassName } from "@/components/ui/CollapsibleSection";
import {
  LUNAR_DAY_OPTIONS,
  LUNAR_MONTH_OPTIONS,
} from "@/utils/lunar-date";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  day: string;
  month: string;
  disabled?: boolean;
  onChange: (next: { day: string; month: string }) => void;
};

/** Chọn ngày + tháng âm lịch (hỗ trợ tháng nhuận). */
export default function LunarDatePicker({
  day,
  month,
  disabled = false,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <select
        value={month}
        disabled={disabled}
        aria-label={UI.DEATH_LUNAR_MONTH}
        onChange={(e) => onChange({ day, month: e.target.value })}
        className={inputClassName}
      >
        <option value="">{UI.LUNAR_MONTH_PLACEHOLDER}</option>
        {LUNAR_MONTH_OPTIONS.map((opt) => (
          <option key={opt.value} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={day}
        disabled={disabled}
        aria-label={UI.DEATH_LUNAR_DAY}
        onChange={(e) => onChange({ day: e.target.value, month })}
        className={inputClassName}
      >
        <option value="">{UI.LUNAR_DAY_PLACEHOLDER}</option>
        {LUNAR_DAY_OPTIONS.map((d) => (
          <option key={d} value={String(d)}>
            {UI.LUNAR_DAY_OPTION(d)}
          </option>
        ))}
      </select>
    </div>
  );
}
