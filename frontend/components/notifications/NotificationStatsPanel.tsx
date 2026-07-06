"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { NotificationStats } from "@/lib/api/modules/notifications";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { AC } from "@/components/auth/account-theme";

type Props = {
  variant?: "book" | "landing";
};

export default function NotificationStatsPanel({ variant = "landing" }: Props) {
  const [stats, setStats] = useState<NotificationStats | null>(null);

  useEffect(() => {
    api.notifications
      .stats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  if (!stats) return null;

  if (variant === "book") {
    return (
      <section className={`${BT.card} p-4`}>
        <h2 className="text-sm font-semibold">{UI.NOTIF_STATS_TITLE}</h2>
        <dl className={`mt-3 space-y-2 text-sm ${BT.mutedOnLight}`}>
          <StatsRows stats={stats} variant="book" />
        </dl>
      </section>
    );
  }

  return (
    <section className={`${AC.card} p-5`}>
      <h2 className={AC.sectionTitle}>{UI.NOTIF_STATS_TITLE}</h2>
      <dl className={`mt-4 space-y-3 text-sm ${AC.muted}`}>
        <StatsRows stats={stats} variant="landing" />
      </dl>
    </section>
  );
}

function StatsRows({
  stats,
  variant,
}: {
  stats: NotificationStats;
  variant: "book" | "landing";
}) {
  const valueClass =
    variant === "book" ? "font-medium text-neutral-900" : "font-semibold text-[#321716]";

  return (
    <>
      <div className="flex justify-between gap-4">
        <dt>{UI.NOTIF_STATS_TOTAL}</dt>
        <dd className={valueClass}>{stats.totalMembers}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt>{UI.NOTIF_STATS_SUBSCRIBED}</dt>
        <dd className={valueClass}>{stats.subscribed}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt>{UI.NOTIF_STATS_RATE}</dt>
        <dd className={valueClass}>{stats.rate}%</dd>
      </div>
    </>
  );
}
