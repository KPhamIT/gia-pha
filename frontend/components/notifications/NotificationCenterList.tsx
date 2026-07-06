"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import type { NotificationLogItem } from "@/lib/api/modules/notifications";
import { AC } from "@/components/auth/account-theme";
import { UI } from "@/lib/constants/ui-strings";
import ShareCeremonyActions from "@/components/ceremonies/ShareCeremonyActions";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { BT } from "@/lib/constants/ui-theme";

type Props = {
  variant?: "book" | "landing";
};

function statusBadgeClass(
  status: NotificationLogItem["status"],
  landing: boolean,
): string {
  if (status === "SENT") {
    return landing
      ? "bg-[#dcfce7] text-[#166534]"
      : "bg-green-100 text-green-800";
  }
  if (status === "FAILED") {
    return landing
      ? "bg-[#ffdad6] text-[#93000a]"
      : "bg-red-100 text-red-800";
  }
  return landing
    ? "bg-[#ffdcc5] text-[#301400]"
    : "bg-amber-100 text-amber-800";
}

export default function NotificationCenterList({ variant = "book" }: Props) {
  const isLanding = variant === "landing";
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

  const mutedClass = isLanding ? AC.muted : BT.mutedOnDark;
  const cardClass = isLanding ? AC.card : BT.card;
  const errorClass = isLanding
    ? "rounded-lg bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]"
    : BT.error;

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
        <p className={`text-sm ${mutedClass}`}>{UI.NOTIFICATIONS_EMPTY}</p>
        {isLanding ? (
          <Link
            href="/settings/notifications"
            className="mt-4 inline-flex rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white"
          >
            {UI.NOTIF_OPEN_SETTINGS}
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {!isLanding ? (
        <p className={`mb-4 text-xs leading-relaxed ${mutedClass}`}>
          {UI.NOTIF_IN_APP_HINT}
        </p>
      ) : null}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <div className={`${cardClass} p-4 md:p-5`}>
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
                  <p
                    className={`font-semibold ${
                      isLanding ? "text-[#321716]" : "font-medium"
                    }`}
                  >
                    {item.title}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${statusBadgeClass(item.status, isLanding)}`}
                  >
                    {item.status === "SENT"
                      ? UI.NOTIF_PUSH_SENT
                      : item.status === "FAILED"
                        ? UI.NOTIF_PUSH_FAILED
                        : UI.NOTIF_PUSH_LOGGED}
                  </span>
                </div>
                <p
                  className={`mt-1 whitespace-pre-wrap text-sm ${
                    isLanding ? AC.muted : BT.mutedOnLight
                  }`}
                >
                  {item.message}
                </p>
                {item.person ? (
                  <p
                    className={`mt-2 text-xs ${
                      isLanding ? "text-[#827472]" : BT.mutedOnLight
                    }`}
                  >
                    {item.person.fullName}
                  </p>
                ) : null}
              </button>
              {item.person ? (
                <div
                  className={`mt-3 flex justify-end border-t pt-3 ${
                    isLanding ? "border-[#d4c3c1]/40" : "border-amber-200/40"
                  }`}
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
