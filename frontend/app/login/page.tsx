"use client";

import { Suspense } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { useSearchParams } from "next/navigation";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import { loginWithZalo } from "@/lib/auth/session";
import { isZaloLoginEnabled } from "@/lib/auth/facebook-sdk";
import AppNavFab from "@/components/navigation/AppNavFab";
import ContactInfoPanel from "@/components/auth/ContactInfoPanel";
import PublicFooterLinks from "@/components/public/PublicFooterLinks";
import FacebookLoginButton from "@/components/auth/FacebookLoginButton";
import PasswordLoginForm from "@/components/auth/PasswordLoginForm";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { getSafeNextPath } from "@/lib/auth/safe-redirect";

function LoginContent() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const showZaloLogin = isZaloLoginEnabled();

  return (
    <div
      className={`flex min-h-dvh items-center justify-center px-4 ${BT.shell}`}
    >
      <div className={`w-full max-w-md ${BT.card} p-6 md:p-8`}>
        <h1 className="text-center text-2xl font-semibold text-amber-950">
          {UI.LOGIN_TITLE}
        </h1>
        <p className={`mt-2 text-center text-sm ${BT.mutedOnLight}`}>
          {UI.LOGIN_SUBTITLE}
        </p>

        <PasswordLoginForm nextPath={nextPath} initialError={urlError} />

        <p
          className={`my-4 text-center text-xs uppercase tracking-wide ${BT.mutedOnLight}`}
        >
          {UI.LOGIN_OR}
        </p>

        <div className="flex flex-col items-center gap-3">
          <FacebookLoginButton redirectTo={nextPath} />
          {showZaloLogin ? (
            <IconRoundButton
              icon="userPlus"
              variant="outline"
              iconSize={18}
              label={UI.BTN_ZALO}
              compact={false}
              onClick={() => loginWithZalo()}
            />
          ) : null}
        </div>

        <ContactInfoPanel variant="book" />
        <PublicFooterLinks />
      </div>

      <AppNavFab />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className={`flex min-h-dvh items-center justify-center ${BT.shell}`}
        >
          <LoadingSpinner size={40} label={UI.LOADING} />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
