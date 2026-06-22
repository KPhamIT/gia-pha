"use client";

import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import ToggleRow from "./ToggleRow";

type NotificationSettingsFormProps = {
  onSaved?: () => void;
};

export default function NotificationSettingsForm({
  onSaved,
}: NotificationSettingsFormProps) {
  const {
    settings,
    saving,
    loading,
    configured,
    osLoading,
    permission,
    pushOn,
    statusHint,
    handleToggle,
    handlePushMasterToggle,
  } = useNotificationSettings(onSaved);

  if (loading || !settings) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  }

  return (
    <div className="space-y-6">
      <section className={`overflow-hidden ${BT.card}`}>
        <h2 className="border-b border-amber-200/60 px-4 py-3 text-sm font-semibold text-neutral-900">
          {UI.NOTIF_BROWSER_STATUS}
        </h2>
        <ToggleRow
          label={UI.NOTIF_PUSH_MASTER}
          checked={pushOn}
          disabled={
            saving || osLoading || !configured || permission === "unsupported"
          }
          onChange={(v) => void handlePushMasterToggle(v)}
        />
        <p className="flex items-start gap-2 border-t border-amber-200/60 px-4 py-3 text-xs leading-relaxed text-neutral-600">
          <span
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${pushOn ? "bg-green-500" : "bg-red-500"}`}
          />
          {statusHint}
        </p>
        {settings.pushSubscriptionCount > 0 ? (
          <p className="border-t border-amber-200/60 px-4 py-2 text-xs text-neutral-500">
            {UI.NOTIF_DEVICES_REGISTERED(settings.pushSubscriptionCount)}
          </p>
        ) : null}
      </section>

      <section className={`overflow-hidden ${BT.card}`}>
        <h2 className="border-b border-amber-200/60 px-4 py-3 text-sm font-semibold text-neutral-900">
          {UI.NOTIF_TYPES_TITLE}
        </h2>
        <div className="divide-y divide-amber-200/60">
          <ToggleRow
            label={UI.NOTIF_DEATH_ANNIVERSARY}
            checked={settings.notificationDeathAnniversaryEnabled}
            disabled={saving}
            onChange={(v) =>
              handleToggle("notificationDeathAnniversaryEnabled", v)
            }
          />
          <ToggleRow
            label={UI.NOTIF_EVENTS}
            checked={settings.notificationEventEnabled}
            disabled={saving}
            onChange={(v) => handleToggle("notificationEventEnabled", v)}
          />
          <ToggleRow
            label={UI.NOTIF_POSTS}
            checked={settings.notificationPostEnabled}
            disabled={saving}
            onChange={(v) => handleToggle("notificationPostEnabled", v)}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/notifications"
          className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOnDark}`}
        >
          {UI.NOTIF_OPEN_CENTER}
        </Link>
        <Link
          href="/ceremonies/upcoming"
          className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOnDark}`}
        >
          {UI.NOTIF_OPEN_UPCOMING}
        </Link>
      </div>
    </div>
  );
}
