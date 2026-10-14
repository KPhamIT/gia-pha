import { ELEMENT_SWATCHES } from "@/lib/mau-son/palette";
import type { Element } from "@/lib/xem-tuoi/can-chi";

/** Dãy ô màu mẫu của một hành. `compact`: chỉ ô màu, tên hiện khi rê chuột. */
export default function Swatches({
  element,
  compact = false,
}: {
  element: Element;
  compact?: boolean;
}) {
  return (
    <ul className={`flex flex-wrap ${compact ? "gap-1" : "gap-2"}`}>
      {ELEMENT_SWATCHES[element].map((s) => (
        <li
          key={s.hex}
          title={`${s.name} ${s.hex}`}
          className={compact ? "" : "w-[72px] text-center"}
        >
          <span
            className={`block rounded-lg border border-black/10 ${compact ? "size-5" : "h-12 w-full"}`}
            style={{ backgroundColor: s.hex }}
          />
          {compact ? null : (
            <span className="mt-1 block text-[11px] leading-tight text-[#504443]">
              {s.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
