'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  getBrowserPermission,
  getSubscriptionId,
  initOneSignal,
  isOneSignalConfigured,
  isPushSubscribed,
  optInPush,
  optOutPush,
  requestPushPermission,
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
    let granted = await requestPushPermission();
    if (!granted && typeof window !== 'undefined' && Notification.permission === 'granted') {
      await optInPush();
      granted = true;
    }
    const subscriptionId = granted ? await getSubscriptionId() : null;

    if (subscriptionId) {
      await api.notifications.updateSettings({
        onesignalSubscriptionId: subscriptionId,
        notificationDeathAnniversaryEnabled: true,
      });
    }

    await refresh();
    return { granted, subscriptionId };
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
    const subscriptionId = await getSubscriptionId();
    if (!subscriptionId) return null;
    const subscribed = await isPushSubscribed();
    if (!subscribed) return null;
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
    pushActive: state.subscribed && state.permission === 'granted',
  };
}
