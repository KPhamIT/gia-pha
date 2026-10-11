import type { Criterion } from "@/lib/xem-tuoi/criteria";
import { goodBirthYears } from "@/lib/xem-tuoi/lam-nha";
import { canChi } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";

/** Các tuổi đẹp làm nhà trong năm đang chọn — gợi ý mượn tuổi. */
export default function BorrowAgeList({
  buildYear,
  ownerBirthYear,
  criteria,
}: {
  buildYear: number;
  ownerBirthYear: number;
  criteria: readonly Criterion[];
}) {
  const list = goodBirthYears(buildYear, ownerBirthYear, criteria);
  return (
    <section className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-6">
      <h2 className="font-serif text-xl font-bold text-[#321716]">
        {UI.XT_BORROW_TITLE(buildYear, canChi(buildYear))}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-[#504443]">{UI.XT_BORROW_BODY}</p>
      {list.length === 0 ? (
        <p className="mt-4 text-sm text-[#827472]">{UI.XT_BORROW_NONE}</p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {list.map((a) => (
            <li
              key={a.birthYear}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-900"
            >
              <span className="font-semibold">{a.birthYear}</span> {a.birthCanChi}
              <span className="text-emerald-700"> · {UI.XT_AGE(a.age).toLowerCase()}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
