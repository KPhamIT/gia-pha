import type { CriterionGroup, CriterionResult } from "@/lib/xem-tuoi/criteria";
import { UI } from "@/lib/constants/ui-strings";
import CriterionSection from "./CriterionSection";

type Props = {
  groupIndex: number;
  /** Số thứ tự của tiêu chí đầu tiên trong nhóm (đánh số liền mạch giữa các nhóm). */
  startIndex: number;
  group: CriterionGroup;
  results: ReadonlyMap<string, CriterionResult>;
  enabled: ReadonlySet<string>;
  onToggle: (key: string) => void;
  onToggleGroup: (keys: string[]) => void;
};

/** Một nhóm tiêu chí: tiêu đề nhóm, điểm nhóm, bỏ / tính lại cả nhóm, các section bên trong. */
export default function CriterionGroupBlock({
  groupIndex,
  startIndex,
  group,
  results,
  enabled,
  onToggle,
  onToggleGroup,
}: Props) {
  const keys = group.criteria.map((c) => c.key);
  const active = group.criteria.filter((c) => enabled.has(c.key));
  const groupOn = active.length > 0;
  // Không cho bỏ cả nhóm nếu đó là những tiêu chí cuối cùng còn bật.
  const canRemoveGroup = groupOn && enabled.size > active.length;
  const earned = active.reduce((sum, c) => sum + (results.get(c.key)?.score ?? 0), 0);
  const max = active.reduce((sum, c) => sum + c.maxScore, 0);

  return (
    <section
      aria-labelledby={`nhom-${group.key}`}
      className={`rounded-3xl border p-4 md:p-5 ${groupOn ? "border-[#e2d3bd] bg-[#f8f1e5]" : "border-dashed border-[#d4c3c1] bg-[#f7f3ed]"}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 px-1 pb-4">
        <div className="min-w-0">
          <h2 id={`nhom-${group.key}`} className="font-serif text-xl font-bold text-[#321716] md:text-2xl">
            <span className="mr-2 text-[#944a00]">{UI.XT_GROUP_NUMERAL[groupIndex]}.</span>
            {group.label}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[#504443]">{group.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {groupOn ? (
            <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#321716] shadow-sm">
              {UI.XT_GROUP_SCORE(earned, max)}
            </span>
          ) : (
            <span className="text-[#9a8b88]">{UI.XT_GROUP_REMOVED}</span>
          )}
          <button
            type="button"
            onClick={() => onToggleGroup(keys)}
            disabled={groupOn && !canRemoveGroup}
            title={groupOn && !canRemoveGroup ? UI.XT_REMOVE_LAST : undefined}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
              groupOn
                ? "border-[#d4c3c1] bg-white text-[#827472] hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                : "border-[#944a00] text-[#944a00] hover:bg-[#944a00] hover:text-white"
            }`}
          >
            {groupOn ? `✕ ${UI.XT_GROUP_REMOVE}` : `+ ${UI.XT_GROUP_RESTORE}`}
          </button>
        </div>
      </header>
      <div className="space-y-3">
        {group.criteria.map((criterion, i) => (
          <CriterionSection
            key={criterion.key}
            index={startIndex + i}
            criterion={criterion}
            result={enabled.has(criterion.key) ? (results.get(criterion.key) ?? null) : null}
            canRemove={enabled.size > 1}
            onToggle={() => onToggle(criterion.key)}
          />
        ))}
      </div>
    </section>
  );
}
