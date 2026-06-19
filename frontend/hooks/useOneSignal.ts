'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  ensurePushSubscribed,
  getBrowserPermission,
  getSubscriptionId,
  initOneSignal,
  isOneSignalConfigured,
  isPushSubscribed,
  optOutPush,
} from '@/lib/services/onesignal.service';

type UseOneSignalState = {
  configured: boolean;
  permission: NotificationPermission | 'unsupported' | 'loading';
  subscribed: boolean;
  subscriptionId: string | null;
  loading: boolean;
};

export function useOneSignal() {
  const [state, setState] = useState<UseOneSignalState>({
    configured: isOneSignalConfigured(),
    permission: 'loading',
    subscribed: false,
    subscriptionId: null,
    loading: true,
  });

  const refresh = useCallback(async () => {
    if (!isOneSignalConfigured()) {
      setState((prev) => ({
        ...prev,
        configured: false,
        permission: 'unsupported',
        subscribed: false,
        subscriptionId: null,
        loading: false,
      }));
      return;
    }

    await initOneSignal();
    const [permission, subscribed, subscriptionId] = await Promise.all([
      getBrowserPermission(),
      isPushSubscribed(),
      getSubscriptionId(),
    ]);

    setState({
      configured: true,
      permission,
      subscribed,
      subscriptionId,
      loading: false,
    });
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const enableNotifications = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const { ok, subscriptionId } = await ensurePushSubscribed();

    if (subscriptionId) {
      await api.notifications.updateSettings({
        onesignalSubscriptionId: subscriptionId,
        notificationDeathAnniversaryEnabled: true,
      });
    }

    await refresh();
    return { granted: ok, subscriptionId };
  }, [refresh]);

  const disableNotifications = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const subscriptionId = await getSubscriptionId();
    await optOutPush();
    const updated = await api.notifications.updateSettings({
      removeOnesignalSubscriptionId: subscriptionId ?? undefined,
    });
    if (updated.pushSubscriptionCount === 0) {
      await api.notifications.updateSettings({
        notificationDeathAnniversaryEnabled: false,
      });
    }
    await refresh();
  }, [refresh]);

  const syncSubscription = useCallback(async () => {
    if (typeof window === 'undefined' || Notification.permission !== 'granted') {
      return null;
    }
    const subscriptionId = await getSubscriptionId();
    if (!subscriptionId) return null;
    await api.notifications.updateSettings({ onesignalSubscriptionId: subscriptionId });
    await refresh();
    return subscriptionId;
  }, [refresh]);

  return {
    ...state,
    refresh,
    enableNotifications,
    disableNotifications,
    syncSubscription,
    hasPermission: state.permission === 'granted',
  };
}
