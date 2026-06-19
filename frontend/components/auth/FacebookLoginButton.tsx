'use client';

import { useCallback, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import IconRoundButton from '@/components/ui/IconRoundButton';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth/session';
import { useAuthStore } from '@/store/authStore';
import {
  getFacebookAppId,
  initFacebookSdk,
  requestFacebookAccessToken,
} from '@/lib/auth/facebook-sdk';
import { BT } from '@/lib/constants/ui-theme';
import { UI } from '@/lib/constants/ui-strings';
import { getErrorMessage } from '@/utils/errors';

export default function FacebookLoginButton() {
  const router = useRouter();
  const refreshAuth = useAuthStore((state) => state.refresh);
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
      await refreshAuth();
      router.replace('/book');
    } catch (err) {
      const message = getErrorMessage(err, UI.LOGIN_ERROR_DEFAULT);
      setError(message.includes('facebook_login_cancelled') ? UI.LOGIN_FACEBOOK_CANCELLED : message);
    } finally {
      setLoading(false);
    }
  }, [router, sdkReady, refreshAuth]);

  if (!appId) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800" role="alert">
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
      {error ? <p className={BT.errorBgLight} role="alert">{error}</p> : null}
      <IconRoundButton
        icon="userPlus"
        variant="outline"
        iconSize={18}
        loading={loading}
        disabled={!sdkReady}
        label={UI.BTN_FACEBOOK}
        compact={false}
        onClick={() => void handleLogin()}
      />
    </>
  );
}
