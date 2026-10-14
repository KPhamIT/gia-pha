import { canChi } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import { BIRTH_YEARS, toolSelectClass } from "@/components/tools/OwnerFields";

function YearSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (year: number) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="font-semibold text-[#321716]">{label}</span>
      <select
        className={toolSelectClass}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {BIRTH_YEARS.map((y) => (
          <option key={y} value={y}>
            {y} — {canChi(y)}
          </option>
        ))}
      </select>
    </label>
  );
}

type Props = {
  brideYear: number;
  groomYear: number;
  inLawsAlive: boolean;
  onBrideYear: (year: number) => void;
  onGroomYear: (year: number) => void;
  onInLawsAlive: (alive: boolean) => void;
};

/** Năm sinh cô dâu, chú rể và tình trạng bố mẹ chồng. */
export default function CoupleFields({
  brideYear,
  groomYear,
  inLawsAlive,
  onBrideYear,
  onGroomYear,
  onInLawsAlive,
}: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm sm:grid-cols-3 md:p-6">
      <YearSelect
        label={UI.XC_BRIDE_YEAR}
        value={brideYear}
        onChange={onBrideYear}
      />
      <YearSelect
        label={UI.XC_GROOM_YEAR}
        value={groomYear}
        onChange={onGroomYear}
      />
      <div className="text-sm">
        <label className="mt-1 flex items-center gap-2 font-semibold text-[#321716]">
          <input
            type="checkbox"
            checked={inLawsAlive}
            onChange={(e) => onInLawsAlive(e.target.checked)}
            className="size-4 accent-[#944a00]"
          />
          {UI.XC_IN_LAWS}
        </label>
        <span className="mt-1.5 block text-xs leading-relaxed text-[#827472]">
          {UI.XC_IN_LAWS_HINT}
        </span>
      </div>
    </div>
  );
}
