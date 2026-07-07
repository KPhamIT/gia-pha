import { UI } from "@/lib/constants/ui-strings";
import { CT } from "./contribution-theme";
import { formatVnd } from "./event-format";

type Props = {
  paidCount: number;
  unpaidCount: number;
  totalCollected: number;
  amountPerPerson?: number;
};

export default function ContributionSummaryStats({
  paidCount,
  unpaidCount,
  totalCollected,
  amountPerPerson,
}: Props) {
  return (
    <div className="space-y-2">
      <div
        className={`overflow-hidden rounded-xl border bg-white shadow-md ${CT.statsBorder}`}
      >
        <div className="grid grid-cols-3 divide-x divide-neutral-200 text-center">
          <div className="py-4">
            <div className={`text-2xl font-bold md:text-3xl ${CT.statsPaid}`}>
              {paidCount}
            </div>
            <div className="mt-0.5 text-xs text-neutral-500">{UI.EVENT_PAID}</div>
          </div>
          <div className="py-4">
            <div
              className={`text-2xl font-bold md:text-3xl ${CT.statsUnpaid}`}
            >
              {unpaidCount}
            </div>
            <div className="mt-0.5 text-xs text-neutral-500">
              {UI.EVENT_UNPAID}
            </div>
          </div>
          <div className="py-4">
            <div className={`text-lg font-bold md:text-xl ${CT.statsTotal}`}>
              {formatVnd(totalCollected)}
            </div>
            <div className="mt-0.5 text-xs text-neutral-500">
              {UI.EVENT_TOTAL_COLLECTED}
            </div>
          </div>
        </div>
      </div>
      {amountPerPerson != null && amountPerPerson > 0 ? (
        <p className={`text-xs ${CT.mutedOnShell}`}>
          {UI.EVENT_AMOUNT_PER_PERSON(formatVnd(amountPerPerson))}
        </p>
      ) : null}
    </div>
  );
}
