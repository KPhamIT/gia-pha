"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import type { DonationDraftItem } from "@/components/types/event-types";
import { formatDonationValue } from "./event-format";
import { ET } from "./event-theme";

type Props = {
  donation: DonationDraftItem;
  onEdit: () => void;
  onRemove: () => void;
};

export default function DonationRow({ donation, onEdit, onRemove }: Props) {
  const isMoney = donation.kind === "MONEY";

  return (
    <li
      className={`flex gap-3 px-4 py-3 ${isMoney ? "items-center" : "items-start"}`}
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-600 text-sm font-semibold text-white ${
          isMoney ? "" : "mt-0.5"
        }`}
      >
        {donation.donorName.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <div
          className={`flex justify-between gap-2 ${isMoney ? "items-center" : "items-start"}`}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-medium text-neutral-800">
                {donation.donorName}
              </span>
              {donation.kind === "IN_KIND" ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                  {UI.EVENT_DONATION_KIND_IN_KIND}
                </span>
              ) : null}
            </div>
            {donation.kind === "IN_KIND" && donation.itemDescription ? (
              <span className="mt-0.5 block text-sm font-semibold text-amber-900">
                {donation.itemDescription}
              </span>
            ) : null}
            {donation.note ? (
              <span className="mt-0.5 block text-xs text-neutral-400">
                {donation.note}
              </span>
            ) : null}
          </div>
          {isMoney ? (
            <span className={`shrink-0 text-sm font-bold ${ET.money}`}>
              {formatDonationValue(donation)}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="grid h-8 w-8 place-items-center rounded-full text-neutral-500 active:bg-neutral-100"
          aria-label={UI.EVENT_DONATION_EDIT}
        >
          <Icon
            path="edit"
            size={15}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="grid h-8 w-8 place-items-center rounded-full text-rose-500 active:bg-rose-50"
          aria-label={UI.DELETE_PERSON}
        >
          <Icon
            path="trash"
            size={15}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
      </div>
    </li>
  );
}
