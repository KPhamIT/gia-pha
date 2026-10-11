import type { ReactNode } from "react";
import type { Criterion, CriterionResult, CriterionStatus, CriterionVisual } from "@/lib/xem-tuoi/criteria";
import { HOANG_OC_CUNG } from "@/lib/xem-tuoi/criteria/hoang-oc";
import { UI } from "@/lib/constants/ui-strings";

const STATUS: Record<CriterionStatus, { badge: string; bar: string }> = {
  good: { badge: "bg-emerald-100 text-emerald-800", bar: "bg-emerald-500" },
  neutral: { badge: "bg-amber-100 text-amber-900", bar: "bg-amber-500" },
  bad: { badge: "bg-red-100 text-red-800", bar: "bg-red-600" },
};

const IMPACT_TONE: Record<CriterionStatus, string> = {
  good: "border-emerald-500 bg-emerald-50 text-emerald-900",
  neutral: "border-amber-500 bg-amber-50 text-amber-900",
  bad: "border-red-600 bg-red-50 text-red-900",
};

/** Vòng 6 cung Hoang Ốc, tô cung của tuổi hiện tại. */
function HoangOcRing({ activeIndex }: { activeIndex: number }) {
  return (
    <ol className="grid max-w-md grid-cols-3 gap-1.5">
      {HOANG_OC_CUNG.map((cung, i) => {
        const active = i === activeIndex;
        const tone = cung.good
          ? active
            ? "bg-emerald-600 font-semibold text-white"
            : "bg-emerald-50 text-emerald-900"
          : active
            ? "bg-red-700 font-semibold text-white"
            : "bg-red-50 text-red-900";
        return (
          <li key={cung.label} className={`rounded-lg px-2 py-1.5 text-center text-xs ${tone}`}>
            {cung.label}
          </li>
        );
      })}
    </ol>
  );
}

/** Hình minh hoạ theo `kind` — tiêu chí không có hình thì bỏ qua. */
const VISUALS: { [K in CriterionVisual["kind"]]: (v: Extract<CriterionVisual, { kind: K }>) => ReactNode } = {
  "hoang-oc-ring": (v) => <HoangOcRing activeIndex={v.activeIndex} />,
};

type Props = {
  index: number;
  criterion: Criterion;
  /** null khi tiêu chí đang bị bỏ. */
  result: CriterionResult | null;
  canRemove: boolean;
  onToggle: () => void;
};

/** Một tiêu chí = một section có tiêu đề; nút ở tiêu đề để bỏ / tính lại tiêu chí. */
export default function CriterionSection({ index, criterion, result, canRemove, onToggle }: Props) {
  const titleId = `tieu-chi-${criterion.key}-title`;
  const number = <span className="mr-2 text-[#b8893b]">{index + 1}.</span>;

  if (!result) {
    return (
      <section
        aria-labelledby={titleId}
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-[#d4c3c1] bg-[#f7f3ed] px-5 py-3 md:px-6"
      >
        <h3 id={titleId} className="font-serif text-base font-semibold text-[#9a8b88] line-through decoration-[#c9bab6]">
          {number}
          {criterion.label}
        </h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#9a8b88]">{UI.XT_REMOVED}</span>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-full border border-[#944a00] px-3 py-1 font-semibold text-[#944a00] transition hover:bg-[#944a00] hover:text-white"
          >
            + {UI.XT_RESTORE}
          </button>
        </div>
      </section>
    );
  }

  const tone = STATUS[result.status];
  return (
    <section aria-labelledby={titleId} className="overflow-hidden rounded-2xl border border-[#e7ddd2] bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efe6da] bg-[#fcf6ea] px-5 py-3.5 md:px-6">
        <h3 id={titleId} className="font-serif text-lg font-bold text-[#321716] md:text-xl">
          {number}
          {criterion.label}
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold text-[#504443]">{UI.XT_POINTS(result.score, criterion.maxScore)}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone.badge}`}>
            {UI.XT_STATUS[result.status]}
          </span>
          <button
            type="button"
            onClick={onToggle}
            disabled={!canRemove}
            title={canRemove ? UI.XT_REMOVE_TITLE(criterion.label) : UI.XT_REMOVE_LAST}
            className="inline-flex items-center gap-1 rounded-full border border-[#d4c3c1] bg-white px-2.5 py-1 text-xs font-medium text-[#827472] transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden>✕</span>
            {UI.XT_REMOVE}
          </button>
        </div>
      </header>
      <div className="h-1 bg-[#f0ebe3]" aria-hidden>
        <div className={`h-full ${tone.bar}`} style={{ width: `${(result.score / criterion.maxScore) * 100}%` }} />
      </div>
      <div className="space-y-3 px-5 py-4 text-sm leading-relaxed text-[#504443] md:px-6">
        <p className="text-base font-medium text-[#321716]">{result.summary}</p>
        {result.impact ? (
          <div className={`rounded-xl border-l-4 px-4 py-3 ${IMPACT_TONE[result.status]}`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{UI.XT_IMPACT_LABEL}</p>
            <p className="mt-0.5 text-[#321716]">{result.impact}</p>
            {result.advice ? (
              <p className="mt-2 text-[#504443]">
                <span className="font-semibold">{UI.XT_ADVICE_LABEL}: </span>
                {result.advice}
              </p>
            ) : null}
          </div>
        ) : null}
        {result.visual ? VISUALS[result.visual.kind](result.visual) : null}
        {result.details.map((line) => (
          <p key={line}>{line}</p>
        ))}
        {criterion.note ? <p className="text-xs text-[#827472]">{criterion.note}</p> : null}
      </div>
    </section>
  );
}
