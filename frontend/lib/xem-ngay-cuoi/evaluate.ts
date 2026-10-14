/**
 * Xem ngày cưới hỏi: lấy tuổi cô dâu làm gốc (Kim Lâu, tháng đại lợi), xét thêm
 * Chu đường, hoàng đạo, trực, ngày bách kỵ và tuổi cả hai người (`checks.ts`).
 */
import { dayInfo, daysInMonth, type DayInfo } from "@/lib/lich/ngay";
import { verdictOf, type DayEvaluation } from "@/lib/xem-ngay/evaluate";
import { chiIndex } from "@/lib/xem-tuoi/can-chi";
import { kimLauKind } from "@/lib/xem-tuoi/criteria/kim-lau";
import { tamTaiYears } from "@/lib/xem-tuoi/criteria/tam-tai";
import { WEDDING_CHECKS } from "./checks";
import type { Couple, WeddingContext } from "./types";

export type { Couple } from "./types";

/** Ngày cưới cần nhiều điều tốt hơn việc thường: 3 điểm trở lên mới là ngày tốt. */
const GOOD_MIN = 3;

export function evaluateWeddingDay(
  info: DayInfo,
  couple: Couple,
): DayEvaluation {
  const ctx: WeddingContext = {
    ...couple,
    info,
    brideChi: chiIndex(couple.brideYear),
    groomChi: chiIndex(couple.groomYear),
  };
  const outcomes = WEDDING_CHECKS.map((check) => ({
    check,
    result: check.evaluate(ctx),
  }));
  return { info, outcomes, verdict: verdictOf(outcomes, GOOD_MIN) };
}

export function evaluateWeddingMonth(
  month: number,
  year: number,
  couple: Couple,
): DayEvaluation[] {
  return Array.from({ length: daysInMonth(month, year) }, (_, i) =>
    evaluateWeddingDay(dayInfo(i + 1, month, year), couple),
  );
}

/** Các năm âm lịch (trong danh sách ngày) mà cô dâu phạm Kim Lâu. */
export function kimLauLunarYears(days: DayEvaluation[]): number[] {
  const years = days
    .filter((d) =>
      d.outcomes.some(
        (o) => o.check.key === "kim-lau" && o.result.status === "bad",
      ),
    )
    .map((d) => d.info.lunar.year);
  return [...new Set(years)];
}

export type WeddingYear = {
  /** Năm âm lịch. */
  year: number;
  brideAge: number;
  brideKimLau: ReturnType<typeof kimLauKind>;
  groomAge: number;
  groomKimLau: ReturnType<typeof kimLauKind>;
  brideTamTai: boolean;
};

/** Tổng quan các năm âm lịch: Kim Lâu cô dâu (chính), chú rể và Tam Tai (tham khảo). */
export function weddingYears(
  from: number,
  count: number,
  brideYear: number,
  groomYear: number,
): WeddingYear[] {
  const tamTai = tamTaiYears(chiIndex(brideYear));
  return Array.from({ length: count }, (_, i) => {
    const year = from + i;
    const brideAge = year - brideYear + 1;
    const groomAge = year - groomYear + 1;
    return {
      year,
      brideAge,
      brideKimLau: kimLauKind(brideAge),
      groomAge,
      groomKimLau: kimLauKind(groomAge),
      brideTamTai: tamTai.includes(chiIndex(year)),
    };
  });
}
