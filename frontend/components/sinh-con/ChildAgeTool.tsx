"use client";

import { useMemo, useState } from "react";
import { analyzeChild } from "@/lib/sinh-con/analyze";
import { PAIR_CRITERIA } from "@/lib/sinh-con/criteria";
import { canChi } from "@/lib/xem-tuoi/can-chi";
import { UI } from "@/lib/constants/ui-strings";
import { BIRTH_YEARS, toolSelectClass } from "@/components/tools/OwnerFields";
import ChildVerdict from "./ChildVerdict";
import ChildYearTable from "./ChildYearTable";
import ParentPairCard from "./ParentPairCard";

const THIS_YEAR = new Date().getFullYear();
const CHILD_YEARS = Array.from({ length: 12 }, (_, i) => THIS_YEAR + i);
const PAIR_MAX = PAIR_CRITERIA.reduce((s, c) => s + c.maxScore, 0);

function YearSelect({
  label,
  value,
  years,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  years: number[];
  onChange: (year: number) => void;
  hint?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-semibold text-[#321716]">{label}</span>
      <select
        className={toolSelectClass}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y} — {canChi(y)}
          </option>
        ))}
      </select>
      {hint ? (
        <span className="mt-1.5 block text-xs text-[#827472]">{hint}</span>
      ) : null}
    </label>
  );
}

/** Xem tuổi sinh con: chấm năm sinh con với tuổi bố và mẹ + bảng các năm tới. */
export default function ChildAgeTool() {
  const [fatherYear, setFatherYear] = useState(1990);
  const [motherYear, setMotherYear] = useState(1992);
  const [childYear, setChildYear] = useState(THIS_YEAR);
  const analysis = useMemo(
    () => analyzeChild(fatherYear, motherYear, childYear),
    [fatherYear, motherYear, childYear],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm sm:grid-cols-3 md:p-6">
        <YearSelect
          label={UI.SC_FATHER_YEAR}
          value={fatherYear}
          years={BIRTH_YEARS}
          onChange={setFatherYear}
        />
        <YearSelect
          label={UI.SC_MOTHER_YEAR}
          value={motherYear}
          years={BIRTH_YEARS}
          onChange={setMotherYear}
        />
        <YearSelect
          label={UI.SC_CHILD_YEAR}
          value={childYear}
          years={CHILD_YEARS}
          onChange={setChildYear}
          hint={UI.SC_CHILD_HINT}
        />
      </div>

      <ChildVerdict analysis={analysis} />
      <div className="grid gap-5 md:grid-cols-2">
        {analysis.parents.map((parent) => (
          <ParentPairCard key={parent.role} parent={parent} />
        ))}
      </div>
      <p className="text-xs leading-relaxed text-[#827472]">
        {UI.SC_SCORING_NOTE(PAIR_MAX)}
      </p>

      <ChildYearTable
        fatherYear={fatherYear}
        motherYear={motherYear}
        years={CHILD_YEARS}
        selectedYear={childYear}
        onSelect={setChildYear}
      />
    </div>
  );
}
