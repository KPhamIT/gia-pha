"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { NotificationLogItem } from "@/lib/api/modules/notifications";
import { UI } from "@/lib/constants/ui-strings";
import ShareCeremonyActions from "@/components/ceremonies/ShareCeremonyActions";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { BT } from "@/lib/constants/ui-theme";

export default function NotificationCenterList() {
  const [items, setItems] = useState<NotificationLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    api.notifications
      .list()
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
    return (
      <p className={`text-sm ${BT.mutedOnDark}`}>{UI.NOTIFICATIONS_EMPTY}</p>
    );
  }

  return (
    <>
      <p className={`mb-4 text-xs leading-relaxed ${BT.mutedOnDark}`}>
        {UI.NOTIF_IN_APP_HINT}
      </p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <div className={`${BT.card} p-4`}>
              <button
                type="button"
                className="w-full text-left transition hover:opacity-90"
                onClick={() => {
                  if (item.person?.id) {
                    router.push(
                      `/ceremonies/upcoming?personId=${item.person.id}&view=ceremony`,
                    );
                  }
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">🔔 {item.title}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                      item.status === "SENT"
                        ? "bg-green-100 text-green-800"
                        : item.status === "FAILED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status === "SENT"
                      ? UI.NOTIF_PUSH_SENT
                      : item.status === "FAILED"
                        ? UI.NOTIF_PUSH_FAILED
                        : UI.NOTIF_PUSH_LOGGED}
                  </span>
                </div>
                <p
                  className={`mt-1 text-sm whitespace-pre-wrap ${BT.mutedOnLight}`}
                >
                  {item.message}
                </p>
                {item.person ? (
                  <p className={`mt-2 text-xs ${BT.mutedOnLight}`}>
                    {item.person.fullName}
                  </p>
                ) : null}
              </button>
              {item.person ? (
                <div
                  className="mt-3 flex justify-end border-t border-amber-200/40 pt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShareCeremonyActions
                    personId={item.person.id}
                    fullName={item.person.fullName}
                    compact
                  />
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
