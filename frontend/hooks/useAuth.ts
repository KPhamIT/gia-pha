'use client';

import { useCallback } from 'react';
import {
  clearToken,
  getToken,
  getZaloLoginUrl,
  loginWithZalo as startZaloLogin,
  logout as clearSession,
} from '@/lib/auth/session';

export function useAuth() {
  const loginWithZalo = useCallback(() => startZaloLogin(), []);
  const logout = useCallback(() => clearSession(), []);

  return {
    isAuthenticated: Boolean(getToken()),
    getZaloLoginUrl,
    loginWithZalo,
    logout,
    clearToken,
  };
}
