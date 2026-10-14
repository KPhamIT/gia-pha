import type { ColorAnalysis } from "@/lib/mau-son/analyze";
import type { Element } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import Swatches from "./Swatches";

function ElementList({
  label,
  elements,
  tone,
}: {
  label: string;
  elements: Element[];
  tone: string;
}) {
  return (
    <div>
      <p className={`text-xs font-semibold ${tone}`}>{label}</p>
      {elements.length ? (
        <ul className="mt-1.5 space-y-1.5">
          {elements.map((e) => (
            <li key={e} className="flex items-center gap-2 text-sm">
              <span className="w-10 shrink-0 font-semibold text-[#321716]">
                {e}
              </span>
              <Swatches element={e} compact />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-[#827472]">{UI.MS_NONE}</p>
      )}
    </div>
  );
}

/** Gợi ý màu sơn / gạch cho phòng khách, phòng ngủ, bếp, nhà vệ sinh, mặt tiền. */
export default function AreaCards({ analysis }: { analysis: ColorAnalysis }) {
  return (
    <section>
      <h2 className="font-serif text-2xl font-bold text-[#321716]">
        {UI.MS_AREAS_TITLE}
      </h2>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {analysis.areas.map((area) => (
          <li
            key={area.key}
            className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm"
          >
            <h3 className="font-semibold text-[#321716]">
              {UI.MS_AREA[area.key].title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#504443]">
              {UI.MS_AREA[area.key].tip}
            </p>
            {area.key === "mat-tien" ? (
              <p className="mt-2 text-sm text-[#944a00]">
                {analysis.facing && area.areaElement
                  ? UI.MS_FACADE_ELEMENT(
                      UI.PT_DIR[analysis.facing],
                      area.areaElement,
                    )
                  : UI.MS_FACADE_NO_FACING}
                {analysis.hotFacing ? ` ${UI.MS_HOT}` : ""}
              </p>
            ) : null}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <ElementList
                label={UI.MS_USE}
                elements={area.use}
                tone="text-emerald-800"
              />
              <ElementList
                label={UI.MS_AVOID}
                elements={area.avoid}
                tone="text-red-800"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
