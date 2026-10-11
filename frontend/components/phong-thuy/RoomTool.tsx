"use client";

import { useMemo, useState } from "react";
import { cungPhi, type Direction } from "@/lib/phong-thuy/bat-trach";
import {
  ROOMS,
  planCells,
  roomByKey,
  type RoomKey,
} from "@/lib/phong-thuy/rooms";
import { useOwnerProfile } from "@/lib/tools/owner-profile";
import { UI } from "@/lib/constants/ui-strings";
import OwnerFields from "@/components/tools/OwnerFields";
import FacingSelect from "./FacingSelect";
import FengShuiObjects from "./FengShuiObjects";
import FloorPlan from "./FloorPlan";
import RoomAdvice from "./RoomAdvice";
import RoomSummary from "./RoomSummary";

/** Xem vị trí phòng: chọn phòng → sơ đồ 9 ô tô góc nên đặt / tránh + lời khuyên. */
export default function RoomTool() {
  const [owner, setOwner] = useOwnerProfile();
  const [facing, setFacing] = useState<Direction>("S");
  const [roomKey, setRoomKey] = useState<RoomKey>("bep");
  const cung = useMemo(() => cungPhi(owner.birthYear, owner.gender), [owner]);
  const cells = useMemo(() => planCells(facing, cung), [facing, cung]);
  const room = roomByKey(roomKey);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm sm:grid-cols-3 md:p-6">
        <OwnerFields
          owner={owner}
          onChange={setOwner}
          genderHint={UI.TOOLS_OWNER_SHARED}
        />
        <FacingSelect
          label={UI.VT_FACING}
          hint={UI.VT_FACING_HINT}
          value={facing}
          onChange={(d) => d && setFacing(d)}
        />
      </div>

      <p className="text-center text-sm text-[#504443]">
        {UI.PT_CUNG(cung.trigram, cung.element)} · {UI.PT_GROUP[cung.group]}
      </p>

      <div>
        <p className="text-sm font-semibold text-[#321716]">
          {UI.VT_ROOM_PICK}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ROOMS.map((r) => {
            const active = r.key === roomKey;
            return (
              <button
                key={r.key}
                type="button"
                aria-pressed={active}
                onClick={() => setRoomKey(r.key)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-[#944a00] bg-[#944a00] text-white"
                    : "border-[#d4c3c1] bg-white text-[#504443] hover:border-[#944a00] hover:text-[#944a00]"
                }`}
              >
                {UI.VT_ROOM[r.key]}
              </button>
            );
          })}
        </div>
      </div>

      <section className="grid gap-8 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
        <FloorPlan cells={cells} room={room} roomName={UI.VT_ROOM[room.key]} />
        <RoomAdvice room={room} cung={cung} />
      </section>

      <RoomSummary cung={cung} active={roomKey} onPick={setRoomKey} />

      <FengShuiObjects cells={cells} />
    </div>
  );
}
