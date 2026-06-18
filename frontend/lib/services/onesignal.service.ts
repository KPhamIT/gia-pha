'use client';

const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ?? '';

let initPromise: Promise<void> | null = null;

export function isOneSignalConfigured(): boolean {
  return Boolean(APP_ID);
}

export async function initOneSignal(): Promise<void> {
  if (!APP_ID || typeof window === 'undefined') return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const OneSignal = (await import('react-onesignal')).default;
    await OneSignal.init({
      appId: APP_ID,
      allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'development',
    });
  })();

  return initPromise;
}

export async function requestPushPermission(): Promise<boolean> {
  await initOneSignal();
  if (!APP_ID) return false;

  const OneSignal = (await import('react-onesignal')).default;
  await OneSignal.Slidedown.promptPush();
  const permission = await OneSignal.Notifications.permission;
  return permission;
}

export async function getSubscriptionId(): Promise<string | null> {
  await initOneSignal();
  if (!APP_ID) return null;

  const OneSignal = (await import('react-onesignal')).default;
  const id = await OneSignal.User.PushSubscription.id;
  return id ?? null;
}

export async function getBrowserPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function isPushSubscribed(): Promise<boolean> {
  await initOneSignal();
  if (!APP_ID) return false;

  const OneSignal = (await import('react-onesignal')).default;
  return OneSignal.User.PushSubscription.optedIn ?? false;
}

export async function optOutPush(): Promise<void> {
  await initOneSignal();
  if (!APP_ID) return;

  const OneSignal = (await import('react-onesignal')).default;
  await OneSignal.User.PushSubscription.optOut();
}
