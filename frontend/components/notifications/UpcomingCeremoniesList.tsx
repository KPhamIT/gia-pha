"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ShareCeremonyActions from "@/components/ceremonies/ShareCeremonyActions";
import { AC } from "@/components/auth/account-theme";
import { api } from "@/lib/api";
import type { UpcomingCeremonyItem } from "@/lib/api/modules/notifications";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import LoadingSpinner from "@/components/icons/LoadingSpinner";

const LUNAR_MONTHS_SHORT = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
] as const;

type UpcomingCeremoniesListProps = {
  highlightPersonId?: number | null;
  variant?: "book" | "landing";
};

function lunarMonthShort(month: number): string {
  const abs = Math.abs(month);
  const label = LUNAR_MONTHS_SHORT[abs - 1] ?? `T${abs}`;
  return month < 0 ? `N${label}` : label;
}

export default function UpcomingCeremoniesList({
  highlightPersonId,
  variant = "book",
}: UpcomingCeremoniesListProps) {
  const isLanding = variant === "landing";
  const [items, setItems] = useState<UpcomingCeremonyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.notifications
      .upcoming()
      .then(setItems)
      .catch(() => setError(UI.ERR_FETCH_DATA))
      .finally(() => setLoading(false));
  }, []);

  const mutedClass = isLanding ? AC.muted : BT.mutedOnDark;
  const cardClass = isLanding ? AC.card : BT.card;
  const errorClass = isLanding
    ? "rounded-lg bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]"
    : BT.error;
  const viewCeremonyBtnClass = isLanding
    ? "inline-flex w-full items-center justify-center rounded-xl bg-[#944a00] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 active:scale-95 sm:w-auto"
    : `${BT.btnBase} ${BT.btnCompact} ${BT.btnGold} w-full justify-center sm:w-auto`;

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner size={32} label={UI.LOADING} />
      </div>
    );
  }

  if (error) {
    return <p className={`text-sm ${errorClass}`}>{error}</p>;
  }

  if (items.length === 0) {
    return (
      <div
        className={
          isLanding
            ? "rounded-xl border border-[#d4c3c1] bg-white p-8 text-center shadow-sm"
            : undefined
        }
      >
        <p className={`text-sm ${mutedClass}`}>{UI.CEREMONIES_EMPTY}</p>
        {isLanding ? (
          <Link
            href="/settings/notifications"
            className="mt-4 inline-flex rounded-xl border border-[#d4c3c1] px-5 py-2.5 text-sm font-semibold text-[#321716] transition hover:bg-[#f6f3ee]"
          >
            {UI.NOTIF_OPEN_SETTINGS}
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const highlighted = highlightPersonId === item.personId;
        const highlightClass = isLanding
          ? "ring-2 ring-[#944a00]/40"
          : "ring-2 ring-amber-400";

        return (
          <li
            key={item.personId}
            className={`${cardClass} p-4 md:p-5 ${highlighted ? highlightClass : ""}`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 gap-4">
                {isLanding ? (
                  <div
                    className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl font-bold ${
                      highlighted
                        ? "bg-[#ffdcc5] text-[#301400]"
                        : "bg-[#ebe8e3] text-[#504443]"
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase">
                      {lunarMonthShort(item.deathLunarMonth)}
                    </span>
                    <span className="text-lg leading-none">
                      {String(item.deathLunarDay).padStart(2, "0")}
                    </span>
                  </div>
                ) : null}
                <div className="min-w-0">
                  <p
                    className={`font-semibold ${
                      isLanding ? "text-[#321716]" : ""
                    }`}
                  >
                    {item.fullName}
                  </p>
                  <p
                    className={`text-sm ${
                      isLanding ? AC.muted : BT.mutedOnLight
                    }`}
                  >
                    {item.lunarDateLabel}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      isLanding ? "text-[#944a00]" : BT.gold
                    }`}
                  >
                    {UI.CEREMONIES_DAYS_UNTIL(item.daysUntil)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:shrink-0">
                <Link
                  href={`/ceremonies/upcoming?personId=${item.personId}&view=ceremony`}
                  className={viewCeremonyBtnClass}
                >
                  {UI.CEREMONIES_VIEW}
                </Link>
                <ShareCeremonyActions
                  personId={item.personId}
                  fullName={item.fullName}
                  compact
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
