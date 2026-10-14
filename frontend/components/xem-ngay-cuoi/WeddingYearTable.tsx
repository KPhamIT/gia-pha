import type { WeddingYear } from "@/lib/xem-ngay-cuoi/evaluate";
import { canChi } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";

const BADGE = {
  ok: "bg-emerald-100 text-emerald-800",
  bad: "bg-red-100 text-red-800",
  muted: "bg-[#f3ede4] text-[#827472]",
};

/** Bảng các năm âm lịch tới: cô dâu có phạm Kim Lâu không (chính), chú rể và Tam Tai (tham khảo). */
export default function WeddingYearTable({
  years,
  onView,
}: {
  years: WeddingYear[];
  onView: (year: number) => void;
}) {
  return (
    <section className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-6">
      <h2 className="font-serif text-lg font-bold text-[#321716]">
        {UI.XC_YEARS_TITLE}
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="text-xs text-[#827472]">
            <tr>
              <th className="py-2 pr-2 font-semibold">
                {UI.XC_YEARS_HEAD.year}
              </th>
              <th className="py-2 pr-2 font-semibold">
                {UI.XC_YEARS_HEAD.bride}
              </th>
              <th className="py-2 pr-2 font-semibold">
                {UI.XC_YEARS_HEAD.groom}
              </th>
              <th className="py-2 font-semibold">{UI.XC_YEARS_HEAD.tamTai}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#efe6da]">
            {years.map((y) => {
              const ok = y.brideKimLau === "khong";
              return (
                <tr key={y.year}>
                  <td className="py-2.5 pr-2">
                    <button
                      type="button"
                      onClick={() => onView(y.year)}
                      title={UI.XC_VIEW_YEAR}
                      className="text-left font-semibold text-[#944a00] hover:underline"
                    >
                      {y.year}
                      <span className="block text-xs font-normal text-[#827472]">
                        {canChi(y.year)}
                      </span>
                    </button>
                  </td>
                  <td className="py-2.5 pr-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ok ? BADGE.ok : BADGE.bad}`}
                    >
                      {ok ? UI.XC_YEAR_OK : UI.XC_YEAR_BAD}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#827472]">
                      {UI.XC_AGE(y.brideAge)}
                    </span>
                  </td>
                  <td className="py-2.5 pr-2 text-xs text-[#504443]">
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${BADGE.muted}`}
                    >
                      {y.groomKimLau === "khong"
                        ? UI.XC_NO
                        : UI.XC_YEAR_BAD}
                    </span>
                    <span className="mt-0.5 block text-[#827472]">
                      {UI.XC_AGE(y.groomAge)}
                    </span>
                  </td>
                  <td className="py-2.5 text-xs">
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${BADGE.muted}`}
                    >
                      {y.brideTamTai ? UI.XC_YES : UI.XC_NO}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[#827472]">
        {UI.XC_YEARS_NOTE}
      </p>
    </section>
  );
}
