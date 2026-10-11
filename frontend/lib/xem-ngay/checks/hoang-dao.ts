import { UI } from "@/lib/constants/ui-strings";
import type { DayCheck } from "./types";

/** Ngày hoàng đạo (6 thần tốt) hay hắc đạo (6 thần xấu). */
export const hoangDao: DayCheck = {
  key: "hoang-dao",
  label: UI.XN_CHECK_HOANG_DAO,
  kind: "score",
  evaluate: ({ info }) => ({
    status: info.than.good ? "good" : "bad",
    summary: UI.XN_HOANG_DAO(info.than.name, info.than.good),
  }),
};
