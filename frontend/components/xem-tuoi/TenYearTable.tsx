import { CRITERIA_GROUPS, type Criterion, type CriterionStatus, type Gender } from "@/lib/xem-tuoi/criteria";
import { analyzeBuild, type Verdict } from "@/lib/xem-tuoi/lam-nha";
import { UI } from "@/lib/constants/ui-strings";

const VERDICT_CLASS: Record<Verdict, string> = {
  dat: "bg-emerald-100 text-emerald-800",
  "chua-dat": "bg-red-100 text-red-800",
};

const MARK: Record<CriterionStatus, { text: string; className: string }> = {
  good: { text: "✓", className: "text-emerald-700" },
  neutral: { text: "•", className: "text-amber-700" },
  bad: { text: "✗", className: "font-semibold text-red-700" },
};

type Props = {
  birthYear: number;
  gender: Gender;
  criteria: readonly Criterion[];
  fromYear: number;
  selectedYear: number;
  onSelect: (year: number) => void;
};

/** Bảng 10 năm tới — cột tiêu chí tự sinh từ `CRITERIA`. Bấm một dòng để xem chi tiết năm đó. */
export default function TenYearTable({ birthYear, gender, criteria, fromYear, selectedYear, onSelect }: Props) {
  const rows = Array.from({ length: 10 }, (_, i) => analyzeBuild(birthYear, fromYear + i, gender, criteria));
  // Dòng tiêu đề nhóm phía trên các cột tiêu chí đang bật.
  const groups = CRITERIA_GROUPS.map((g) => ({
    key: g.key,
    label: g.label,
    count: g.criteria.filter((c) => criteria.includes(c)).length,
  })).filter((g) => g.count > 0);
  return (
    <section>
      <h2 className="font-serif text-xl font-bold text-[#321716]">{UI.XT_TABLE_TITLE}</h2>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-[#e7ddd2] bg-white">
        <table className="w-full text-sm" style={{ minWidth: 260 + criteria.length * 90 }}>
          <thead className="bg-[#f6efe4] text-left text-xs uppercase tracking-wide text-[#7a5a3a]">
            <tr className="border-b border-[#e7ddd2] text-[11px] normal-case tracking-normal">
              <th colSpan={2} />
              {groups.map((g) => (
                <th key={g.key} colSpan={g.count} className="border-l border-[#e7ddd2] px-3 pt-2 font-semibold text-[#944a00]">
                  {g.label}
                </th>
              ))}
              <th />
            </tr>
            <tr>
              <th className="px-3 py-2.5 font-semibold">{UI.XT_TABLE_YEAR}</th>
              <th className="px-3 py-2.5 font-semibold">{UI.XT_TABLE_AGE}</th>
              {criteria.map((c) => (
                <th key={c.key} className="px-3 py-2.5 font-semibold">
                  {c.label}
                </th>
              ))}
              <th className="px-3 py-2.5 font-semibold">{UI.XT_TABLE_SCORE}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.buildYear}
                onClick={() => onSelect(r.buildYear)}
                className={`cursor-pointer border-t border-[#efe6da] transition hover:bg-[#fff8ea] ${
                  r.buildYear === selectedYear ? "bg-[#fff3d9]" : ""
                }`}
              >
                <td className="px-3 py-2.5 font-semibold text-[#321716]">
                  {r.buildYear} <span className="font-normal text-[#827472]">{r.yearCanChi}</span>
                </td>
                <td className="px-3 py-2.5">{r.age}</td>
                {r.outcomes.map(({ criterion, result }) => (
                  <td key={criterion.key} className="px-3 py-2.5" title={result.summary}>
                    <span className={MARK[result.status].className}>{MARK[result.status].text}</span>
                    {result.shortLabel ? (
                      <span className="ml-1 text-xs text-[#827472]">{result.shortLabel}</span>
                    ) : null}
                  </td>
                ))}
                <td className="px-3 py-2.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${VERDICT_CLASS[r.verdict]}`}>
                    {r.score.toLocaleString("vi-VN")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
