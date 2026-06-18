'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UI } from '@/lib/constants/ui-strings';
import { useAuthStore } from '@/store/authStore';

export function useSystemAccess() {
  const router = useRouter();
  const loaded = useAuthStore((state) => state.loaded);
  const isSystem = useAuthStore((state) => state.isSystem);
  const refresh = useAuthStore((state) => state.refresh);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!loaded) return;
    if (!isSystem) {
      router.replace('/family-tree');
    }
  }, [isSystem, loaded, router]);

  return { ready: loaded && isSystem };
}

export function systemRoleLabel(role: string): string {
  if (role === 'SYSTEM') return UI.SYSTEM_ROLE_SYSTEM;
  if (role === 'ADMIN') return UI.SYSTEM_ROLE_ADMIN;
  return UI.SYSTEM_ROLE_STANDARD;
}
