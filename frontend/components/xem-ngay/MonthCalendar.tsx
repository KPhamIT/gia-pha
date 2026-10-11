import type { DayEvaluation, DayVerdict } from "@/lib/xem-ngay/evaluate";
import { UI } from "@/lib/constants/ui-strings";

const TONE: Record<DayVerdict, string> = {
  tot: "bg-emerald-600 text-white hover:bg-emerald-700",
  kha: "bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
  binh: "bg-white text-[#504443] hover:bg-[#fcf6ea]",
  xau: "bg-red-50 text-red-800 hover:bg-red-100",
};

type Props = {
  days: DayEvaluation[];
  selected: number | null;
  today: number | null;
  onSelect: (day: number) => void;
};

/** Lịch tháng, tuần bắt đầu thứ Hai; mỗi ô có ngày dương, ngày âm và màu theo kết luận. */
export default function MonthCalendar({
  days,
  selected,
  today,
  onSelect,
}: Props) {
  // Số ô trống đầu tháng (thứ Hai = 0).
  const lead = days.length ? (days[0].info.weekday + 6) % 7 : 0;
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#827472]">
        {UI.XN_WEEKDAYS.map((w) => (
          <div key={w} className="py-1.5">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: lead }, (_, i) => (
          <div key={`lead-${i}`} />
        ))}
        {days.map(({ info, verdict }) => {
          const d = info.date.day;
          const showMonth = info.lunar.day === 1 || d === 1;
          return (
            <button
              key={d}
              type="button"
              onClick={() => onSelect(d)}
              aria-pressed={selected === d}
              aria-label={`${d}/${info.date.month} — ${UI.XN_VERDICT[verdict]}`}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border text-center transition md:aspect-[4/3] ${
                TONE[verdict]
              } ${selected === d ? "border-[#321716] ring-2 ring-[#c99236]" : "border-[#efe6da]"}`}
            >
              <span className="text-base font-bold md:text-lg">{d}</span>
              <span
                className={`text-[10px] md:text-xs ${showMonth ? "font-semibold" : "opacity-75"}`}
              >
                {showMonth
                  ? `${info.lunar.day}/${info.lunar.month}`
                  : info.lunar.day}
              </span>
              {today === d ? (
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-[#c99236]" />
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#504443]">
        {(Object.keys(TONE) as DayVerdict[]).map((v) => (
          <span key={v} className="flex items-center gap-1.5">
            <i
              className={`size-3 rounded border border-[#e7ddd2] ${TONE[v].split(" ")[0]}`}
            />{" "}
            {UI.XN_VERDICT[v]}
          </span>
        ))}
      </div>
    </div>
  );
}
