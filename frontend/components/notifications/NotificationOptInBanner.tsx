"use client";

import { useEffect, useState } from "react";
import { useOneSignal } from "@/hooks/useOneSignal";
import { api } from "@/lib/api";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

const DISMISS_KEY = "gia-pha:notif-banner-dismissed";

export default function NotificationOptInBanner() {
  const { configured, hasPermission, enableNotifications } = useOneSignal({
    lazy: true,
  });
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!configured) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    api.notifications
      .getSettings()
      .then((settings) => {
        if (!settings.notificationDeathAnniversaryEnabled) {
          setVisible(true);
        }
      })
      .catch(() => {
        // ignore — user may not be logged in
      });
  }, [configured]);

  if (!visible || hasPermission) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const handleEnable = async () => {
    setLoading(true);
    try {
      await enableNotifications();
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[5.5rem] pr-3 md:pl-[6.5rem] md:pr-6">
      <div
        className={`${BT.card} flex flex-col gap-3 p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between`}
      >
        <p className="text-sm text-neutral-800">{UI.NOTIF_BANNER_TEXT}</p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`}
            disabled={loading}
            onClick={() => void handleEnable()}
          >
            {UI.NOTIF_ENABLE}
          </button>
          <button
            type="button"
            className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline}`}
            onClick={dismiss}
          >
            {UI.NOTIF_LATER}
          </button>
        </div>
      </div>
    </div>
  );
}
