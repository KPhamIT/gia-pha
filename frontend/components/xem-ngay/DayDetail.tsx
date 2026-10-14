import { hoursOfDay } from "@/lib/lich/ngay";
import type { DayEvaluation, DayVerdict } from "@/lib/xem-ngay/evaluate";
import type { CheckStatus } from "@/lib/xem-ngay/checks";
import { UI } from "@/lib/constants/ui-strings";

const VERDICT_TONE: Record<DayVerdict, string> = {
  tot: "bg-emerald-600 text-white",
  kha: "bg-emerald-100 text-emerald-900",
  binh: "bg-[#efe6da] text-[#504443]",
  xau: "bg-red-700 text-white",
};
const STATUS_TONE: Record<CheckStatus, string> = {
  good: "bg-emerald-100 text-emerald-800",
  neutral: "bg-amber-100 text-amber-900",
  bad: "bg-red-100 text-red-800",
};

/**
 * Chi tiết một ngày: âm lịch, can chi, kết luận, từng tiêu chí và giờ hoàng đạo.
 * `avoidChi`: chi tuổi cần tránh — bỏ giờ hoàng đạo xung với các tuổi này.
 */
export default function DayDetail({
  evaluation,
  avoidChi = [],
}: {
  evaluation: DayEvaluation;
  avoidChi?: readonly number[];
}) {
  const { info, outcomes, verdict } = evaluation;
  const goodHours = hoursOfDay(info.dayChi).filter(
    (h, i) =>
      h.than.good && !avoidChi.some((chi) => (i - chi + 12) % 12 === 6),
  );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#827472]">
            {UI.XN_WEEKDAY_FULL[info.weekday]}
          </p>
          <p className="font-serif text-3xl font-bold text-[#321716]">
            {info.date.day}/{info.date.month}/{info.date.year}
          </p>
          <p className="mt-1 font-medium text-[#944a00]">
            {UI.XN_LUNAR(info.lunar.day, info.lunar.month, info.lunar.leap)}
          </p>
        </div>
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-bold ${VERDICT_TONE[verdict]}`}
        >
          {UI.XN_VERDICT[verdict]}
        </span>
      </div>
      <p className="text-sm text-[#504443]">
        {UI.XN_CAN_CHI(info.dayCanChi, info.monthCanChi, info.yearCanChi)} ·{" "}
        {UI.XN_TIET(info.tietKhi)}
      </p>

      <ul className="space-y-2.5">
        {outcomes.map(({ check, result }) => (
          <li
            key={check.key}
            className="rounded-xl border border-[#efe6da] bg-[#fdfbf7] p-3.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[#321716]">
                {check.label}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_TONE[result.status]}`}
              >
                {UI.XN_STATUS[result.status]}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-[#504443]">
              {result.summary}
            </p>
          </li>
        ))}
      </ul>

      <div>
        <p className="text-sm font-semibold text-[#321716]">
          {UI.XN_GOOD_HOURS}
        </p>
        <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {goodHours.map((h) => (
            <li
              key={h.chi}
              className="rounded-lg bg-emerald-50 px-3 py-2 text-sm"
            >
              <span className="font-semibold text-emerald-900">{h.chi}</span>
              <span className="ml-1.5 text-emerald-800">{h.range}</span>
              <span className="block text-[11px] text-emerald-700">
                {h.than.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
