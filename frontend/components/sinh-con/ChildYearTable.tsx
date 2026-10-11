import { analyzeChild, type ChildVerdict } from "@/lib/sinh-con/analyze";
import { canChi, napAm } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";

const BADGE: Record<ChildVerdict, string> = {
  "rat-hop": "bg-emerald-600 text-white",
  hop: "bg-amber-100 text-amber-900",
  "chua-hop": "bg-red-100 text-red-800",
};

type Props = {
  fatherYear: number;
  motherYear: number;
  years: number[];
  selectedYear: number;
  onSelect: (year: number) => void;
};

/** Bảng chấm điểm các năm sinh con; năm điểm cao nhất có dấu ★. */
export default function ChildYearTable({
  fatherYear,
  motherYear,
  years,
  selectedYear,
  onSelect,
}: Props) {
  const rows = years.map((y) => analyzeChild(fatherYear, motherYear, y));
  const best = Math.max(...rows.map((r) => r.score));
  return (
    <section>
      <h2 className="font-serif text-2xl font-bold text-[#321716]">
        {UI.SC_TABLE_TITLE}
      </h2>
      <p className="mt-1 text-sm text-[#827472]">{UI.SC_TABLE_HINT}</p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e7ddd2] bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-[#fcf6ea] text-xs uppercase tracking-wide text-[#827472]">
            <tr>
              <th className="px-4 py-3">{UI.SC_TABLE_COL.year}</th>
              <th className="px-4 py-3">{UI.SC_TABLE_COL.menh}</th>
              <th className="px-4 py-3 text-center">
                {UI.SC_TABLE_COL.father}
              </th>
              <th className="px-4 py-3 text-center">
                {UI.SC_TABLE_COL.mother}
              </th>
              <th className="px-4 py-3 text-center">{UI.SC_TABLE_COL.score}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#efe6da]">
            {rows.map((row) => {
              const [father, mother] = row.parents;
              const selected = row.childYear === selectedYear;
              return (
                <tr
                  key={row.childYear}
                  onClick={() => onSelect(row.childYear)}
                  className={`cursor-pointer transition hover:bg-[#fcf6ea] ${selected ? "bg-[#fcf6ea] ring-2 ring-inset ring-[#c99236]" : ""}`}
                >
                  <td className="px-4 py-3 font-semibold text-[#321716]">
                    {row.score === best ? (
                      <span className="mr-1 text-[#c99236]">★</span>
                    ) : null}
                    {row.childYear}{" "}
                    <span className="font-normal text-[#827472]">
                      {canChi(row.childYear)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#504443]">
                    {napAm(row.childYear).name}
                  </td>
                  <td className="px-4 py-3 text-center text-[#504443]">
                    {father.score.toLocaleString("vi-VN")}/{father.max}
                  </td>
                  <td className="px-4 py-3 text-center text-[#504443]">
                    {mother.score.toLocaleString("vi-VN")}/{mother.max}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${BADGE[row.verdict]}`}
                    >
                      {row.score.toLocaleString("vi-VN")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
