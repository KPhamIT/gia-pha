"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { dayInfo } from "@/lib/lich/ngay";
import {
  evaluateWeddingMonth,
  kimLauLunarYears,
  weddingYears,
} from "@/lib/xem-ngay-cuoi/evaluate";
import { monthsOf } from "@/lib/xem-ngay-cuoi/tables";
import { chiIndex } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import DayDetail from "@/components/xem-ngay/DayDetail";
import MonthCalendar from "@/components/xem-ngay/MonthCalendar";
import { GoodDayChips, MonthNav } from "./CalendarParts";
import CoupleFields from "./CoupleFields";
import WeddingMonths from "./WeddingMonths";
import WeddingYearTable from "./WeddingYearTable";

type Ymd = { year: number; month: number; day: number };

const todayKey = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(
    new Date(),
  );
const noopSubscribe = () => () => {};

/** Ngày hôm nay chỉ lấy ở trình duyệt để tránh lệch ngày khi trang dựng sẵn. */
export default function WeddingDayTool() {
  const key = useSyncExternalStore(noopSubscribe, todayKey, () => null);
  if (!key)
    return (
      <div
        className="h-[720px] animate-pulse rounded-2xl bg-white/60"
        aria-hidden
      />
    );
  const [year, month, day] = key.split("-").map(Number);
  return <WeddingPicker today={{ year, month, day }} />;
}

function WeddingPicker({ today: TODAY }: { today: Ymd }) {
  const [brideYear, setBrideYear] = useState(1998);
  const [groomYear, setGroomYear] = useState(1996);
  const [inLawsAlive, setInLawsAlive] = useState(true);
  const [view, setView] = useState({ month: TODAY.month, year: TODAY.year });
  const [picked, setPicked] = useState<number | null>(null);

  const couple = useMemo(
    () => ({ brideYear, groomYear, inLawsAlive }),
    [brideYear, groomYear, inLawsAlive],
  );
  const days = useMemo(
    () => evaluateWeddingMonth(view.month, view.year, couple),
    [view, couple],
  );
  const thisLunarYear = dayInfo(TODAY.day, TODAY.month, TODAY.year).lunar.year;
  const years = useMemo(
    () => weddingYears(thisLunarYear, 6, brideYear, groomYear),
    [thisLunarYear, brideYear, groomYear],
  );
  const brideChi = chiIndex(brideYear);

  const isThisMonth = view.month === TODAY.month && view.year === TODAY.year;
  const goodDays = days.filter((d) => d.verdict === "tot");
  const selected =
    picked ?? (isThisMonth ? TODAY.day : (goodDays[0]?.info.date.day ?? 1));
  const kimLauYears = kimLauLunarYears(days);

  const go = (month: number, year: number) => {
    setView({ month, year });
    setPicked(null);
  };
  const shift = (delta: number) => {
    const index = view.year * 12 + view.month - 1 + delta;
    go((index % 12) + 1, Math.floor(index / 12));
  };
  /** Nhảy tới tháng dương gần với tháng đại lợi đầu tiên của năm âm `year`. */
  const viewLunarYear = (year: number) => {
    const index = year * 12 + monthsOf(brideChi, "dai-loi")[0];
    go((index % 12) + 1, Math.floor(index / 12));
  };

  return (
    <div className="space-y-8">
      <CoupleFields
        brideYear={brideYear}
        groomYear={groomYear}
        inLawsAlive={inLawsAlive}
        onBrideYear={setBrideYear}
        onGroomYear={setGroomYear}
        onInLawsAlive={setInLawsAlive}
      />

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <WeddingYearTable years={years} onView={viewLunarYear} />
        <WeddingMonths brideChi={brideChi} inLawsAlive={inLawsAlive} />
      </div>

      <section className="grid gap-8 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm lg:grid-cols-[1.2fr_1fr] md:p-8">
        <div>
          <MonthNav month={view.month} year={view.year} onShift={shift} />
          {kimLauYears.map((year) => (
            <p
              key={year}
              className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800"
            >
              {UI.XC_KIM_LAU_BANNER(year, year - brideYear + 1)}
            </p>
          ))}
          <MonthCalendar
            days={days}
            selected={selected}
            today={isThisMonth ? TODAY.day : null}
            onSelect={setPicked}
          />
          <GoodDayChips days={goodDays} onSelect={setPicked} />
        </div>
        {days[selected - 1] ? (
          <div className="space-y-3">
            <DayDetail
              evaluation={days[selected - 1]}
              avoidChi={[brideChi, chiIndex(groomYear)]}
            />
            <p className="text-xs leading-relaxed text-[#827472]">
              {UI.XC_HOURS_NOTE}
            </p>
          </div>
        ) : (
          <p>{UI.XN_PICK_HINT}</p>
        )}
      </section>
    </div>
  );
}
