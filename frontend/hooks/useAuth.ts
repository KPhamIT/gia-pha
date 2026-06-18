'use client';

import { useCallback } from 'react';
import { api } from '@/lib/api';
import {
  clearToken,
  getToken,
  getZaloLoginUrl,
  loginWithZalo as startZaloLogin,
  logout as clearSession,
  setToken,
} from '@/lib/auth/session';
import { isZaloLoginEnabled, requestFacebookAccessToken } from '@/lib/auth/facebook-sdk';

export function useAuth() {
  const loginWithZalo = useCallback(() => {
    if (isZaloLoginEnabled()) startZaloLogin();
  }, []);

  const loginWithFacebook = useCallback(async () => {
    const accessToken = await requestFacebookAccessToken();
    const result = await api.auth.loginWithFacebook(accessToken);
    setToken(result.accessToken);
    window.location.href = '/family-tree';
  }, []);

  const logout = useCallback(() => clearSession(), []);

  return {
    isAuthenticated: Boolean(getToken()),
    isZaloLoginEnabled: isZaloLoginEnabled(),
    getZaloLoginUrl,
    loginWithZalo,
    loginWithFacebook,
    logout,
    clearToken,
  };
}
