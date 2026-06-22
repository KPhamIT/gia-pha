"use client";

import { create } from "zustand";
import type { AuthUser, Person } from "@/components/types/family-tree-types";
import {
  DEFAULT_STANDARD_FEATURES,
  type StandardFeatureKey,
  type StandardFeatures,
  guestCanUseFeature,
} from "@/lib/auth/standard-features";
import { api } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth/session";
import { invalidateUserSettingsCache } from "@/lib/settings/user-settings-cache";

type AuthStore = {
  user: AuthUser | null;
  person: Person | null;
  features: StandardFeatures;
  loaded: boolean;
  isSystem: boolean;
  isAdmin: boolean;
  canMutate: boolean;
  isLoggedIn: boolean;
  canUseFeature: (key: StandardFeatureKey) => boolean;
  refresh: () => Promise<void>;
  clear: () => void;
};

function deriveFlags(user: AuthUser | null) {
  const isSystem = user?.role === "SYSTEM";
  const isAdmin = user?.role === "ADMIN";
  return {
    isSystem,
    isAdmin,
    canMutate: isSystem || isAdmin,
    isLoggedIn: Boolean(user),
  };
}

function resolveFeatures(
  user: AuthUser | null,
  features?: StandardFeatures | null,
): StandardFeatures {
  if (!user) return { ...DEFAULT_STANDARD_FEATURES };
  return features ?? { ...DEFAULT_STANDARD_FEATURES };
}

/** Dedupe đồng thời nhiều lời gọi refresh() chung một request GET /auth/me. */
let refreshInflight: Promise<void> | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  person: null,
  features: { ...DEFAULT_STANDARD_FEATURES },
  loaded: false,
  isSystem: false,
  isAdmin: false,
  canMutate: false,
  isLoggedIn: false,
  canUseFeature: (key) => {
    const state = get();
    if (state.canMutate) return true;
    if (!state.isLoggedIn) return guestCanUseFeature(key);
    return state.features[key] ?? false;
  },
  refresh: () => {
    if (refreshInflight) return refreshInflight;

    refreshInflight = (async () => {
      const previousUserId = get().user?.id ?? null;
      const token = getToken();
      if (!token) {
        invalidateUserSettingsCache();
        set({
          user: null,
          person: null,
          features: { ...DEFAULT_STANDARD_FEATURES },
          loaded: true,
          ...deriveFlags(null),
        });
        return;
      }

      try {
        const me = await api.auth.me();
        const user = me.user ?? null;
        const nextUserId = user?.id ?? null;
        if (previousUserId !== nextUserId) {
          invalidateUserSettingsCache();
        }
        set({
          user,
          person: me.person ?? null,
          features: resolveFeatures(user, me.features),
          loaded: true,
          ...deriveFlags(user),
        });
      } catch {
        clearToken();
        invalidateUserSettingsCache();
        set({
          user: null,
          person: null,
          features: { ...DEFAULT_STANDARD_FEATURES },
          loaded: true,
          ...deriveFlags(null),
        });
      }
    })().finally(() => {
      refreshInflight = null;
    });

    return refreshInflight;
  },
  clear: () => {
    invalidateUserSettingsCache();
    set({
      user: null,
      person: null,
      features: { ...DEFAULT_STANDARD_FEATURES },
      loaded: true,
      ...deriveFlags(null),
    });
  },
}));
