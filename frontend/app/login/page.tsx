'use client';

import { Suspense, useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import IconRoundButton from '@/components/ui/IconRoundButton';
import { BT } from '@/lib/constants/ui-theme';
import { UI } from '@/lib/constants/ui-strings';
import { loginWithZalo, setToken } from '@/lib/auth/session';
import { isZaloLoginEnabled } from '@/lib/auth/facebook-sdk';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import ContactInfoPanel from '@/components/auth/ContactInfoPanel';
import FacebookLoginButton from '@/components/auth/FacebookLoginButton';
import { inputClassName } from '@/components/ui/CollapsibleSection';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { getErrorMessage } from '@/utils/errors';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshAuth = useAuthStore((state) => state.refresh);
  const urlError = searchParams.get('error');
  const showZaloLogin = isZaloLoginEnabled();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(urlError);

  const handlePasswordLogin = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setLoading(true);
      setError(null);
      try {
        const result = await api.auth.login(username.trim(), password);
        setToken(result.accessToken);
        await refreshAuth();
        router.replace('/family-tree');
      } catch (err) {
        setError(getErrorMessage(err, UI.LOGIN_ERROR_DEFAULT));
      } finally {
        setLoading(false);
      }
    },
    [password, refreshAuth, router, username],
  );

  return (
    <div className={`flex min-h-dvh items-center justify-center px-4 ${BT.shell}`}>
      <div className={`w-full max-w-md ${BT.card} p-6 md:p-8`}>
        <h1 className="text-center text-2xl font-semibold text-amber-950">{UI.LOGIN_TITLE}</h1>
        <p className={`mt-2 text-center text-sm ${BT.mutedOnLight}`}>{UI.LOGIN_SUBTITLE}</p>

        {error ? <p className={`mt-4 ${BT.errorBgLight}`} role="alert">{error}</p> : null}

        <form className="mt-6 space-y-3" onSubmit={(e) => void handlePasswordLogin(e)}>
          <label className="block">
            <span className={`mb-1 block text-sm font-medium ${BT.mutedOnLight}`}>{UI.LOGIN_USERNAME}</span>
            <input
              className={inputClassName}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="block">
            <span className={`mb-1 block text-sm font-medium ${BT.mutedOnLight}`}>{UI.LOGIN_PASSWORD}</span>
            <input
              type="password"
              className={inputClassName}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <div className="flex justify-center pt-2">
            <IconRoundButton
              type="submit"
              icon="lock"
              variant="primary"
              iconSize={18}
              loading={loading}
              label={UI.BTN_LOGIN}
              compact={false}
            />
          </div>
        </form>

        <p className={`my-4 text-center text-xs uppercase tracking-wide ${BT.mutedOnLight}`}>{UI.LOGIN_OR}</p>

        <div className="flex flex-col items-center gap-3">
          <FacebookLoginButton />
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

        <ContactInfoPanel />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className={`flex min-h-dvh items-center justify-center ${BT.shell}`}>
          <LoadingSpinner size={40} label={UI.LOADING} />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
