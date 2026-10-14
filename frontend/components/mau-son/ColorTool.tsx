"use client";

import { useMemo, useState } from "react";
import { analyzeColors, type Basis } from "@/lib/mau-son/analyze";
import type { Direction } from "@/lib/phong-thuy/bat-trach";
import { useOwnerProfile } from "@/lib/tools/owner-profile";
import { UI } from "@/lib/constants/ui-strings";
import OwnerFields, { toolSelectClass } from "@/components/tools/OwnerFields";
import FacingSelect from "@/components/phong-thuy/FacingSelect";
import AreaCards from "./AreaCards";
import ColorRanks from "./ColorRanks";

/** Xem màu sơn, màu gạch: năm sinh + giới tính + hướng nhà → nhóm màu và gợi ý từng khu vực. */
export default function ColorTool() {
  const [owner, setOwner] = useOwnerProfile();
  const [basis, setBasis] = useState<Basis>("nap-am");
  const [facing, setFacing] = useState<Direction | null>(null);
  const analysis = useMemo(
    () => analyzeColors(owner.birthYear, owner.gender, basis, facing),
    [owner, basis, facing],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm sm:grid-cols-2 md:p-6 lg:grid-cols-4">
        <OwnerFields
          owner={owner}
          onChange={setOwner}
          genderHint={UI.TOOLS_OWNER_SHARED}
        />
        <label className="block text-sm">
          <span className="font-semibold text-[#321716]">{UI.MS_BASIS}</span>
          <select
            className={toolSelectClass}
            value={basis}
            onChange={(e) => setBasis(e.target.value as Basis)}
          >
            {(Object.keys(UI.MS_BASIS_OPTIONS) as Basis[]).map((b) => (
              <option key={b} value={b}>
                {UI.MS_BASIS_OPTIONS[b]}
              </option>
            ))}
          </select>
          <span className="mt-1.5 block text-xs text-[#827472]">
            {UI.MS_BASIS_HINT}
          </span>
        </label>
        <FacingSelect
          label={UI.MS_FACING}
          hint={UI.MS_FACING_HINT}
          value={facing}
          onChange={setFacing}
          optional
        />
      </div>

      <p className="text-center font-serif text-xl font-bold text-[#321716]">
        {UI.MS_MENH(analysis.menhName, analysis.menh)}
      </p>
      <ColorRanks ranked={analysis.ranked} />
      <AreaCards analysis={analysis} />
    </div>
  );
}
