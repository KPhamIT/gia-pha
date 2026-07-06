"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import Icon from "@/components/icons/Icon";
import CeremonyTemplatesManager from "@/components/ceremonies/CeremonyTemplatesManager";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import AuthPageLoading from "@/components/ui/AuthPageLoading";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { useAuthStore } from "@/store/authStore";
import { UI } from "@/lib/constants/ui-strings";

export default function CeremonyTemplatesPageView() {
  const { loaded, isLoggedIn } = useAuthBootstrap();
  const canEdit = useAuthStore((state) => state.canMutate);
  const openCreateRef = useRef<(() => void) | null>(null);

  const handleCreateRef = useCallback((openCreate: () => void) => {
    openCreateRef.current = openCreate;
  }, []);

  if (!loaded) {
    return <AuthPageLoading message={UI.CEREMONY_TEMPLATES_LOADING} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#fcf9f4] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#d4c3c1] bg-white p-6 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-semibold text-[#321716]">
            {UI.CEREMONY_TEMPLATES_TITLE}
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

  const fab = canEdit ? (
    <button
      type="button"
      onClick={() => openCreateRef.current?.()}
      className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/20 bg-[#321716] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 md:hidden"
      aria-label={UI.CEREMONY_TEMPLATE_CREATE}
    >
      <Icon
        path="plus"
        size={28}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        pointer={false}
      />
    </button>
  ) : null;

  return (
    <ResponsiveAppPageLayout
      title={UI.CEREMONY_TEMPLATES_TITLE}
      backHref="/book"
      fab={fab}
    >
      <CeremonyTemplatesManager onCreateRef={handleCreateRef} />
    </ResponsiveAppPageLayout>
  );
}
