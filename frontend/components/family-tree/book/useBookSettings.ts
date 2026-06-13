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
 * persist every change (debounced) to both localStorage and the backend.
 */
export function useBookSettings() {
  const [settings, setSettings] = useState<BookSettings>(defaultBookSettings);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    // 1. Instant local copy.
    const local = loadBookSettings();
    /* eslint-disable react-hooks/set-state-in-effect */
    setSettings(local);
    // 2. Reconcile with the backend, then allow saving.
    void (async () => {
      try {
        const remote = await fetchRemoteBookSettings();
        if (!cancelled && remote) {
          setSettings(remote);
          saveBookSettings(remote);
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
    if (!hydrated) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveBookSettings(settings);
      void persistRemoteBookSettings(settings).catch(() => {
        /* keep local copy if the backend is unreachable */
      });
    }, 500);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [settings, hydrated]);

  const updateSettings = useCallback((patch: Partial<BookSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return { settings, updateSettings, hydrated };
}
