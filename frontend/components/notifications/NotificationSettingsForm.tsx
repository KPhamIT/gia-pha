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
  const { hasPermission, permission, loading: osLoading, enableNotifications } = useOneSignal();
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

  const handleEnablePush = async () => {
    setSaving(true);
    try {
      await enableNotifications();
      const updated = await api.notifications.getSettings();
      setSettings(updated);
      notify.success(UI.NOTIF_SAVED);
    } catch (err) {
      notify.error(err, UI.NOTIF_ERR_SAVE);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  }

  const permissionLabel =
    hasPermission ? UI.NOTIF_PERMISSION_GRANTED : UI.NOTIF_PERMISSION_DENIED;
  const permissionDot = hasPermission ? '🟢' : '🔴';

  return (
    <div className="space-y-6">
      <section className={`${BT.card} p-4`}>
        <h2 className="text-sm font-semibold">{UI.NOTIF_BROWSER_STATUS}</h2>
        <p className={`mt-2 text-sm ${BT.mutedOnLight}`}>
          {permissionDot} {permissionLabel}
        </p>
        {!hasPermission && permission !== 'unsupported' ? (
          <button
            type="button"
            className={`${BT.btnPrimary} mt-3`}
            disabled={saving || osLoading}
            onClick={() => void handleEnablePush()}
          >
            {UI.NOTIF_ENABLE}
          </button>
        ) : null}
      </section>

      <section className={`${BT.card} p-4 space-y-3`}>
        <ToggleRow
          label={UI.NOTIF_DEATH_ANNIVERSARY}
          checked={settings.notificationDeathAnniversaryEnabled}
          disabled={saving}
          onChange={(v) => handleToggle('notificationDeathAnniversaryEnabled', v)}
        />
        <ToggleRow
          label={UI.NOTIF_EVENTS}
          checked={settings.notificationEventEnabled}
          disabled={saving}
          onChange={(v) => handleToggle('notificationEventEnabled', v)}
        />
        <ToggleRow
          label={UI.NOTIF_POSTS}
          checked={settings.notificationPostEnabled}
          disabled={saving}
          onChange={(v) => handleToggle('notificationPostEnabled', v)}
        />
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/notifications" className={BT.btnGhost}>
          {UI.NOTIF_OPEN_CENTER}
        </Link>
        <Link href="/ceremonies/upcoming" className={BT.btnGhost}>
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
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        className="size-4 rounded border-amber-300"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
