import type { ColorRank } from "@/lib/mau-son/palette";
import type { Element } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import Swatches from "./Swatches";

const TONE: Record<ColorRank, string> = {
  "tuong-sinh": "border-emerald-300 bg-emerald-50",
  "hoa-hop": "border-emerald-200 bg-white",
  "che-khac": "border-amber-200 bg-white",
  "sinh-xuat": "border-amber-200 bg-amber-50/40",
  ky: "border-red-200 bg-red-50",
};
const BADGE: Record<ColorRank, string> = {
  "tuong-sinh": "bg-emerald-600 text-white",
  "hoa-hop": "bg-emerald-100 text-emerald-800",
  "che-khac": "bg-amber-100 text-amber-900",
  "sinh-xuat": "bg-amber-100 text-amber-900",
  ky: "bg-red-700 text-white",
};

/** 5 nhóm màu xếp từ hợp nhất đến nên tránh, mỗi nhóm kèm bảng màu mẫu. */
export default function ColorRanks({
  ranked,
}: {
  ranked: { element: Element; rank: ColorRank }[];
}) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {ranked.map(({ element, rank }, i) => (
        <li
          key={element}
          className={`rounded-2xl border p-5 ${TONE[rank]} ${i === 0 ? "md:col-span-2" : ""}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-serif text-lg font-bold text-[#321716]">
              {UI.MS_RANK[rank].title}
            </h3>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-semibold ${BADGE[rank]}`}
            >
              {UI.MS_ELEMENT_COLORS(element)}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-[#504443]">
            {UI.MS_RANK[rank].body}
          </p>
          <div className="mt-3">
            <Swatches element={element} />
          </div>
        </li>
      ))}
    </ul>
  );
}
