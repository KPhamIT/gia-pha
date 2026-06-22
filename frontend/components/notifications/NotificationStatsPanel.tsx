"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { NotificationStats } from "@/lib/api/modules/notifications";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export default function NotificationStatsPanel() {
  const [stats, setStats] = useState<NotificationStats | null>(null);

  useEffect(() => {
    api.notifications
      .stats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  if (!stats) return null;

  return (
    <section className={`${BT.card} p-4`}>
      <h2 className="text-sm font-semibold">{UI.NOTIF_STATS_TITLE}</h2>
      <dl className={`mt-3 space-y-2 text-sm ${BT.mutedOnLight}`}>
        <div className="flex justify-between gap-4">
          <dt>{UI.NOTIF_STATS_TOTAL}</dt>
          <dd className="font-medium text-neutral-900">{stats.totalMembers}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>{UI.NOTIF_STATS_SUBSCRIBED}</dt>
          <dd className="font-medium text-neutral-900">{stats.subscribed}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>{UI.NOTIF_STATS_RATE}</dt>
          <dd className="font-medium text-neutral-900">{stats.rate}%</dd>
        </div>
      </dl>
    </section>
  );
}
