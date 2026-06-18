'use client';

import { useCallback } from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

/** @deprecated Use useFeatureAccess for feature-aware gates. */
export function useAdminGate() {
  return useFeatureAccess();
}
