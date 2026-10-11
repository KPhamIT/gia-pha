import type { KinshipResult } from "@/lib/kinship/kinship";
import { UI } from "@/lib/constants/ui-strings";

/** Kết quả: người đó là gì của bạn, gọi gì, xưng gì. */
export default function KinshipResultCard({ result }: { result: KinshipResult }) {
  if (!result.relation) {
    return (
      <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        {UI.KIN_NOT_FOUND}
      </p>
    );
  }

  return (
    <div
      className="mt-6 rounded-2xl bg-[#4a2c2a] px-5 py-6 text-center text-white md:px-8"
      aria-live="polite"
    >
      <p className="text-sm text-white/70">{UI.KIN_RESULT_IS}</p>
      <p className="mt-1 font-serif text-3xl font-bold text-[#f6d68e] md:text-4xl">
        {result.relation.charAt(0).toUpperCase() + result.relation.slice(1)}
      </p>
      <p className="text-sm text-white/70">{UI.KIN_RESULT_OF_YOU}</p>
      <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-white/10 px-3 py-3">
          <p className="text-white/65">{UI.KIN_RESULT_CALL}</p>
          <p className="mt-0.5 text-lg font-semibold">“{result.call}”</p>
        </div>
        <div className="rounded-xl bg-white/10 px-3 py-3">
          <p className="text-white/65">{UI.KIN_RESULT_SELF}</p>
          <p className="mt-0.5 text-lg font-semibold">“{result.back ?? "—"}”</p>
        </div>
      </div>
      {result.backRelation ? (
        <p className="mt-4 text-sm text-white/75">{UI.KIN_RESULT_THEY_CALL(result.backRelation)}</p>
      ) : null}
    </div>
  );
}
