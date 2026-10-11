"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { activityByKey, evaluateMonth } from "@/lib/xem-ngay/evaluate";
import type { ActivityKey } from "@/lib/xem-ngay/checks";
import { useOwnerProfile } from "@/lib/tools/owner-profile";
import { UI } from "@/lib/constants/ui-strings";
import DayDetail from "./DayDetail";
import DayPickerControls from "./DayPickerControls";
import MonthCalendar from "./MonthCalendar";

type Ymd = { year: number; month: number; day: number };

/** Hôm nay theo giờ Việt Nam, dạng YYYY-MM-DD (chuỗi để snapshot ổn định). */
const todayKey = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(
    new Date(),
  );
const noopSubscribe = () => () => {};

/**
 * Xem ngày giờ tốt. Ngày hôm nay chỉ lấy ở trình duyệt — trang có thể được dựng sẵn
 * lúc build, nếu tính ở server sẽ lệch ngày và lỗi hydration.
 */
export default function DayPickerTool() {
  const key = useSyncExternalStore(noopSubscribe, todayKey, () => null);
  if (!key)
    return (
      <div
        className="h-[640px] animate-pulse rounded-2xl bg-white/60"
        aria-hidden
      />
    );
  const [year, month, day] = key.split("-").map(Number);
  return <DayPicker today={{ year, month, day }} />;
}

/** Lịch tháng tô màu theo việc định làm + chi tiết ngày đang chọn. */
function DayPicker({ today: TODAY }: { today: Ymd }) {
  const YEARS = Array.from({ length: 5 }, (_, i) => TODAY.year - 1 + i);
  const [owner, setOwner] = useOwnerProfile();
  const [view, setView] = useState({ month: TODAY.month, year: TODAY.year });
  const [activityKey, setActivityKey] = useState<ActivityKey>("dong-tho");
  const [useOwner, setUseOwner] = useState(true);
  const [picked, setPicked] = useState<number | null>(null);
  const activity = activityByKey(activityKey);
  const ownerChi = useOwner ? (owner.birthYear + 8) % 12 : null;
  const days = useMemo(
    () => evaluateMonth(view.month, view.year, activity, ownerChi),
    [view, activity, ownerChi],
  );
  const isThisMonth = view.month === TODAY.month && view.year === TODAY.year;
  const goodDays = days.filter((d) => d.verdict === "tot");
  const selected =
    picked ?? (isThisMonth ? TODAY.day : (goodDays[0]?.info.date.day ?? 1));

  const go = (month: number, year: number) => {
    setView({ month, year });
    setPicked(null);
  };
  const shift = (delta: number) => {
    const index = view.year * 12 + view.month - 1 + delta;
    go((index % 12) + 1, Math.floor(index / 12));
  };

  return (
    <div className="space-y-8">
      <DayPickerControls
        view={view}
        years={YEARS}
        onView={go}
        activityKey={activityKey}
        onActivity={setActivityKey}
        useOwner={useOwner}
        onUseOwner={setUseOwner}
        birthYear={owner.birthYear}
        onBirthYear={(birthYear) => setOwner({ birthYear })}
      />

      <section className="grid gap-8 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm lg:grid-cols-[1.2fr_1fr] md:p-8">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shift(-1)}
              aria-label={UI.XN_PREV}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-[#944a00] hover:bg-[#fcf6ea]"
            >
              ‹ <span className="hidden sm:inline">{UI.XN_PREV}</span>
            </button>
            <h2 className="whitespace-nowrap font-serif text-xl font-bold text-[#321716]">
              {UI.XN_MONTH} {view.month}/{view.year}
            </h2>
            <button
              type="button"
              onClick={() => shift(1)}
              aria-label={UI.XN_NEXT}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-[#944a00] hover:bg-[#fcf6ea]"
            >
              <span className="hidden sm:inline">{UI.XN_NEXT}</span> ›
            </button>
          </div>
          <MonthCalendar
            days={days}
            selected={selected}
            today={isThisMonth ? TODAY.day : null}
            onSelect={setPicked}
          />
          <p className="mt-5 text-sm font-semibold text-[#321716]">
            {goodDays.length
              ? UI.XN_GOOD_DAYS(goodDays.length, UI.XN_ACTIVITIES[activityKey])
              : UI.XN_GOOD_DAYS_NONE}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {goodDays.map(({ info }) => (
              <li key={info.date.day}>
                <button
                  type="button"
                  onClick={() => setPicked(info.date.day)}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-900 hover:bg-emerald-100"
                >
                  {UI.XN_WEEKDAY_FULL[info.weekday]} {info.date.day}/
                  {info.date.month}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {days[selected - 1] ? (
          <DayDetail evaluation={days[selected - 1]} />
        ) : (
          <p>{UI.XN_PICK_HINT}</p>
        )}
      </section>
    </div>
  );
}
