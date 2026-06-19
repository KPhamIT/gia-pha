'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function useOrgAdminAccess() {
  const router = useRouter();
  const loaded = useAuthStore((state) => state.loaded);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const refresh = useAuthStore((state) => state.refresh);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!loaded) return;
    if (!isAdmin) {
      router.replace('/book');
    }
  }, [isAdmin, loaded, router]);

  return { ready: loaded && isAdmin };
}
