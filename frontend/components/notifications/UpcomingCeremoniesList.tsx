"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ShareCeremonyActions from "@/components/ceremonies/ShareCeremonyActions";
import { api } from "@/lib/api";
import type { UpcomingCeremonyItem } from "@/lib/api/modules/notifications";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import LoadingSpinner from "@/components/icons/LoadingSpinner";

const viewCeremonyBtnClass = `${BT.btnBase} ${BT.btnCompact} ${BT.btnGold} w-full justify-center sm:w-auto`;

type UpcomingCeremoniesListProps = {
  highlightPersonId?: number | null;
};

export default function UpcomingCeremoniesList({
  highlightPersonId,
}: UpcomingCeremoniesListProps) {
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

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner size={32} label={UI.LOADING} />
      </div>
    );
  }

  if (error) {
    return <p className={`text-sm ${BT.error}`}>{error}</p>;
  }

  if (items.length === 0) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.CEREMONIES_EMPTY}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const highlighted = highlightPersonId === item.personId;
        return (
          <li
            key={item.personId}
            className={`${BT.card} p-4 ${highlighted ? "ring-2 ring-amber-400" : ""}`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{item.fullName}</p>
                <p className={`text-sm ${BT.mutedOnLight}`}>
                  {item.lunarDateLabel}
                </p>
                <p className={`text-sm ${BT.gold}`}>
                  {UI.CEREMONIES_DAYS_UNTIL(item.daysUntil)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
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
