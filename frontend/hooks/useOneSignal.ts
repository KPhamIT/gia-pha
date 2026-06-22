"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  ensurePushSubscribed,
  getBrowserPermission,
  getSubscriptionId,
  initOneSignal,
  isOneSignalConfigured,
  isPushSubscribed,
  optOutPush,
} from "@/lib/services/onesignal.service";

type UseOneSignalState = {
  configured: boolean;
  permission: NotificationPermission | "unsupported" | "loading";
  subscribed: boolean;
  subscriptionId: string | null;
  loading: boolean;
};

type UseOneSignalOptions = {
  /**
   * Chỉ đọc `Notification.permission`, KHÔNG init SDK OneSignal lúc mount.
   * Dùng cho banner trên trang chính (book / family-tree) để tránh tải
   * react-onesignal + đăng ký service worker trên critical path. SDK vẫn được
   * nạp lười khi người dùng thực sự bật thông báo.
   */
  lazy?: boolean;
};

export function useOneSignal({ lazy = false }: UseOneSignalOptions = {}) {
  const [state, setState] = useState<UseOneSignalState>(() => {
    const configured = isOneSignalConfigured();
    return {
      configured,
      // Khi không cấu hình OneSignal, trạng thái cuối cùng đã biết ngay từ
      // đầu — khởi tạo luôn để effect không phải setState đồng bộ.
      permission: configured ? "loading" : "unsupported",
      subscribed: false,
      subscriptionId: null,
      loading: configured,
    };
  });

  const refresh = useCallback((): Promise<void> => {
    if (!isOneSignalConfigured()) return Promise.resolve();

    if (lazy) {
      return getBrowserPermission().then((permission) => {
        setState((prev) => ({
          ...prev,
          configured: true,
          permission,
          loading: false,
        }));
      });
    }

    return initOneSignal()
      .then(() =>
        Promise.all([
          getBrowserPermission(),
          isPushSubscribed(),
          getSubscriptionId(),
        ]),
      )
      .then(([permission, subscribed, subscriptionId]) => {
        setState({
          configured: true,
          permission,
          subscribed,
          subscriptionId,
          loading: false,
        });
      });
  }, [lazy]);

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
    if (
      typeof window === "undefined" ||
      Notification.permission !== "granted"
    ) {
      return null;
    }
    const subscriptionId = await getSubscriptionId();
    if (!subscriptionId) return null;
    await api.notifications.updateSettings({
      onesignalSubscriptionId: subscriptionId,
    });
    await refresh();
    return subscriptionId;
  }, [refresh]);

  return {
    ...state,
    refresh,
    enableNotifications,
    disableNotifications,
    syncSubscription,
    hasPermission: state.permission === "granted",
  };
}
