'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { setToken } from '@/lib/auth/session';
import { useAuthStore } from '@/store/authStore';

function readTokenFromHash(): string | null {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  return params.get('token');
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const refreshAuth = useAuthStore((state) => state.refresh);

  useEffect(() => {
    const complete = async () => {
      const token = readTokenFromHash();
      if (token) {
        setToken(token);
        window.history.replaceState(null, '', window.location.pathname);
        await refreshAuth();
        router.replace('/book');
        return;
      }

      router.replace(`/login?error=${encodeURIComponent(UI.LOGIN_ERROR_DEFAULT)}`);
    };

    void complete();
  }, [refreshAuth, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size={40} label={UI.LOGIN_REDIRECTING} />
        <p className="text-sm text-slate-600">{UI.LOGIN_REDIRECTING}</p>
      </div>
    </div>
  );
}
