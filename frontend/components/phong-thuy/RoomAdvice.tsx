import type { CungPhi, Star } from "@/lib/phong-thuy/bat-trach";
import type { Room } from "@/lib/phong-thuy/rooms";
import { UI } from "@/lib/constants/ui-strings";

/** "Đông Nam (Sinh Khí)" cho từng sao. */
const label = (cung: CungPhi, star: Star) =>
  `${UI.PT_DIR[cung.starDir[star]]} (${UI.PT_STAR[star].name})`;

function Row({
  title,
  stars,
  cung,
  tone,
}: {
  title: string;
  stars: Star[];
  cung: CungPhi;
  tone: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#827472]">
        {title}
      </p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {stars.map((s) => (
          <li
            key={s}
            className={`rounded-full px-3 py-1 text-sm font-medium ${tone}`}
          >
            {label(cung, s)}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Lời khuyên cho phòng đang chọn: lý do, góc nên đặt / tránh, hướng nên quay về, lưu ý. */
export default function RoomAdvice({
  room,
  cung,
}: {
  room: Room;
  cung: CungPhi;
}) {
  return (
    <div className="space-y-4 text-sm">
      <p className="leading-relaxed text-[#321716]">
        {UI.VT_ROOM_WHY[room.key]}
      </p>
      <Row
        title={UI.VT_PLACE}
        stars={room.place}
        cung={cung}
        tone="bg-emerald-100 text-emerald-900"
      />
      {room.face ? (
        <Row
          title={UI.VT_FACE}
          stars={room.face}
          cung={cung}
          tone="bg-amber-100 text-amber-900"
        />
      ) : null}
      <Row
        title={UI.VT_AVOID}
        stars={room.avoid}
        cung={cung}
        tone="bg-red-50 text-red-800"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#827472]">
          {UI.VT_TIPS}
        </p>
        <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[#504443]">
          {UI.VT_ROOM_TIPS[room.key].map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
