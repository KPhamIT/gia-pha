import type { NameContext } from "@/lib/dat-ten/criteria";
import { formatNumber } from "@/lib/dat-ten/numerology";
import { UI } from "@/lib/constants/ui-strings";

type Key = keyof typeof UI.DT_NUM_LABEL;

/** Bốn con số thần số học của bé kèm ý nghĩa ngắn. */
export default function NumberCards({ ctx }: { ctx: NameContext }) {
  const values: Record<Key, number | null> = {
    lifePath: ctx.lifePath,
    destiny: ctx.numbers?.destiny ?? null,
    soul: ctx.numbers?.soul ?? null,
    personality: ctx.numbers?.personality ?? null,
  };
  return (
    <section>
      <h2 className="font-serif text-2xl font-bold text-[#321716]">
        {UI.DT_NUMBERS_TITLE}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(values) as Key[]).map((key) => {
          const value = values[key];
          return (
            <li
              key={key}
              className="rounded-2xl border border-[#e7ddd2] bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#b8893b]">
                {UI.DT_NUM_LABEL[key]}
              </p>
              <p className="mt-1 font-serif text-4xl font-bold text-[#321716]">
                {value === null ? "–" : formatNumber(value)}
              </p>
              <p className="text-xs text-[#827472]">{UI.DT_NUM_SOURCE[key]}</p>
              {value !== null ? (
                <p className="mt-2 text-sm leading-relaxed text-[#504443]">
                  {UI.DT_NUM_MEANING[value]}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
