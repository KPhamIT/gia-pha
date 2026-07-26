"use client";

import type { ClanDutyYearSummary } from "@/lib/api/modules/clan-duty";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  year: number;
  yearOptions: ClanDutyYearSummary[];
  saving: boolean;
  canEdit: boolean;
  onSelectYear: (year: number) => void;
  onAddYear: () => void;
};

export default function ClanDutyYearStrip({
  year,
  yearOptions,
  saving,
  canEdit,
  onSelectYear,
  onAddYear,
}: Props) {
  const years = [...yearOptions]
    .map((item) => item.year)
    .concat(yearOptions.some((item) => item.year === year) ? [] : [year])
    .sort((a, b) => b - a);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#504443]">
          {UI.CLAN_DUTY_TIME_SECTION}
        </h2>
        {canEdit ? (
          <button
            type="button"
            disabled={saving}
            onClick={onAddYear}
            className="flex items-center gap-1 text-xs font-semibold text-[#944a00] hover:underline disabled:opacity-50"
          >
            <span className="text-base leading-none">+</span>
            {UI.CLAN_DUTY_YEAR_ADD}
          </button>
        ) : null}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {years.map((itemYear) => {
          const active = itemYear === year;
          return (
            <button
              key={itemYear}
              type="button"
              disabled={saving || active}
              onClick={() => onSelectYear(itemYear)}
              className={`flex h-20 w-32 shrink-0 flex-col items-center justify-center rounded-xl transition ${
                active
                  ? "border-2 border-[#944a00] bg-white shadow-[0_4px_20px_-2px_rgba(69,26,3,0.04)]"
                  : "bg-[#f0ede9] opacity-60 hover:opacity-80"
              }`}
            >
              <span
                className={`text-xs font-medium tracking-wide ${
                  active ? "text-[#944a00]" : "text-[#504443]"
                }`}
              >
                {active ? UI.CLAN_DUTY_YEAR_ACTIVE : UI.CLAN_DUTY_YEAR_HISTORY}
              </span>
              <span
                className={`font-serif text-2xl font-semibold leading-8 ${
                  active ? "text-[#321716]" : "text-[#504443]"
                }`}
              >
                {itemYear}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
