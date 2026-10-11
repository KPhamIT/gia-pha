import { UI } from "@/lib/constants/ui-strings";
import type { DayCheck } from "./types";

const TAM_NUONG = [3, 7, 13, 18, 22, 27];
const NGUYET_KY = [5, 14, 23];
/** Dương Công kỵ nhật: [tháng âm, ngày âm]. */
const DUONG_CONG: [number, number][] = [
  [1, 13],
  [2, 11],
  [3, 9],
  [4, 7],
  [5, 5],
  [6, 3],
  [7, 8],
  [7, 29],
  [8, 27],
  [9, 25],
  [10, 23],
  [11, 21],
  [12, 19],
];

/** Ngày kỵ theo ngày âm lịch: Tam Nương, Nguyệt Kỵ, Dương Công kỵ nhật. */
export const ngayKy: DayCheck = {
  key: "ngay-ky",
  label: UI.XN_CHECK_NGAY_KY,
  kind: "filter",
  evaluate: ({ info: { lunar } }) => {
    const hits: string[] = [];
    if (TAM_NUONG.includes(lunar.day)) hits.push(UI.XN_KY.tamNuong);
    if (NGUYET_KY.includes(lunar.day)) hits.push(UI.XN_KY.nguyetKy);
    if (DUONG_CONG.some(([m, d]) => m === lunar.month && d === lunar.day)) {
      hits.push(UI.XN_KY.duongCong);
    }
    return hits.length
      ? { status: "bad", summary: hits.join(" ") }
      : { status: "good", summary: UI.XN_KY_NONE };
  },
};
