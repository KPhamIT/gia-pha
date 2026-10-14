import type { DayEvaluation } from "@/lib/xem-ngay/evaluate";
import { UI } from "@/lib/constants/ui-strings";

const navButton =
  "rounded-full px-3 py-1.5 text-sm font-semibold text-[#944a00] hover:bg-[#fcf6ea]";

/** Tiêu đề tháng với nút tháng trước / tháng sau. */
export function MonthNav({
  month,
  year,
  onShift,
}: {
  month: number;
  year: number;
  onShift: (delta: number) => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <button
        type="button"
        onClick={() => onShift(-1)}
        aria-label={UI.XN_PREV}
        className={navButton}
      >
        ‹ <span className="hidden sm:inline">{UI.XN_PREV}</span>
      </button>
      <h2 className="whitespace-nowrap font-serif text-xl font-bold text-[#321716]">
        {UI.XN_MONTH} {month}/{year}
      </h2>
      <button
        type="button"
        onClick={() => onShift(1)}
        aria-label={UI.XN_NEXT}
        className={navButton}
      >
        <span className="hidden sm:inline">{UI.XN_NEXT}</span> ›
      </button>
    </div>
  );
}

/** Danh sách ngày tốt trong tháng, bấm để xem chi tiết. */
export function GoodDayChips({
  days,
  onSelect,
}: {
  days: DayEvaluation[];
  onSelect: (day: number) => void;
}) {
  return (
    <>
      <p className="mt-5 text-sm font-semibold text-[#321716]">
        {days.length ? UI.XC_GOOD_DAYS(days.length) : UI.XC_GOOD_DAYS_NONE}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {days.map(({ info }) => (
          <li key={info.date.day}>
            <button
              type="button"
              onClick={() => onSelect(info.date.day)}
              className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-900 hover:bg-emerald-100"
            >
              {UI.XN_WEEKDAY_FULL[info.weekday]} {info.date.day}/
              {info.date.month}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
