'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { UserSettings } from '@/lib/api/modules/settings';
import { UI } from '@/lib/constants/ui-strings';

type UseSettingsOptions = {
  onLoaded?: (settings: UserSettings) => void;
};

export function useSettings({ onLoaded }: UseSettingsOptions = {}) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!onLoaded) return;

    api.settings.getMine()
      .then((s) => { if (s) onLoaded(s); })
      .catch(() => {
        // No saved settings yet — keep defaults
      });
  // onLoaded intentionally excluded: run once on mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSettings = useCallback(async (data: UserSettings) => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await api.settings.upsert(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setSaveError(UI.ERR_SAVE_SETTINGS);
    } finally {
      setSaving(false);
    }
  }, []);

  return { saveSettings, saving, saveError, saveSuccess };
}
