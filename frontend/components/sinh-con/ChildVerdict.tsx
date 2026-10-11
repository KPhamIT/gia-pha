import {
  SCORE_SCALE,
  type ChildAnalysis,
  type ChildVerdict as Verdict,
} from "@/lib/sinh-con/analyze";
import { canChi, napAm } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";

const TONE: Record<Verdict, { box: string; ring: string }> = {
  "rat-hop": { box: "bg-[#1f4d3a]", ring: "border-emerald-300" },
  hop: { box: "bg-[#5a4318]", ring: "border-amber-300" },
  "chua-hop": { box: "bg-[#6b1d14]", ring: "border-red-300" },
};

/** Kết luận: điểm thang 10, mức hợp, tuổi và mệnh của con. */
export default function ChildVerdict({
  analysis,
}: {
  analysis: ChildAnalysis;
}) {
  const tone = TONE[analysis.verdict];
  return (
    <section
      aria-live="polite"
      className={`flex flex-col gap-5 rounded-2xl px-5 py-6 text-white sm:flex-row sm:items-center md:px-8 ${tone.box}`}
    >
      <div
        className={`grid h-24 w-24 shrink-0 place-items-center rounded-full border-4 text-center ${tone.ring}`}
        aria-label={`${UI.SC_SCORE}: ${analysis.score}/${SCORE_SCALE}`}
      >
        <span>
          <span className="block font-serif text-3xl font-bold leading-none">
            {analysis.score.toLocaleString("vi-VN")}
          </span>
          <span className="text-xs text-white/80">/ {SCORE_SCALE}</span>
        </span>
      </div>
      <div>
        <p className="text-sm text-white/75">
          {analysis.childYear} ·{" "}
          {UI.SC_CHILD_INFO(
            canChi(analysis.childYear),
            napAm(analysis.childYear).name,
          )}
        </p>
        <p className="mt-1 font-serif text-2xl font-bold md:text-3xl">
          {UI.SC_VERDICT[analysis.verdict]}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85">
          {UI.SC_VERDICT_BODY[analysis.verdict]}
        </p>
      </div>
    </section>
  );
}
