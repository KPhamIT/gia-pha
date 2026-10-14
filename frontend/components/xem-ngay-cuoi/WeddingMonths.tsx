import { MONTH_KINDS, monthsOf, type MonthKind } from "@/lib/xem-ngay-cuoi/tables";
import { CHI } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";

const TONE: Record<MonthKind, string> = {
  "dai-loi": "bg-emerald-600 text-white",
  "tieu-loi": "bg-emerald-50 text-emerald-900",
  "ong-co": "bg-amber-50 text-amber-900",
  "phu-mau": "bg-amber-50 text-amber-900",
  "phu-chu": "bg-red-50 text-red-800",
  "nu-than": "bg-red-50 text-red-800",
};

/** 6 loại tháng âm theo tuổi cô dâu, từ đại lợi đến phòng nữ thân. */
export default function WeddingMonths({
  brideChi,
  inLawsAlive,
}: {
  brideChi: number;
  inLawsAlive: boolean;
}) {
  return (
    <section className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-6">
      <h2 className="font-serif text-lg font-bold text-[#321716]">
        {UI.XC_MONTHS_TITLE(CHI[brideChi])}
      </h2>
      <ul className="mt-3 space-y-2">
        {MONTH_KINDS.map((kind) => {
          const [a, b] = monthsOf(brideChi, kind);
          const usable = kind === "ong-co" && !inLawsAlive;
          return (
            <li
              key={kind}
              className={`flex items-start justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm ${
                usable ? TONE["tieu-loi"] : TONE[kind]
              }`}
            >
              <span>
                <span className="font-semibold">
                  {UI.XC_MONTH_KIND[kind].name}
                </span>
                <span className="block text-xs opacity-80">
                  {UI.XC_MONTH_KIND[kind].meaning}
                </span>
              </span>
              <span className="shrink-0 font-semibold">
                {UI.XC_MONTH_LIST(a, b)}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-[#827472]">
        {UI.XC_MONTHS_NOTE}
      </p>
    </section>
  );
}
