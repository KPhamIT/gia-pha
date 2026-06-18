'use client';

import { useCallback } from 'react';
import type { StandardFeatureKey } from '@/lib/auth/standard-features';
import { useAuthStore } from '@/store/authStore';
import { useAuthGateStore } from '@/store/authGateStore';

export function useFeatureAccess() {
  const canMutate = useAuthStore((state) => state.canMutate);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isSystem = useAuthStore((state) => state.isSystem);
  const canUseFeature = useAuthStore((state) => state.canUseFeature);
  const openAuthGate = useAuthGateStore((state) => state.open);

  const requireFeature = useCallback(
    (key: StandardFeatureKey): boolean => {
      if (canUseFeature(key)) return true;
      if (!isLoggedIn) {
        openAuthGate('login');
        return false;
      }
      openAuthGate('permission');
      return false;
    },
    [canUseFeature, isLoggedIn, openAuthGate],
  );

  const requireAdmin = useCallback((): boolean => {
    if (!isLoggedIn) {
      openAuthGate('login');
      return false;
    }
    if (!canMutate) {
      openAuthGate('admin');
      return false;
    }
    return true;
  }, [canMutate, isLoggedIn, openAuthGate]);

  return {
    isAdmin,
    isSystem,
    canMutate,
    isLoggedIn,
    canUseFeature,
    requireFeature,
    requireAdmin,
  };
}
