import { DIRECTIONS, type Direction } from "@/lib/phong-thuy/bat-trach";
import { UI } from "@/lib/constants/ui-strings";
import { toolSelectClass } from "@/components/tools/OwnerFields";

type Props = {
  label: string;
  hint: string;
  value: Direction | null;
  onChange: (dir: Direction | null) => void;
  /** Cho phép để trống (tab xem hướng). */
  optional?: boolean;
};

/** Ô chọn hướng nhà (8 hướng). */
export default function FacingSelect({
  label,
  hint,
  value,
  onChange,
  optional,
}: Props) {
  return (
    <label className="block text-sm">
      <span className="font-semibold text-[#321716]">{label}</span>
      <select
        className={toolSelectClass}
        value={value ?? ""}
        onChange={(e) => onChange((e.target.value || null) as Direction | null)}
      >
        {optional ? <option value="">{UI.XH_FACING_NONE}</option> : null}
        {DIRECTIONS.map((d) => (
          <option key={d} value={d}>
            {UI.PT_DIR[d]}
          </option>
        ))}
      </select>
      <span className="mt-1.5 block text-xs text-[#827472]">{hint}</span>
    </label>
  );
}
