'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { NotificationSettings } from '@/lib/api/modules/notifications';
import { useOneSignal } from '@/hooks/useOneSignal';
import { notify } from '@/lib/notify';
import { UI } from '@/lib/constants/ui-strings';
import { BT } from '@/lib/constants/ui-theme';

type NotificationSettingsFormProps = {
  onSaved?: () => void;
};

export default function NotificationSettingsForm({ onSaved }: NotificationSettingsFormProps) {
  const {
    configured,
    hasPermission,
    permission,
    pushActive,
    loading: osLoading,
    enableNotifications,
    disableNotifications,
  } = useOneSignal();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.notifications
      .getSettings()
      .then(setSettings)
      .catch(() => notify.error(null, UI.NOTIF_ERR_LOAD))
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = useCallback(
    async (patch: Partial<NotificationSettings>) => {
      if (!settings) return;
      setSaving(true);
      try {
        const updated = await api.notifications.updateSettings(patch);
        setSettings(updated);
        notify.success(UI.NOTIF_SAVED);
        onSaved?.();
      } catch (err) {
        notify.error(err, UI.NOTIF_ERR_SAVE);
      } finally {
        setSaving(false);
      }
    },
    [onSaved, settings],
  );

  const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
    if (!settings) return;
    const next = { ...settings, [key]: value };
    setSettings(next);
    void saveSettings({ [key]: value });
  };

  const handlePushMasterToggle = async (enabled: boolean) => {
    if (!configured) return;
    setSaving(true);
    try {
      if (enabled) {
        const { granted, subscriptionId } = await enableNotifications();
        const updated = await api.notifications.getSettings();
        setSettings(updated);
        if (granted && subscriptionId) {
          notify.success(UI.NOTIF_SAVED);
        } else if (typeof window !== 'undefined' && Notification.permission === 'denied') {
          notify.error(null, UI.NOTIF_PERMISSION_BLOCKED);
        } else {
          notify.error(null, UI.NOTIF_PERMISSION_DENIED);
        }
      } else {
        await disableNotifications();
        const updated = await api.notifications.getSettings();
        setSettings(updated);
        notify.success(UI.NOTIF_SAVED);
      }
    } catch (err) {
      notify.error(err, UI.NOTIF_ERR_SAVE);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  }

  const statusHint = !configured
    ? UI.NOTIF_NOT_CONFIGURED
    : permission === 'unsupported'
      ? UI.NOTIF_UNSUPPORTED
      : permission === 'denied'
        ? UI.NOTIF_PERMISSION_BLOCKED
        : hasPermission
          ? UI.NOTIF_PERMISSION_GRANTED
          : UI.NOTIF_PERMISSION_DENIED;

  const pushOn = pushActive || Boolean(settings.onesignalSubscriptionId);

  return (
    <div className="space-y-6">
      <section className={`overflow-hidden ${BT.card}`}>
        <h2 className="border-b border-amber-200/60 px-4 py-3 text-sm font-semibold text-neutral-900">
          {UI.NOTIF_BROWSER_STATUS}
        </h2>
        <ToggleRow
          label={UI.NOTIF_PUSH_MASTER}
          checked={pushOn}
          disabled={saving || osLoading || !configured || permission === 'unsupported'}
          onChange={(v) => void handlePushMasterToggle(v)}
        />
        <p className="flex items-start gap-2 border-t border-amber-200/60 px-4 py-3 text-xs leading-relaxed text-neutral-600">
          <span
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
              pushOn && hasPermission ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          {statusHint}
        </p>
      </section>

      <section className={`overflow-hidden ${BT.card}`}>
        <h2 className="border-b border-amber-200/60 px-4 py-3 text-sm font-semibold text-neutral-900">
          {UI.NOTIF_TYPES_TITLE}
        </h2>
        <div className="divide-y divide-amber-200/60">
          <ToggleRow
            label={UI.NOTIF_DEATH_ANNIVERSARY}
            checked={settings.notificationDeathAnniversaryEnabled}
            disabled={saving || !pushOn}
            onChange={(v) => handleToggle('notificationDeathAnniversaryEnabled', v)}
          />
          <ToggleRow
            label={UI.NOTIF_EVENTS}
            checked={settings.notificationEventEnabled}
            disabled={saving || !pushOn}
            onChange={(v) => handleToggle('notificationEventEnabled', v)}
          />
          <ToggleRow
            label={UI.NOTIF_POSTS}
            checked={settings.notificationPostEnabled}
            disabled={saving || !pushOn}
            onChange={(v) => handleToggle('notificationPostEnabled', v)}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/notifications" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOnDark}`}>
          {UI.NOTIF_OPEN_CENTER}
        </Link>
        <Link href="/ceremonies/upcoming" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOnDark}`}>
          {UI.NOTIF_OPEN_UPCOMING}
        </Link>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm text-neutral-900">
      <span className="min-w-0 flex-1">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
          checked ? 'bg-amber-600' : 'bg-neutral-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  );
}
