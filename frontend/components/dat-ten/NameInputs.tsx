import type { ReactNode } from "react";
import type { Element } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import { toolSelectClass } from "@/components/tools/OwnerFields";
import ElementHint from "./ElementHint";

export type NameForm = {
  surname: string;
  middle: string;
  given: string;
  gender: "m" | "f";
  birthDate: string;
  middleElement: Element | null;
  givenElement: Element | null;
};

type Props = { form: NameForm; onChange: (patch: Partial<NameForm>) => void };

function TextField({
  label,
  value,
  placeholder,
  onChange,
  children,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  children?: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-semibold text-[#321716]">{label}</span>
      <input
        type="text"
        className={toolSelectClass}
        value={value}
        placeholder={placeholder}
        maxLength={40}
        onChange={(e) => onChange(e.target.value)}
      />
      {children}
    </label>
  );
}

/** Ô nhập họ, tên đệm, tên, giới tính, ngày sinh. */
export default function NameInputs({ form, onChange }: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm sm:grid-cols-3 md:p-6">
      <TextField
        label={UI.DT_SURNAME}
        value={form.surname}
        placeholder={UI.DT_SURNAME_PH}
        onChange={(surname) => onChange({ surname })}
      />
      <TextField
        label={UI.DT_MIDDLE}
        value={form.middle}
        placeholder={UI.DT_MIDDLE_PH}
        onChange={(middle) => onChange({ middle, middleElement: null })}
      >
        <ElementHint
          word={form.middle}
          manual={form.middleElement}
          onManual={(middleElement) => onChange({ middleElement })}
        />
      </TextField>
      <TextField
        label={UI.DT_GIVEN}
        value={form.given}
        placeholder={UI.DT_GIVEN_PH}
        onChange={(given) => onChange({ given, givenElement: null })}
      >
        <ElementHint
          word={form.given}
          manual={form.givenElement}
          onManual={(givenElement) => onChange({ givenElement })}
        />
      </TextField>
      <label className="block text-sm">
        <span className="font-semibold text-[#321716]">{UI.DT_GENDER}</span>
        <select
          className={toolSelectClass}
          value={form.gender}
          onChange={(e) => onChange({ gender: e.target.value as "m" | "f" })}
        >
          <option value="m">{UI.DT_GENDER_OPTIONS.m}</option>
          <option value="f">{UI.DT_GENDER_OPTIONS.f}</option>
        </select>
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="font-semibold text-[#321716]">{UI.DT_BIRTH}</span>
        <input
          type="date"
          className={toolSelectClass}
          value={form.birthDate}
          min="1950-01-01"
          max="2100-12-31"
          onChange={(e) =>
            e.target.value && onChange({ birthDate: e.target.value })
          }
        />
        <span className="mt-1.5 block text-xs text-[#827472]">
          {UI.DT_BIRTH_HINT}
        </span>
      </label>
    </div>
  );
}
