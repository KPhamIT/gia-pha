import {
  SCORE_SCALE,
  type NameAnalysis,
  type NameVerdict as Verdict,
} from "@/lib/dat-ten/analyze";
import { canChi } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";

const TONE: Record<Verdict | "empty", { box: string; ring: string }> = {
  "rat-dep": { box: "bg-[#1f4d3a]", ring: "border-emerald-300" },
  dep: { box: "bg-[#5a4318]", ring: "border-amber-300" },
  "can-nhac": { box: "bg-[#6b1d14]", ring: "border-red-300" },
  empty: { box: "bg-[#4a2c2a]", ring: "border-white/40" },
};

/** Kết luận: họ tên, điểm thang 10, mệnh của bé. */
export default function NameVerdict({ analysis }: { analysis: NameAnalysis }) {
  const { ctx, score, verdict } = analysis;
  const tone = TONE[verdict ?? "empty"];
  const applied = analysis.outcomes.filter((o) => o.result).length;
  return (
    <section
      aria-live="polite"
      className={`flex flex-col gap-5 rounded-2xl px-5 py-6 text-white sm:flex-row sm:items-center md:px-8 ${tone.box}`}
    >
      <div
        className={`grid h-24 w-24 shrink-0 place-items-center rounded-full border-4 text-center ${tone.ring}`}
        aria-label={UI.DT_SCORE}
      >
        <span>
          <span className="block font-serif text-3xl font-bold leading-none">
            {score === null ? "–" : score.toLocaleString("vi-VN")}
          </span>
          <span className="text-xs text-white/80">/ {SCORE_SCALE}</span>
        </span>
      </div>
      <div>
        <p className="font-serif text-2xl font-bold uppercase tracking-wide md:text-3xl">
          {ctx.fullName || "—"}
        </p>
        <p className="mt-1 text-sm text-white/75">
          {UI.DT_CHILD_INFO(
            String(ctx.lunarYear),
            canChi(ctx.lunarYear),
            ctx.menh.name,
          )}{" "}
          · {UI.DT_APPLIED(applied, analysis.outcomes.length)}
        </p>
        <p className="mt-2 text-lg font-semibold">
          {verdict ? UI.DT_VERDICT[verdict] : UI.DT_VERDICT_EMPTY}
        </p>
        {verdict ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/85">
            {UI.DT_VERDICT_BODY[verdict]}
          </p>
        ) : null}
      </div>
    </section>
  );
}
