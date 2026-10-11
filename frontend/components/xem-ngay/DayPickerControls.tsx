import { ACTIVITIES } from "@/lib/xem-ngay/evaluate";
import type { ActivityKey } from "@/lib/xem-ngay/checks";
import { canChi } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import { BIRTH_YEARS, toolSelectClass } from "@/components/tools/OwnerFields";

type Props = {
  view: { month: number; year: number };
  years: number[];
  onView: (month: number, year: number) => void;
  activityKey: ActivityKey;
  onActivity: (key: ActivityKey) => void;
  useOwner: boolean;
  onUseOwner: (on: boolean) => void;
  birthYear: number;
  onBirthYear: (year: number) => void;
};

/** Ô chọn tháng/năm, việc định làm và tuổi gia chủ cho lịch xem ngày. */
export default function DayPickerControls({
  view,
  years,
  onView,
  activityKey,
  onActivity,
  useOwner,
  onUseOwner,
  birthYear,
  onBirthYear,
}: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm sm:grid-cols-3 md:p-6">
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="font-semibold text-[#321716]">{UI.XN_MONTH}</span>
          <select
            className={toolSelectClass}
            value={view.month}
            onChange={(e) => onView(Number(e.target.value), view.year)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-semibold text-[#321716]">{UI.XN_YEAR}</span>
          <select
            className={toolSelectClass}
            value={view.year}
            onChange={(e) => onView(view.month, Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="font-semibold text-[#321716]">{UI.XN_ACTIVITY}</span>
        <select
          className={toolSelectClass}
          value={activityKey}
          onChange={(e) => onActivity(e.target.value as ActivityKey)}
        >
          {ACTIVITIES.map((a) => (
            <option key={a.key} value={a.key}>
              {UI.XN_ACTIVITIES[a.key]}
            </option>
          ))}
        </select>
      </label>
      <div className="text-sm">
        <label className="flex items-center gap-2 font-semibold text-[#321716]">
          <input
            type="checkbox"
            checked={useOwner}
            onChange={(e) => onUseOwner(e.target.checked)}
            className="size-4 accent-[#944a00]"
          />
          {UI.XN_OWNER_TOGGLE}
        </label>
        <select
          className={toolSelectClass}
          value={birthYear}
          disabled={!useOwner}
          aria-label={UI.XT_BIRTH_YEAR}
          onChange={(e) => onBirthYear(Number(e.target.value))}
        >
          {BIRTH_YEARS.map((y) => (
            <option key={y} value={y}>
              {y} — {canChi(y)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
