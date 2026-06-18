'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { UpcomingCeremonyItem } from '@/lib/api/modules/notifications';
import { UI } from '@/lib/constants/ui-strings';
import { BT } from '@/lib/constants/ui-theme';

type UpcomingCeremoniesListProps = {
  highlightPersonId?: number | null;
};

export default function UpcomingCeremoniesList({ highlightPersonId }: UpcomingCeremoniesListProps) {
  const [items, setItems] = useState<UpcomingCeremonyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.notifications
      .upcoming()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
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
            className={`${BT.card} p-4 ${highlighted ? 'ring-2 ring-amber-400' : ''}`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{item.fullName}</p>
                <p className={`text-sm ${BT.mutedOnLight}`}>{item.lunarDateLabel}</p>
                <p className={`text-sm ${BT.gold}`}>{UI.CEREMONIES_DAYS_UNTIL(item.daysUntil)}</p>
              </div>
              <Link
                href={`/ceremonies/upcoming?personId=${item.personId}&view=ceremony`}
                className={BT.btnPrimary}
              >
                {UI.CEREMONIES_VIEW}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
