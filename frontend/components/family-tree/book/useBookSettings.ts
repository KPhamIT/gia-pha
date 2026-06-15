'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type BookSettings,
  defaultBookSettings,
  fetchRemoteBookSettings,
  loadBookSettings,
  persistRemoteBookSettings,
  saveBookSettings,
} from './book-settings';

/**
 * Book settings live in the user's backend settings (cross-device) with
 * localStorage as an instant cache / offline fallback.
 *
 * Flow: show the local copy immediately → reconcile with the backend → then
 * persist only after the user edits (debounced).
 */
export function useBookSettings() {
  const [settings, setSettings] = useState<BookSettings>(defaultBookSettings);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<number | null>(null);
  const userEdited = useRef(false);
  const lastPersistedJson = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const local = loadBookSettings();
    /* eslint-disable react-hooks/set-state-in-effect */
    setSettings(local);
    lastPersistedJson.current = JSON.stringify(local);

    void (async () => {
      try {
        const remote = await fetchRemoteBookSettings();
        if (!cancelled && remote) {
          setSettings(remote);
          saveBookSettings(remote);
          lastPersistedJson.current = JSON.stringify(remote);
        }
      } catch {
        /* offline or unauthenticated — keep the local copy */
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    /* eslint-enable react-hooks/set-state-in-effect */

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !userEdited.current) return;

    const json = JSON.stringify(settings);
    if (json === lastPersistedJson.current) return;

    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveBookSettings(settings);
      void persistRemoteBookSettings(settings)
        .then(() => {
          lastPersistedJson.current = json;
        })
        .catch(() => {
          /* keep local copy if the backend is unreachable */
        });
    }, 500);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [settings, hydrated]);

  const updateSettings = useCallback((patch: Partial<BookSettings>) => {
    userEdited.current = true;
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return { settings, updateSettings, hydrated };
}
