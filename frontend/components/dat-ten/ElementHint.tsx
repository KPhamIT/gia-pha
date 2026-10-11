import { ELEMENTS, nameElement } from "@/lib/dat-ten/names";
import type { Element } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  word: string;
  manual: Element | null;
  onManual: (element: Element | null) => void;
};

/** Dưới ô tên: báo hành tra được, hoặc cho chọn hành khi tên chưa có trong từ điển. */
export default function ElementHint({ word, manual, onManual }: Props) {
  const last = word.trim().split(/\s+/).pop() ?? "";
  if (!last) return null;
  const found = nameElement(last);
  if (found) {
    return (
      <span className="mt-1.5 block text-xs font-medium text-emerald-800">
        {UI.DT_ELEMENT_FOUND(last, found)}
      </span>
    );
  }
  return (
    <span className="mt-1.5 block text-xs text-[#827472]">
      {UI.DT_ELEMENT_PICK(last)}
      <span className="mt-1 flex flex-wrap gap-1">
        {[null, ...ELEMENTS].map((el) => (
          <button
            key={el ?? "none"}
            type="button"
            aria-pressed={manual === el}
            onClick={() => onManual(el)}
            className={`rounded-full border px-2 py-0.5 ${
              manual === el
                ? "border-[#944a00] bg-[#944a00] text-white"
                : "border-[#d4c3c1] bg-white hover:border-[#944a00]"
            }`}
          >
            {el ?? UI.DT_ELEMENT_NONE}
          </button>
        ))}
      </span>
    </span>
  );
}
