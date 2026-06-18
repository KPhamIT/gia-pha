'use client';

import { Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { UI } from '@/lib/constants/ui-strings';
import { loginWithZalo } from '@/lib/auth/session';
import { isZaloLoginEnabled } from '@/lib/auth/facebook-sdk';
import FacebookLoginButton from '@/components/auth/FacebookLoginButton';
import LoadingSpinner from '@/components/icons/LoadingSpinner';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const showZaloLogin = isZaloLoginEnabled();

  const handleZaloLogin = useCallback(() => {
    loginWithZalo();
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-semibold text-slate-900">{UI.LOGIN_TITLE}</h1>
        <p className="mt-2 text-center text-sm text-slate-600">{UI.LOGIN_SUBTITLE}</p>

        {error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          <FacebookLoginButton />

          {showZaloLogin ? (
            <button
              type="button"
              onClick={handleZaloLogin}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0068ff] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#0056d6]"
            >
              {UI.LOGIN_ZALO}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <LoadingSpinner size={40} label={UI.LOADING} />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
