"use client";

const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ?? "";

let initPromise: Promise<void> | null = null;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export function isOneSignalConfigured(): boolean {
  return Boolean(APP_ID);
}

async function loadOneSignal() {
  await initOneSignal();
  if (!APP_ID) return null;
  const OneSignal = (await import("react-onesignal")).default;
  return OneSignal;
}

export async function initOneSignal(): Promise<void> {
  if (!APP_ID || typeof window === "undefined") return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const OneSignal = (await import("react-onesignal")).default;
    await OneSignal.init({
      appId: APP_ID,
      allowLocalhostAsSecureOrigin: process.env.NODE_ENV === "development",
    });
  })();

  return initPromise;
}

async function waitForSubscriptionId(maxMs = 8000): Promise<string | null> {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    const id = await getSubscriptionId();
    if (id) return id;
    await sleep(250);
  }
  return null;
}

/** Opt-in + lấy subscription ID (kể cả khi trình duyệt đã Allow trước đó). */
export async function ensurePushSubscribed(): Promise<{
  ok: boolean;
  subscriptionId: string | null;
}> {
  const OneSignal = await loadOneSignal();
  if (
    !OneSignal ||
    typeof window === "undefined" ||
    !("Notification" in window)
  ) {
    return { ok: false, subscriptionId: null };
  }

  if (Notification.permission === "default") {
    await OneSignal.Slidedown.promptPush();
  }

  if (Notification.permission !== "granted") {
    return { ok: false, subscriptionId: null };
  }

  if (!OneSignal.User.PushSubscription.optedIn) {
    await OneSignal.User.PushSubscription.optIn();
  }

  const subscriptionId = await waitForSubscriptionId();
  return { ok: Boolean(subscriptionId), subscriptionId };
}

export async function requestPushPermission(): Promise<boolean> {
  const { ok } = await ensurePushSubscribed();
  return ok;
}

export async function getSubscriptionId(): Promise<string | null> {
  const OneSignal = await loadOneSignal();
  if (!OneSignal) return null;
  const id = await OneSignal.User.PushSubscription.id;
  return id ?? null;
}

export async function getBrowserPermission(): Promise<
  NotificationPermission | "unsupported"
> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export async function isPushSubscribed(): Promise<boolean> {
  const OneSignal = await loadOneSignal();
  if (!OneSignal) return false;
  return OneSignal.User.PushSubscription.optedIn ?? false;
}

export async function optOutPush(): Promise<void> {
  const OneSignal = await loadOneSignal();
  if (!OneSignal) return;
  await OneSignal.User.PushSubscription.optOut();
}

export async function optInPush(): Promise<void> {
  const OneSignal = await loadOneSignal();
  if (!OneSignal) return;
  await OneSignal.User.PushSubscription.optIn();
}
