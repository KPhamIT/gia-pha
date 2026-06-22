"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type BookSettings,
  defaultBookSettings,
  fetchRemoteBookSettings,
  loadBookSettings,
  persistRemoteBookSettings,
  saveBookSettings,
} from "./book-settings";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import { getStoredOrgAccessToken } from "@/lib/org/org-access";
import { invalidateUserSettingsCache } from "@/lib/settings/user-settings-cache";
import { useAuthStore } from "@/store/authStore";

/**
 * Book settings: backend theo user (JWT) hoặc org token (khách).
 */
export function useBookSettings() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const authLoaded = useAuthStore((s) => s.loaded);
  const [settings, setSettings] = useState<BookSettings>(defaultBookSettings);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<number | null>(null);
  const userEdited = useRef(false);
  const lastPersistedJson = useRef<string | null>(null);
  const activeUserId = useRef<number | null | undefined>(undefined);
  const activeOrgToken = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!authLoaded) return;

    let cancelled = false;
    userEdited.current = false;
    activeUserId.current = userId;
    const orgToken = userId == null ? getStoredOrgAccessToken() : null;
    activeOrgToken.current = orgToken;

    const local = loadBookSettings(userId, orgToken);
    /* eslint-disable react-hooks/set-state-in-effect */
    setSettings(local);
    lastPersistedJson.current = JSON.stringify(local);
    setHydrated(true);

    if (userId == null && !orgToken) {
      return () => {
        cancelled = true;
      };
    }

    invalidateUserSettingsCache();

    void (async () => {
      try {
        const remote = await fetchRemoteBookSettings();
        if (
          cancelled ||
          activeUserId.current !== userId ||
          activeOrgToken.current !== orgToken
        ) {
          return;
        }
        if (remote) {
          setSettings(remote);
          saveBookSettings(remote, userId, orgToken);
          lastPersistedJson.current = JSON.stringify(remote);
        }
      } catch {
        /* offline — giữ bản local */
      }
    })();
    /* eslint-enable react-hooks/set-state-in-effect */

    return () => {
      cancelled = true;
    };
  }, [authLoaded, userId]);

  useEffect(() => {
    if (!hydrated || !userEdited.current || userId == null) return;

    const json = JSON.stringify(settings);
    if (json === lastPersistedJson.current) return;

    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      const persistForUserId = userId;
      const orgToken = getStoredOrgAccessToken();
      saveBookSettings(settings, persistForUserId, orgToken);
      void persistRemoteBookSettings(settings)
        .then(() => {
          if (activeUserId.current !== persistForUserId) return;
          lastPersistedJson.current = json;
          notify.success(UI.TOAST_SAVE_SUCCESS);
        })
        .catch((error) => {
          notify.error(error, UI.ERR_SAVE_SETTINGS);
        });
    }, 500);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [settings, hydrated, userId]);

  const updateSettings = useCallback((patch: Partial<BookSettings>) => {
    userEdited.current = true;
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return { settings, updateSettings, hydrated: hydrated && authLoaded };
}
