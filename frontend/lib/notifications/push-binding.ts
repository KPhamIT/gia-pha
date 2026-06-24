"use client";

import { api } from "@/lib/api";
import {
  getSubscriptionId,
  isOneSignalConfigured,
  isPushSubscribed,
} from "@/lib/services/onesignal.service";

/**
 * Gắn lại subscription OneSignal của thiết bị này sang user vừa đăng nhập.
 *
 * Cùng một thiết bị có thể lần lượt được nhiều account (khác org) dùng. Backend
 * upsert theo `onesignalSubscriptionId` nên gọi với token của user mới sẽ
 * chuyển binding sang user/org mới. Nếu thiết bị đang bật push thì bật luôn nhắc
 * giỗ cho user mới để thông báo tiếp tục hoạt động.
 */
export async function rebindPushAfterLogin(): Promise<void> {
  if (typeof window === "undefined" || !isOneSignalConfigured()) return;
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }
  try {
    const subscriptionId = await getSubscriptionId();
    if (!subscriptionId) return;
    const optedIn = await isPushSubscribed();
    await api.notifications.updateSettings({
      onesignalSubscriptionId: subscriptionId,
      ...(optedIn ? { notificationDeathAnniversaryEnabled: true } : {}),
    });
  } catch {
    // best-effort — không chặn luồng đăng nhập nếu đồng bộ thất bại
  }
}

/**
 * Gỡ subscription của thiết bị này khỏi user sắp đăng xuất, để user cũ không
 * còn nhận thông báo của thiết bị nữa. Giữ nguyên quyền trình duyệt + opt-in của
 * OneSignal để user kế tiếp re-bind mà không phải xin quyền lại.
 *
 * Phải gọi khi token của user cũ còn hiệu lực (trước khi clear token).
 */
export async function unbindPushBeforeLogout(): Promise<void> {
  if (typeof window === "undefined" || !isOneSignalConfigured()) return;
  try {
    const subscriptionId = await getSubscriptionId();
    if (!subscriptionId) return;
    await api.notifications.updateSettings({
      removeOnesignalSubscriptionId: subscriptionId,
    });
  } catch {
    // best-effort — vẫn đăng xuất kể cả khi gỡ binding thất bại
  }
}
