import type { DayInfo } from "@/lib/lich/ngay";
import type { CheckResult, DayCheck } from "@/lib/xem-ngay/checks";

export type Couple = {
  brideYear: number;
  groomYear: number;
  /** Còn bố mẹ chồng — khi đó tránh tháng phòng Ông Cô và ngày Ông, Cô của Chu đường. */
  inLawsAlive: boolean;
};

export type WeddingContext = Couple & {
  info: DayInfo;
  brideChi: number;
  groomChi: number;
};

export type WeddingCheck = Pick<DayCheck, "key" | "label" | "kind"> & {
  evaluate: (ctx: WeddingContext) => CheckResult;
};
