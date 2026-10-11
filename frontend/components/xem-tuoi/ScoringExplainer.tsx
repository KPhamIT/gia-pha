import { CRITERIA_GROUPS } from "@/lib/xem-tuoi/criteria";
import { SCORE_SCALE, VERDICT_RULES } from "@/lib/xem-tuoi/lam-nha";
import { UI } from "@/lib/constants/ui-strings";

/** Giải thích thang điểm — sinh từ danh sách tiêu chí nên tự cập nhật khi thêm tiêu chí. */
export default function ScoringExplainer() {
  const pass = VERDICT_RULES[0].min;
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl font-bold text-[#321716]">{UI.XT_SCORING_TITLE}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#504443]">{UI.XT_SCORING_BODY(SCORE_SCALE, pass)}</p>
      <div className="mt-4 space-y-3">
        {CRITERIA_GROUPS.map((group) => (
          <div key={group.key}>
            <p className="text-sm font-semibold text-[#944a00]">{group.label}</p>
            <ul className="mt-1.5 flex flex-wrap gap-2">
              {group.criteria.map((c) => (
                <li key={c.key} className="rounded-full border border-[#e7ddd2] bg-white px-3 py-1.5 text-sm text-[#321716]">
                  {c.label} <span className="text-[#827472]">· {UI.XT_MAX_POINTS(c.maxScore)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
