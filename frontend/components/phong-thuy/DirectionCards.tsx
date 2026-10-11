import { STARS, isGoodStar, type CungPhi } from "@/lib/phong-thuy/bat-trach";
import { UI } from "@/lib/constants/ui-strings";

const COLUMNS = [
  {
    title: UI.PT_GOOD_DIRS,
    stars: STARS.filter(isGoodStar),
    tone: "border-emerald-200 bg-emerald-50/60",
    badge: "bg-emerald-600 text-white",
  },
  {
    title: UI.PT_BAD_DIRS,
    stars: STARS.filter((s) => !isGoodStar(s)),
    tone: "border-red-200 bg-red-50/60",
    badge: "bg-red-700 text-white",
  },
];

/** Hai cột: 4 hướng tốt và 4 hướng xấu, mỗi hướng kèm ý nghĩa và cách dùng. */
export default function DirectionCards({ cung }: { cung: CungPhi }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {COLUMNS.map((col) => (
        <section
          key={col.title}
          className={`rounded-2xl border p-5 ${col.tone}`}
        >
          <h3 className="font-serif text-lg font-bold text-[#321716]">
            {col.title}
          </h3>
          <ul className="mt-3 space-y-3">
            {col.stars.map((star) => {
              const info = UI.PT_STAR[star];
              return (
                <li key={star} className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-sm font-bold ${col.badge}`}
                    >
                      {UI.PT_DIR[cung.starDir[star]]}
                    </span>
                    <span className="font-semibold text-[#321716]">
                      {info.name}
                    </span>
                    <span className="text-xs text-[#827472]">· {info.tag}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#504443]">
                    {info.meaning}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#827472]">
                    {info.use}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
