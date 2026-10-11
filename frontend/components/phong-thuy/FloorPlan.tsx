import type { PlanCell, Room } from "@/lib/phong-thuy/rooms";
import { UI } from "@/lib/constants/ui-strings";

type Props = { cells: PlanCell[]; room: Room; roomName: string };

/** Mặt bằng 9 ô, cửa chính ở dưới; tô xanh góc nên đặt (kèm thứ tự ưu tiên), đỏ góc nên tránh. */
export default function FloorPlan({ cells, room, roomName }: Props) {
  return (
    <figure>
      <figcaption className="mb-3 font-serif text-lg font-bold text-[#321716]">
        {UI.VT_PLAN_TITLE(roomName)}
      </figcaption>
      <div className="relative mx-auto max-w-md">
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl border-4 border-[#4a2c2a] bg-[#4a2c2a] p-1.5">
          {cells.map((cell, i) => {
            if (!cell.dir || !cell.star) {
              return (
                <div
                  key="center"
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg p-1 text-center ${
                    room.avoidCenter
                      ? "bg-red-100 text-red-900"
                      : "bg-[#efe6da] text-[#827472]"
                  }`}
                >
                  <span className="text-sm font-semibold">{UI.VT_CENTER}</span>
                  {room.avoidCenter ? (
                    <span className="mt-1 text-[11px]">
                      {UI.VT_CENTER_AVOID}
                    </span>
                  ) : null}
                </div>
              );
            }
            const rank = room.place.indexOf(cell.star);
            const avoid = room.avoid.includes(cell.star);
            const tone =
              rank === 0
                ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                : rank > 0
                  ? "bg-emerald-100 text-emerald-900"
                  : avoid
                    ? "bg-red-50 text-red-800"
                    : "bg-white text-[#504443]";
            return (
              <div
                key={i}
                className={`flex aspect-square flex-col items-center justify-center rounded-lg p-1 text-center ${tone}`}
              >
                <span className="text-sm font-bold md:text-base">
                  {UI.PT_DIR[cell.dir]}
                </span>
                <span className="mt-0.5 text-[11px] opacity-90 md:text-xs">
                  {UI.PT_STAR[cell.star].name}
                </span>
                {rank >= 0 ? (
                  <span className="mt-1 rounded-full bg-white/25 px-2 text-[11px] font-semibold">
                    ✓ {rank + 1}
                  </span>
                ) : avoid ? (
                  <span className="mt-1 text-[11px] font-semibold">✕</span>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="mx-auto -mt-1 w-24 rounded-b-lg bg-[#b8893b] py-1 text-center text-xs font-semibold text-white">
          {UI.VT_DOOR} ↓
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-[#504443]">
        <span className="flex items-center gap-1.5">
          <i className="size-3 rounded bg-emerald-500" /> {UI.VT_LEGEND_PLACE}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-3 rounded border border-red-200 bg-red-50" />{" "}
          {UI.VT_LEGEND_AVOID}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-3 rounded border border-[#d4c3c1] bg-white" />{" "}
          {UI.VT_LEGEND_OTHER}
        </span>
      </div>
      <p className="mt-3 text-center text-xs leading-relaxed text-[#827472]">
        {UI.VT_PLAN_HINT}
      </p>
    </figure>
  );
}
