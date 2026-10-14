/** Các tiêu chí xem ngày cưới — mỗi tiêu chí độc lập, thêm vào `WEDDING_CHECKS`. */
import { hoangDao } from "@/lib/xem-ngay/checks/hoang-dao";
import { ngayKy } from "@/lib/xem-ngay/checks/ngay-ky";
import { truc } from "@/lib/xem-ngay/checks/truc";
import type { DayCheck } from "@/lib/xem-ngay/checks";
import { activityByKey } from "@/lib/xem-ngay/evaluate";
import { CHI } from "@/lib/xem-tuoi/can-chi";
import { kimLauKind } from "@/lib/xem-tuoi/criteria/kim-lau";
import { UI } from "@/lib/constants/ui-strings";
import {
  chuDuong,
  isBigLunarMonth,
  KHONG_PHONG,
  monthKind,
  SAT_CHU,
  THU_TU,
} from "./tables";
import { hopTuoi, xungTuoi } from "./checks-tuoi";
import type { WeddingCheck } from "./types";

export type * from "./types";

const CUOI_HOI = activityByKey("cuoi-hoi");

/** Dùng lại tiêu chí của công cụ xem ngày giờ (hoàng đạo, trực, ngày kỵ). */
const fromDayCheck = (check: DayCheck): WeddingCheck => ({
  ...check,
  evaluate: ({ info }) =>
    check.evaluate({ info, activity: CUOI_HOI, ownerChi: null }),
});

/** Kim Lâu tính theo tuổi mụ cô dâu trong năm âm lịch của ngày cưới. */
const kimLauCoDau: WeddingCheck = {
  key: "kim-lau",
  label: UI.XC_CHECK_KIM_LAU,
  kind: "filter",
  evaluate: ({ info, brideYear }) => {
    const age = info.lunar.year - brideYear + 1;
    const kind = kimLauKind(age);
    return kind === "khong"
      ? { status: "good", summary: UI.XC_KIM_LAU_OK(age) }
      : { status: "bad", summary: UI.XC_KIM_LAU_BAD(age, UI.XC_KIM_LAU[kind]) };
  },
};

const thangCuoi: WeddingCheck = {
  key: "thang",
  label: UI.XC_CHECK_THANG,
  kind: "score",
  evaluate: ({ info, brideChi, inLawsAlive }) => {
    const kind = monthKind(brideChi, info.lunar.month);
    const summary = UI.XC_MONTH_SUMMARY(info.lunar.month, kind, inLawsAlive);
    switch (kind) {
      case "dai-loi":
        return { status: "good", summary };
      case "tieu-loi":
        return { status: "neutral", summary };
      case "ong-co":
        return { status: inLawsAlive ? "bad" : "neutral", summary };
      case "phu-mau":
        return { status: "bad", summary };
      default:
        return { status: "bad", summary, severe: true };
    }
  },
};

const chuDuongCheck: WeddingCheck = {
  key: "chu-duong",
  label: UI.XC_CHECK_CHU_DUONG,
  kind: "score",
  evaluate: ({ info, inLawsAlive }) => {
    const big = isBigLunarMonth(info.date, info.lunar.day);
    const cung = chuDuong(info.lunar.day, big);
    const summary = UI.XC_CHU_DUONG(cung, big, inLawsAlive);
    if (cung === "phu" || cung === "phu-dau")
      return { status: "bad", summary, severe: true };
    if (cung === "ong" || cung === "co")
      return { status: inLawsAlive ? "bad" : "neutral", summary };
    return { status: "good", summary };
  },
};

const bachKy: WeddingCheck = {
  key: "bach-ky",
  label: UI.XC_CHECK_BACH_KY,
  kind: "filter",
  evaluate: ({ info }) => {
    const m = info.lunar.month - 1;
    const hits: string[] = [];
    if (SAT_CHU[m] === info.dayChi) hits.push(UI.XC_SAT_CHU);
    if (THU_TU[m] === info.dayChi) hits.push(UI.XC_THU_TU);
    return hits.length
      ? { status: "bad", summary: hits.join(" ") }
      : { status: "good", summary: UI.XC_BACH_KY_NONE };
  },
};

const khongPhong: WeddingCheck = {
  key: "khong-phong",
  label: UI.XC_CHECK_KHONG_PHONG,
  kind: "score",
  evaluate: ({ info }) =>
    KHONG_PHONG[Math.floor((info.lunar.month - 1) / 3)].includes(info.dayChi)
      ? { status: "bad", summary: UI.XC_KHONG_PHONG_BAD(CHI[info.dayChi]) }
      : { status: "neutral", summary: UI.XC_KHONG_PHONG_NONE },
};

/** Thứ tự hiển thị: năm → tháng → ngày → tuổi. */
export const WEDDING_CHECKS: readonly WeddingCheck[] = [
  kimLauCoDau,
  thangCuoi,
  chuDuongCheck,
  fromDayCheck(hoangDao),
  fromDayCheck(truc),
  bachKy,
  fromDayCheck(ngayKy),
  khongPhong,
  xungTuoi,
  hopTuoi,
];

