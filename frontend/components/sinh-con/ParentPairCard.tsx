import type { ParentAnalysis } from "@/lib/sinh-con/analyze";
import type { PairStatus } from "@/lib/sinh-con/criteria";
import { canChi, napAm } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";

const STATUS: Record<PairStatus, { badge: string; bar: string }> = {
  good: { badge: "bg-emerald-100 text-emerald-800", bar: "bg-emerald-500" },
  neutral: { badge: "bg-amber-100 text-amber-900", bar: "bg-amber-500" },
  bad: { badge: "bg-red-100 text-red-800", bar: "bg-red-600" },
};

/** Một bên bố hoặc mẹ: điểm và kết quả từng tiêu chí so với con. */
export default function ParentPairCard({ parent }: { parent: ParentAnalysis }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#e7ddd2] bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[#efe6da] bg-[#fcf6ea] px-5 py-3.5">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#321716]">
            {UI.SC_ROLE_TITLE[parent.role]}
          </h3>
          <p className="text-xs text-[#827472]">
            {parent.year} · {canChi(parent.year)} · {napAm(parent.year).name}
          </p>
        </div>
        <span className="font-semibold text-[#504443]">
          {UI.SC_POINTS(parent.score, parent.max)}
        </span>
      </header>
      <ul className="divide-y divide-[#efe6da]">
        {parent.outcomes.map(({ criterion, result }) => {
          const tone = STATUS[result.status];
          return (
            <li key={criterion.key} className="space-y-1.5 px-5 py-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#321716]">
                  {criterion.label}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-[#827472]">
                    {UI.SC_POINTS(result.score, criterion.maxScore)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone.badge}`}
                  >
                    {UI.SC_STATUS[result.status]}
                  </span>
                </span>
              </div>
              <div className="h-1 rounded-full bg-[#f0ebe3]" aria-hidden>
                <div
                  className={`h-full rounded-full ${tone.bar}`}
                  style={{
                    width: `${(result.score / criterion.maxScore) * 100}%`,
                  }}
                />
              </div>
              <p className="leading-relaxed text-[#321716]">{result.summary}</p>
              <p className="text-xs text-[#827472]">{result.detail}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
