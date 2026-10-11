import { CRITERIA, CRITERIA_GROUPS } from "@/lib/xem-tuoi/criteria";
import type { BuildAnalysis } from "@/lib/xem-tuoi/lam-nha";
import { UI } from "@/lib/constants/ui-strings";
import CriterionGroupBlock from "./CriterionGroupBlock";

type Props = {
  analysis: BuildAnalysis;
  enabled: ReadonlySet<string>;
  onToggle: (key: string) => void;
  onToggleGroup: (keys: string[]) => void;
  onRestoreAll: () => void;
};

/** Phân tích theo nhóm tiêu chí — tiêu chí đã bỏ thu gọn thành một dòng có nút "Tính lại". */
export default function AnalysisCards({ analysis, enabled, onToggle, onToggleGroup, onRestoreAll }: Props) {
  const results = new Map(analysis.outcomes.map((o) => [o.criterion.key, o.result]));
  const allOn = enabled.size === CRITERIA.length;
  const starts = CRITERIA_GROUPS.map((_, i) =>
    CRITERIA_GROUPS.slice(0, i).reduce((n, g) => n + g.criteria.length, 0),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#321716]">{UI.XT_DETAIL_TITLE}</h2>
          <p className="mt-1 text-sm text-[#504443]">{UI.XT_DETAIL_HINT(enabled.size, CRITERIA.length)}</p>
        </div>
        {allOn ? null : (
          <button type="button" onClick={onRestoreAll} className="text-sm font-semibold text-[#944a00] hover:underline">
            {UI.XT_RESTORE_ALL}
          </button>
        )}
      </div>
      {CRITERIA_GROUPS.map((group, i) => (
        <CriterionGroupBlock
          key={group.key}
          groupIndex={i}
          startIndex={starts[i]}
          group={group}
          results={results}
          enabled={enabled}
          onToggle={onToggle}
          onToggleGroup={onToggleGroup}
        />
      ))}
    </div>
  );
}
