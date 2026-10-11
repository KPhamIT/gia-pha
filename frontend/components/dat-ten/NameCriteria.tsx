import type { NameAnalysis } from "@/lib/dat-ten/analyze";
import { NAME_GROUPS, type NameStatus } from "@/lib/dat-ten/criteria";
import { UI } from "@/lib/constants/ui-strings";

const STATUS: Record<NameStatus, { badge: string; bar: string }> = {
  good: { badge: "bg-emerald-100 text-emerald-800", bar: "bg-emerald-500" },
  neutral: { badge: "bg-amber-100 text-amber-900", bar: "bg-amber-500" },
  bad: { badge: "bg-red-100 text-red-800", bar: "bg-red-600" },
};

/** Hai nhóm tiêu chí (phong thủy, thần số học), mỗi tiêu chí một dòng có điểm và giải thích. */
export default function NameCriteria({ analysis }: { analysis: NameAnalysis }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {NAME_GROUPS.map((group) => (
        <section
          key={group}
          className="overflow-hidden rounded-2xl border border-[#e7ddd2] bg-white shadow-sm"
        >
          <header className="border-b border-[#efe6da] bg-[#fcf6ea] px-5 py-3.5">
            <h3 className="font-serif text-lg font-bold text-[#321716]">
              {UI.DT_GROUP[group]}
            </h3>
            <p className="text-xs text-[#827472]">{UI.DT_GROUP_DESC[group]}</p>
          </header>
          <ul className="divide-y divide-[#efe6da]">
            {analysis.outcomes
              .filter((o) => o.criterion.group === group)
              .map(({ criterion, result }) => (
                <li
                  key={criterion.key}
                  className="space-y-1.5 px-5 py-4 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#321716]">
                      {criterion.label}
                    </span>
                    {result ? (
                      <span className="flex items-center gap-2">
                        <span className="text-xs text-[#827472]">
                          {UI.DT_POINTS(result.score, criterion.maxScore)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[result.status].badge}`}
                        >
                          {UI.DT_STATUS[result.status]}
                        </span>
                      </span>
                    ) : null}
                  </div>
                  {result ? (
                    <>
                      <div
                        className="h-1 rounded-full bg-[#f0ebe3]"
                        aria-hidden
                      >
                        <div
                          className={`h-full rounded-full ${STATUS[result.status].bar}`}
                          style={{
                            width: `${(result.score / criterion.maxScore) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="leading-relaxed text-[#321716]">
                        {result.summary}
                      </p>
                      <p className="text-xs text-[#827472]">{result.detail}</p>
                    </>
                  ) : (
                    <p className="text-[#9a8b88]">{UI.DT_SKIPPED}</p>
                  )}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
