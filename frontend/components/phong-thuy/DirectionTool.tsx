"use client";

import { useMemo, useState } from "react";
import {
  cungPhi,
  isGoodStar,
  type Direction,
} from "@/lib/phong-thuy/bat-trach";
import { useOwnerProfile } from "@/lib/tools/owner-profile";
import { UI } from "@/lib/constants/ui-strings";
import OwnerFields from "@/components/tools/OwnerFields";
import Compass from "./Compass";
import DirectionCards from "./DirectionCards";
import FacingSelect from "./FacingSelect";

/** Xem hướng nhà: cung mệnh, la bàn 8 hướng, đánh giá hướng nhà đang xem. */
export default function DirectionTool() {
  const [owner, setOwner] = useOwnerProfile();
  const [facing, setFacing] = useState<Direction | null>(null);
  const cung = useMemo(() => cungPhi(owner.birthYear, owner.gender), [owner]);
  const facingStar = facing ? cung.dirStar[facing] : null;
  const facingGood = facingStar ? isGoodStar(facingStar) : false;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm sm:grid-cols-3 md:p-6">
        <OwnerFields
          owner={owner}
          onChange={setOwner}
          genderHint={UI.TOOLS_OWNER_SHARED}
        />
        <FacingSelect
          label={UI.XH_FACING}
          hint={UI.XH_FACING_HINT}
          value={facing}
          onChange={setFacing}
          optional
        />
      </div>

      <section className="grid items-center gap-6 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm md:grid-cols-[1fr_1.1fr] md:p-8">
        <Compass cung={cung} facing={facing} />
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#b8893b]">
            {UI.XH_RESULT_TITLE}
          </p>
          <h2 className="font-serif text-3xl font-bold text-[#321716]">
            {UI.PT_CUNG(cung.trigram, cung.element)}
          </h2>
          <p className="text-[#504443]">
            {UI.XH_RESULT_BODY(
              UI.PT_GROUP[cung.group],
              UI.PT_GROUP_DIRS[cung.group],
            )}
          </p>
          <p className="rounded-xl bg-emerald-50 px-4 py-3 font-medium text-emerald-900">
            {UI.XH_BEST(UI.PT_DIR[cung.starDir["sinh-khi"]])}
          </p>
          {facing && facingStar ? (
            <div
              className={`rounded-xl border-l-4 px-4 py-3 ${
                facingGood
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-red-600 bg-red-50"
              }`}
            >
              <p className="font-semibold text-[#321716]">
                {UI.XH_FACING_VERDICT(
                  UI.PT_DIR[facing],
                  UI.PT_STAR[facingStar].name,
                  facingGood,
                )}
              </p>
              <p className="mt-1 text-sm text-[#504443]">
                {UI.PT_STAR[facingStar].meaning}
              </p>
              {facingGood ? null : (
                <p className="mt-2 text-sm text-[#504443]">
                  {UI.XH_FACING_FIX}
                </p>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <DirectionCards cung={cung} />
      <p className="rounded-xl bg-[#f7f3ed] px-4 py-3 text-sm leading-relaxed text-[#504443]">
        {UI.XH_FAMILY_NOTE}
      </p>
    </div>
  );
}
