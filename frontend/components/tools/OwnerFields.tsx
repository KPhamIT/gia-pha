import type { OwnerProfile } from "@/lib/tools/owner-profile";
import type { Gender } from "@/lib/xem-tuoi/criteria";
import { canChi } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";

const THIS_YEAR = new Date().getFullYear();
export const BIRTH_YEARS = Array.from(
  { length: 81 },
  (_, i) => THIS_YEAR - 15 - i,
);

export const toolSelectClass =
  "mt-1.5 w-full rounded-xl border border-[#d4c3c1] bg-white px-3 py-2.5 text-[#321716] focus:border-[#c99236] focus:outline-none focus:ring-2 focus:ring-[#c99236]/30";

type Props = {
  owner: OwnerProfile;
  onChange: (patch: Partial<OwnerProfile>) => void;
  genderHint?: string;
};

/** Ô năm sinh âm lịch + giới tính gia chủ — đặt trong grid của từng công cụ. */
export default function OwnerFields({
  owner,
  onChange,
  genderHint = UI.XT_GENDER_HINT,
}: Props) {
  return (
    <>
      <label className="block text-sm">
        <span className="font-semibold text-[#321716]">{UI.XT_BIRTH_YEAR}</span>
        <select
          className={toolSelectClass}
          value={owner.birthYear}
          onChange={(e) => onChange({ birthYear: Number(e.target.value) })}
        >
          {BIRTH_YEARS.map((y) => (
            <option key={y} value={y}>
              {y} — {canChi(y)}
            </option>
          ))}
        </select>
        <span className="mt-1.5 block text-xs text-[#827472]">
          {UI.XT_BIRTH_HINT}
        </span>
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-[#321716]">{UI.XT_GENDER}</span>
        <select
          className={toolSelectClass}
          value={owner.gender}
          onChange={(e) => onChange({ gender: e.target.value as Gender })}
        >
          <option value="male">{UI.XT_GENDER_OPTIONS.male}</option>
          <option value="female">{UI.XT_GENDER_OPTIONS.female}</option>
        </select>
        <span className="mt-1.5 block text-xs text-[#827472]">
          {genderHint}
        </span>
      </label>
    </>
  );
}
