"use client";

import { useMemo, useState } from "react";
import { CRITERIA } from "@/lib/xem-tuoi/criteria";
import { analyzeBuild } from "@/lib/xem-tuoi/lam-nha";
import { canChi } from "@/lib/xem-tuoi/can-chi";
import { useOwnerProfile } from "@/lib/tools/owner-profile";
import { UI } from "@/lib/constants/ui-strings";
import OwnerFields, { toolSelectClass } from "@/components/tools/OwnerFields";
import AnalysisCards from "./AnalysisCards";
import BorrowAgeList from "./BorrowAgeList";
import TenYearTable from "./TenYearTable";
import VerdictBanner from "./VerdictBanner";

const THIS_YEAR = new Date().getFullYear();
const BUILD_YEARS = Array.from({ length: 11 }, (_, i) => THIS_YEAR + i);

/** Xem tuổi làm nhà: chọn năm sinh + năm làm, ra phân tích đầy đủ. */
export default function BuildAgeTool() {
  const [owner, setOwner] = useOwnerProfile();
  const { birthYear, gender } = owner;
  const [buildYear, setBuildYear] = useState(THIS_YEAR);
  const [enabled, setEnabled] = useState<Set<string>>(
    () => new Set(CRITERIA.map((c) => c.key)),
  );
  const criteria = useMemo(
    () => CRITERIA.filter((c) => enabled.has(c.key)),
    [enabled],
  );
  const toggleCriterion = (key: string) =>
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  // Còn tiêu chí nào của nhóm đang bật thì bỏ cả nhóm, không thì bật lại cả nhóm.
  const toggleGroup = (keys: string[]) =>
    setEnabled((prev) => {
      const next = new Set(prev);
      if (keys.some((k) => next.has(k))) {
        keys.forEach((k) => next.delete(k));
        return next.size > 0 ? next : prev;
      }
      keys.forEach((k) => next.add(k));
      return next;
    });
  const analysis = useMemo(
    () => analyzeBuild(birthYear, buildYear, gender, criteria),
    [birthYear, buildYear, gender, criteria],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm sm:grid-cols-3 md:p-6">
        <OwnerFields owner={owner} onChange={setOwner} />
        <label className="block text-sm">
          <span className="font-semibold text-[#321716]">
            {UI.XT_BUILD_YEAR}
          </span>
          <select
            className={toolSelectClass}
            value={buildYear}
            onChange={(e) => setBuildYear(Number(e.target.value))}
          >
            {BUILD_YEARS.map((y) => (
              <option key={y} value={y}>
                {y} — {canChi(y)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <VerdictBanner
        analysis={analysis}
        applied={UI.XT_APPLIED(criteria.length, CRITERIA.length)}
      />
      <AnalysisCards
        analysis={analysis}
        enabled={enabled}
        onToggle={toggleCriterion}
        onToggleGroup={toggleGroup}
        onRestoreAll={() => setEnabled(new Set(CRITERIA.map((c) => c.key)))}
      />
      <TenYearTable
        birthYear={birthYear}
        gender={gender}
        criteria={criteria}
        fromYear={THIS_YEAR}
        selectedYear={buildYear}
        onSelect={setBuildYear}
      />
      <BorrowAgeList
        buildYear={buildYear}
        ownerBirthYear={birthYear}
        criteria={criteria}
      />
    </div>
  );
}
