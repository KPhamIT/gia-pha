"use client";

import Link from "next/link";
import { AC } from "@/components/auth/account-theme";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import ToggleRow from "./ToggleRow";

type NotificationSettingsFormProps = {
  onSaved?: () => void;
  variant?: "book" | "landing";
};

export default function NotificationSettingsForm({
  onSaved,
  variant = "book",
}: NotificationSettingsFormProps) {
  const isLanding = variant === "landing";
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

  const loadingClass = isLanding ? AC.muted : BT.mutedOnDark;
  const cardClass = isLanding ? AC.card : BT.card;
  const headerClass = isLanding
    ? "border-b border-[#d4c3c1] px-5 py-4 font-serif text-lg font-semibold text-[#321716]"
    : "border-b border-amber-200/60 px-4 py-3 text-sm font-semibold text-neutral-900";
  const divideClass = isLanding
    ? "divide-[#d4c3c1]/60"
    : "divide-amber-200/60";
  const borderClass = isLanding ? "border-[#d4c3c1]/60" : "border-amber-200/60";
  const hintClass = isLanding
    ? "text-[#504443]"
    : "text-neutral-600";
  const metaClass = isLanding ? "text-[#827472]" : "text-neutral-500";

  if (loading || !settings) {
    return <p className={`text-sm ${loadingClass}`}>{UI.LOADING}</p>;
  }

  return (
    <div className="space-y-6">
      <section className={`overflow-hidden ${cardClass}`}>
        <h2 className={headerClass}>{UI.NOTIF_BROWSER_STATUS}</h2>
        <ToggleRow
          variant={variant}
          label={UI.NOTIF_PUSH_MASTER}
          checked={pushOn}
          disabled={
            saving || osLoading || !configured || permission === "unsupported"
          }
          onChange={(v) => void handlePushMasterToggle(v)}
        />
        <p
          className={`flex items-start gap-2 border-t ${borderClass} px-4 py-3 text-xs leading-relaxed md:px-5 ${hintClass}`}
        >
          <span
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${pushOn ? "bg-green-600" : "bg-[#ba1a1a]"}`}
          />
          {statusHint}
        </p>
        {settings.pushSubscriptionCount > 0 ? (
          <p
            className={`border-t ${borderClass} px-4 py-2 text-xs md:px-5 ${metaClass}`}
          >
            {UI.NOTIF_DEVICES_REGISTERED(settings.pushSubscriptionCount)}
          </p>
        ) : null}
      </section>

      <section className={`overflow-hidden ${cardClass}`}>
        <h2 className={headerClass}>{UI.NOTIF_TYPES_TITLE}</h2>
        <div className={`divide-y ${divideClass}`}>
          <ToggleRow
            variant={variant}
            label={UI.NOTIF_DEATH_ANNIVERSARY}
            checked={settings.notificationDeathAnniversaryEnabled}
            disabled={saving}
            onChange={(v) =>
              handleToggle("notificationDeathAnniversaryEnabled", v)
            }
          />
          <ToggleRow
            variant={variant}
            label={UI.NOTIF_EVENTS}
            checked={settings.notificationEventEnabled}
            disabled={saving}
            onChange={(v) => handleToggle("notificationEventEnabled", v)}
          />
          <ToggleRow
            variant={variant}
            label={UI.NOTIF_POSTS}
            checked={settings.notificationPostEnabled}
            disabled={saving}
            onChange={(v) => handleToggle("notificationPostEnabled", v)}
          />
        </div>
      </section>

      {!isLanding ? (
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
      ) : null}
    </div>
  );
}
