import {
  DIRECTIONS,
  STARS,
  type CungPhi,
  type Direction,
} from "@/lib/phong-thuy/bat-trach";
import { UI } from "@/lib/constants/ui-strings";

/** Màu theo thứ hạng sao: Sinh Khí đậm nhất → Phục Vị nhạt; Họa Hại nhạt → Tuyệt Mệnh đậm. */
const FILL = [
  "#047857",
  "#10b981",
  "#6ee7b7",
  "#d1fae5",
  "#fee2e2",
  "#fca5a5",
  "#ef4444",
  "#991b1b",
];
const TEXT = [
  "#fff",
  "#fff",
  "#064e3b",
  "#065f46",
  "#7f1d1d",
  "#7f1d1d",
  "#fff",
  "#fff",
];

const C = 160;
const xy = (deg: number, r: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.sin(a), C - r * Math.cos(a)];
};
const pt = (deg: number, r: number) =>
  xy(deg, r)
    .map((n) => n.toFixed(2))
    .join(" ");

function sector(index: number, inner: number, outer: number) {
  const from = index * 45 - 22.5;
  const to = index * 45 + 22.5;
  return `M ${pt(from, inner)} L ${pt(from, outer)} A ${outer} ${outer} 0 0 1 ${pt(to, outer)} L ${pt(to, inner)} A ${inner} ${inner} 0 0 0 ${pt(from, inner)} Z`;
}

/** La bàn 8 hướng, Bắc ở trên; tô màu theo sao của cung mệnh, viền đậm hướng nhà đang xem. */
export default function Compass({
  cung,
  facing,
}: {
  cung: CungPhi;
  facing?: Direction | null;
}) {
  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label={UI.PT_COMPASS_LABEL}
      className="mx-auto w-full max-w-[340px]"
    >
      {DIRECTIONS.map((dir, i) => {
        const star = cung.dirStar[dir];
        const rank = STARS.indexOf(star);
        const active = dir === facing;
        const [lx, ly] = xy(i * 45, 104);
        return (
          <g key={dir}>
            <path
              d={sector(i, 52, 152)}
              fill={FILL[rank]}
              stroke={active ? "#321716" : "#fff"}
              strokeWidth={active ? 4 : 2}
            />
            <text
              x={lx}
              y={ly - 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill={TEXT[rank]}
            >
              {UI.PT_DIR[dir]}
            </text>
            <text
              x={lx}
              y={ly + 11}
              textAnchor="middle"
              fontSize="11"
              fill={TEXT[rank]}
            >
              {UI.PT_STAR[star].name}
            </text>
          </g>
        );
      })}
      <circle
        cx={C}
        cy={C}
        r={48}
        fill="#fcf6ea"
        stroke="#e7ddd2"
        strokeWidth={2}
      />
      <text x={C} y={C - 4} textAnchor="middle" fontSize="12" fill="#827472">
        {UI.PT_CUNG_SHORT}
      </text>
      <text
        x={C}
        y={C + 16}
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="#321716"
        fontFamily="serif"
      >
        {cung.trigram}
      </text>
    </svg>
  );
}
