'use client';

import { useCallback, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth/session';
import {
  getFacebookAppId,
  initFacebookSdk,
  requestFacebookAccessToken,
} from '@/lib/auth/facebook-sdk';
import { UI } from '@/lib/constants/ui-strings';
import { getErrorMessage } from '@/utils/errors';

export default function FacebookLoginButton() {
  const router = useRouter();
  const appId = getFacebookAppId();
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSdkReady = useCallback(() => {
    if (!appId) return;
    initFacebookSdk(appId);
    setSdkReady(true);
  }, [appId]);

  const handleLogin = useCallback(async () => {
    if (!sdkReady) return;
    setLoading(true);
    setError(null);
    try {
      const accessToken = await requestFacebookAccessToken();
      const result = await api.auth.loginWithFacebook(accessToken);
      setToken(result.accessToken);
      router.replace('/family-tree');
    } catch (err) {
      const message = getErrorMessage(err, UI.LOGIN_ERROR_DEFAULT);
      setError(message.includes('facebook_login_cancelled') ? UI.LOGIN_FACEBOOK_CANCELLED : message);
    } finally {
      setLoading(false);
    }
  }, [router, sdkReady]);

  if (!appId) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700" role="alert">
        {UI.LOGIN_FACEBOOK_NOT_CONFIGURED}
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://connect.facebook.net/vi_VN/sdk.js"
        strategy="lazyOnload"
        onLoad={handleSdkReady}
      />
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void handleLogin()}
        disabled={!sdkReady || loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1877f2] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? UI.LOGIN_FACEBOOK_LOADING : UI.LOGIN_FACEBOOK}
      </button>
    </>
  );
}
