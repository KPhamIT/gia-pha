"use client";

import Link from "next/link";
import AuthRequiredSheet from "@/components/auth/AuthRequiredSheet";
import NotificationSettingsForm from "@/components/notifications/NotificationSettingsForm";
import NotificationSettingsPageHero from "@/components/notifications/NotificationSettingsPageHero";
import NotificationSettingsQuickLinks from "@/components/notifications/NotificationSettingsQuickLinks";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { UI } from "@/lib/constants/ui-strings";

export default function NotificationSettingsPageView() {
  const { loaded, isLoggedIn } = useAuthBootstrap();

  if (!loaded) {
    return (
      <AuthPageLoading message={UI.NOTIFICATIONS_SETTINGS_LOADING} />
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#fcf9f4] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#d4c3c1] bg-white p-6 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-semibold text-[#321716]">
            {UI.NOTIFICATIONS_SETTINGS_TITLE}
          </h1>
          <p className="mt-3 text-sm text-[#504443]">{UI.NOTIF_LOGIN_REQUIRED}</p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-xl bg-[#944a00] px-6 py-3 text-sm font-semibold text-white"
          >
            {UI.LOGIN_BUTTON}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ResponsiveAppPageLayout
        title={UI.NOTIF_OPEN_SETTINGS}
        backHref="/account"
      >
        <div className="mx-auto max-w-[1280px] pb-6">
          <NotificationSettingsPageHero />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <NotificationSettingsForm variant="landing" />
            </div>
            <aside className="lg:col-span-4">
              <NotificationSettingsQuickLinks />
            </aside>
          </div>
        </div>
      </ResponsiveAppPageLayout>
      <AuthRequiredSheet />
    </>
  );
}
