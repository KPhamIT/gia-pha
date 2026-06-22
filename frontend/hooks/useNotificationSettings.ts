"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { NotificationSettings } from "@/lib/api/modules/notifications";
import { useOneSignal } from "@/hooks/useOneSignal";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";

export function useNotificationSettings(onSaved?: () => void) {
  const os = useOneSignal();
  const {
    configured,
    hasPermission,
    permission,
    subscriptionId,
    loading: osLoading,
  } = os;
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

  useEffect(() => {
    if (!configured || osLoading || !hasPermission) return;
    void os.syncSubscription().then((id) => {
      if (id) void api.notifications.getSettings().then(setSettings);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured, hasPermission, osLoading]);

  const handleToggle = useCallback(
    (key: keyof NotificationSettings, value: boolean) => {
      if (!settings) return;
      setSettings({ ...settings, [key]: value });
      setSaving(true);
      api.notifications
        .updateSettings({ [key]: value })
        .then((updated) => {
          setSettings(updated);
          notify.success(UI.NOTIF_SAVED);
          onSaved?.();
        })
        .catch((err) => notify.error(err, UI.NOTIF_ERR_SAVE))
        .finally(() => setSaving(false));
    },
    [onSaved, settings],
  );

  const handlePushMasterToggle = useCallback(
    async (enabled: boolean) => {
      if (!configured) return;
      setSaving(true);
      try {
        if (enabled) {
          const { granted, subscriptionId: newId } =
            await os.enableNotifications();
          setSettings(await api.notifications.getSettings());
          await os.refresh();
          if (granted && newId) notify.success(UI.NOTIF_SAVED);
          else if (
            typeof window !== "undefined" &&
            Notification.permission === "denied"
          )
            notify.error(null, UI.NOTIF_PERMISSION_BLOCKED);
          else notify.error(null, UI.NOTIF_PERMISSION_DENIED);
        } else {
          await os.disableNotifications();
          setSettings(await api.notifications.getSettings());
          notify.success(UI.NOTIF_SAVED);
        }
      } catch (err) {
        notify.error(err, UI.NOTIF_ERR_SAVE);
      } finally {
        setSaving(false);
      }
    },
    [configured, os],
  );

  const isDeviceRegistered =
    Boolean(subscriptionId) &&
    (settings?.pushSubscriptionIds.includes(subscriptionId!) ?? false);
  const pushOn = hasPermission && isDeviceRegistered;
  const statusHint = !configured
    ? UI.NOTIF_NOT_CONFIGURED
    : permission === "unsupported"
      ? UI.NOTIF_UNSUPPORTED
      : permission === "denied"
        ? UI.NOTIF_PERMISSION_BLOCKED
        : hasPermission
          ? UI.NOTIF_PERMISSION_GRANTED
          : UI.NOTIF_PERMISSION_DENIED;

  return {
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
  };
}
