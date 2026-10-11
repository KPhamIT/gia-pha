import { SCORE_SCALE, type BuildAnalysis, type Verdict } from "@/lib/xem-tuoi/lam-nha";
import { UI } from "@/lib/constants/ui-strings";

const TONE: Record<Verdict, { box: string; ring: string }> = {
  dat: { box: "bg-[#1f4d3a]", ring: "border-emerald-300 text-emerald-100" },
  "chua-dat": { box: "bg-[#6b1d14]", ring: "border-red-300 text-red-100" },
};

/** Kết luận: tổng điểm thang 10, đạt / chưa đạt, các tiêu chí bị phạm. */
export default function VerdictBanner({ analysis, applied }: { analysis: BuildAnalysis; applied: string }) {
  const tone = TONE[analysis.verdict];
  const failed = analysis.failed.map((c) => c.label).join(", ");
  return (
    <section aria-live="polite" className={`flex flex-col gap-5 rounded-2xl px-5 py-6 text-white sm:flex-row sm:items-center md:px-8 ${tone.box}`}>
      <div
        className={`grid h-24 w-24 shrink-0 place-items-center rounded-full border-4 text-center ${tone.ring}`}
        aria-label={UI.XT_SCORE(analysis.score, SCORE_SCALE)}
      >
        <span>
          <span className="block font-serif text-3xl font-bold leading-none text-white">
            {analysis.score.toLocaleString("vi-VN")}
          </span>
          <span className="text-xs">/ {SCORE_SCALE}</span>
        </span>
      </div>
      <div>
        <p className="text-sm text-white/75">
          {analysis.birthYear} ({analysis.birthCanChi}) · {analysis.buildYear} ({analysis.yearCanChi}) ·{" "}
          {UI.XT_AGE(analysis.age)} · {applied}
        </p>
        <p className="mt-1 font-serif text-2xl font-bold md:text-3xl">{UI.XT_VERDICT[analysis.verdict]}</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85">{UI.XT_VERDICT_BODY[analysis.verdict]}</p>
        <p className="mt-2 text-sm font-medium text-white/90">
          {failed ? UI.XT_FAILED(failed) : UI.XT_NONE_FAILED}
        </p>
      </div>
    </section>
  );
}
