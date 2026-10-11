import type { CungPhi, Star } from "@/lib/phong-thuy/bat-trach";
import { ROOMS, type RoomKey } from "@/lib/phong-thuy/rooms";
import { UI } from "@/lib/constants/ui-strings";

const dirs = (cung: CungPhi, stars: Star[] | undefined) =>
  stars
    ? stars
        .slice(0, 2)
        .map((s) => UI.PT_DIR[cung.starDir[s]])
        .join(", ")
    : "—";

type Props = { cung: CungPhi; active: RoomKey; onPick: (key: RoomKey) => void };

/** Bảng tóm tắt 2 lựa chọn tốt nhất cho mọi phòng; bấm một dòng để xem trên sơ đồ. */
export default function RoomSummary({ cung, active, onPick }: Props) {
  return (
    <section>
      <h2 className="font-serif text-2xl font-bold text-[#321716]">
        {UI.VT_SUMMARY_TITLE}
      </h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e7ddd2] bg-white">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-[#fcf6ea] text-xs uppercase tracking-wide text-[#827472]">
            <tr>
              <th className="px-4 py-3">{UI.VT_SUMMARY_COL.room}</th>
              <th className="px-4 py-3">{UI.VT_SUMMARY_COL.place}</th>
              <th className="px-4 py-3">{UI.VT_SUMMARY_COL.face}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#efe6da]">
            {ROOMS.map((room) => (
              <tr
                key={room.key}
                onClick={() => onPick(room.key)}
                className={`cursor-pointer transition hover:bg-[#fcf6ea] ${room.key === active ? "bg-[#fcf6ea]" : ""}`}
              >
                <td className="px-4 py-3 font-semibold text-[#321716]">
                  {UI.VT_ROOM[room.key]}
                </td>
                <td className="px-4 py-3 text-emerald-800">
                  {dirs(cung, room.place)}
                </td>
                <td className="px-4 py-3 text-amber-800">
                  {dirs(cung, room.face)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
