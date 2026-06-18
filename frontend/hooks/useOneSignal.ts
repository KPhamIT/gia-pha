'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  getBrowserPermission,
  getSubscriptionId,
  initOneSignal,
  isOneSignalConfigured,
  isPushSubscribed,
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
    const granted = await requestPushPermission();
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

  const syncSubscription = useCallback(async () => {
    const subscriptionId = await getSubscriptionId();
    if (subscriptionId) {
      await api.notifications.updateSettings({ onesignalSubscriptionId: subscriptionId });
    }
    await refresh();
    return subscriptionId;
  }, [refresh]);

  return {
    ...state,
    refresh,
    enableNotifications,
    syncSubscription,
    hasPermission: state.permission === 'granted',
  };
}
