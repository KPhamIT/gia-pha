"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type BookSettings,
  bookSettingsAutoSaveSnapshot,
  defaultBookSettings,
  fetchRemoteBookSettings,
  isCoverContentDirty,
  isCoverContentPatch,
  loadBookSettings,
  mergeBookSettingsForAutoPersist,
  normalizeCoverSubtitleForPersist,
  persistRemoteBookSettings,
  resolveBookSettings,
  saveBookSettings,
} from "./book-settings";
import { notify } from "@/lib/notify";
import { UI } from "@/lib/constants/ui-strings";
import { getStoredOrgAccessToken } from "@/lib/org/org-access";
import type { OrgBookContext } from "@/lib/settings/default-user-settings";
import {
  fetchOrgBookContext,
  invalidateUserSettingsCache,
} from "@/lib/settings/user-settings-cache";
import { useAuthStore } from "@/store/authStore";

const COVER_SAVE_PROMPT_MS = 5000;

function parsePersistedSettings(json: string | null): BookSettings {
  if (!json) return defaultBookSettings();
  try {
    return JSON.parse(json) as BookSettings;
  } catch {
    return defaultBookSettings();
  }
}

/**
 * Book settings: backend theo user (JWT) hoặc org token (khách).
 * Nội dung trang bìa chỉ lưu khi user bấm nút Lưu; các field khác vẫn auto-save.
 */
export function useBookSettings() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const authLoaded = useAuthStore((s) => s.loaded);
  const [settings, setSettings] = useState<BookSettings>(defaultBookSettings);
  const [hydrated, setHydrated] = useState(false);
  const [showCoverSavePrompt, setShowCoverSavePrompt] = useState(false);
  const [isSavingCover, setIsSavingCover] = useState(false);
  const [persistRevision, setPersistRevision] = useState(0);
  const saveTimer = useRef<number | null>(null);
  const coverPromptTimer = useRef<number | null>(null);
  const userEdited = useRef(false);
  const lastPersistedJson = useRef<string | null>(null);
  const activeUserId = useRef<number | null | undefined>(undefined);
  const activeOrgToken = useRef<string | null | undefined>(undefined);
  const orgContextRef = useRef<OrgBookContext | null>(null);

  const getPersistedSettings = useCallback(
    () => parsePersistedSettings(lastPersistedJson.current),
    [],
  );

  const getResolvedPersistedBaseline = useCallback(
    () => resolveBookSettings(getPersistedSettings(), orgContextRef.current),
    [getPersistedSettings],
  );

  const isCoverDirty = useMemo(
    () => isCoverContentDirty(settings, getResolvedPersistedBaseline()),
    [settings, getResolvedPersistedBaseline, persistRevision],
  );

  const hideCoverSavePrompt = useCallback(() => {
    setShowCoverSavePrompt(false);
    if (coverPromptTimer.current) {
      window.clearTimeout(coverPromptTimer.current);
      coverPromptTimer.current = null;
    }
  }, []);

  const scheduleCoverSavePrompt = useCallback(() => {
    setShowCoverSavePrompt(true);
    if (coverPromptTimer.current) window.clearTimeout(coverPromptTimer.current);
    coverPromptTimer.current = window.setTimeout(() => {
      setShowCoverSavePrompt(false);
      coverPromptTimer.current = null;
    }, COVER_SAVE_PROMPT_MS);
  }, []);

  useEffect(() => {
    if (!authLoaded) return;

    let cancelled = false;
    userEdited.current = false;
    activeUserId.current = userId;
    const orgToken = getStoredOrgAccessToken();
    activeOrgToken.current = orgToken;

    void (async () => {
      const orgContext = await fetchOrgBookContext(true);
      if (cancelled || activeUserId.current !== userId) return;

      orgContextRef.current = orgContext;
      const persisted = loadBookSettings(userId, orgToken);
      const resolved = resolveBookSettings(persisted, orgContext);

      /* eslint-disable react-hooks/set-state-in-effect */
      setSettings(resolved);
      lastPersistedJson.current = JSON.stringify(persisted);
      setHydrated(true);
      setShowCoverSavePrompt(false);
      setPersistRevision((v) => v + 1);
      /* eslint-enable react-hooks/set-state-in-effect */

      if (userId == null && !orgToken) return;

      invalidateUserSettingsCache();

      try {
        const remotePersisted = await fetchRemoteBookSettings();
        if (
          cancelled ||
          activeUserId.current !== userId ||
          activeOrgToken.current !== orgToken
        ) {
          return;
        }
        if (remotePersisted) {
          const remoteResolved = resolveBookSettings(
            remotePersisted,
            orgContext,
          );
          setSettings(remoteResolved);
          saveBookSettings(remotePersisted, userId, orgToken);
          lastPersistedJson.current = JSON.stringify(remotePersisted);
          setPersistRevision((v) => v + 1);
        }
      } catch {
        /* offline — giữ bản local */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoaded, userId]);

  useEffect(() => {
    if (!hydrated || !userEdited.current) return;

    const persisted = getPersistedSettings();
    const autoCurrent = bookSettingsAutoSaveSnapshot(settings);
    const autoPersisted = bookSettingsAutoSaveSnapshot(persisted);
    if (autoCurrent === autoPersisted) return;

    const orgToken = getStoredOrgAccessToken();
    const merged = mergeBookSettingsForAutoPersist(settings, persisted);

    const persistAuto = () => {
      saveBookSettings(merged, userId, orgToken);
      if (userId == null && !orgToken) {
        lastPersistedJson.current = JSON.stringify(merged);
        setPersistRevision((v) => v + 1);
        return;
      }

      void persistRemoteBookSettings(merged)
        .then(() => {
          if (activeUserId.current !== userId) return;
          lastPersistedJson.current = JSON.stringify(merged);
          setPersistRevision((v) => v + 1);
          notify.success(UI.TOAST_SAVE_SUCCESS);
        })
        .catch((error) => {
          notify.error(error, UI.ERR_SAVE_SETTINGS);
        });
    };

    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(persistAuto, 500);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [settings, hydrated, userId, getPersistedSettings]);

  useEffect(
    () => () => {
      if (coverPromptTimer.current) window.clearTimeout(coverPromptTimer.current);
    },
    [],
  );

  const updateSettings = useCallback(
    (patch: Partial<BookSettings>) => {
      userEdited.current = true;
      if (isCoverContentPatch(patch)) {
        scheduleCoverSavePrompt();
      }
      setSettings((prev) => ({ ...prev, ...patch }));
    },
    [scheduleCoverSavePrompt],
  );

  const saveCoverSettings = useCallback(async () => {
    if (!isCoverContentDirty(settings, getResolvedPersistedBaseline())) {
      hideCoverSavePrompt();
      return;
    }

    setIsSavingCover(true);
    const orgToken = getStoredOrgAccessToken();
    const toSave: BookSettings = {
      ...settings,
      coverSubtitle: normalizeCoverSubtitleForPersist(
        settings.coverSubtitle,
        orgContextRef.current,
      ),
    };
    saveBookSettings(toSave, userId, orgToken);

    try {
      if (userId != null || orgToken) {
        await persistRemoteBookSettings(toSave);
      }
      lastPersistedJson.current = JSON.stringify(toSave);
      setPersistRevision((v) => v + 1);
      setSettings(toSave);
      hideCoverSavePrompt();
      notify.success(UI.TOAST_SAVE_SUCCESS);
    } catch (error) {
      notify.error(error, UI.ERR_SAVE_SETTINGS);
    } finally {
      setIsSavingCover(false);
    }
  }, [settings, userId, getResolvedPersistedBaseline, hideCoverSavePrompt]);

  return {
    settings,
    updateSettings,
    hydrated: hydrated && authLoaded,
    showCoverSavePrompt,
    isCoverDirty,
    isSavingCover,
    saveCoverSettings,
  };
}
