'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { fetchUserSettings, patchUserSettingsCache } from '@/lib/settings/user-settings-cache';
import type { UserSettings } from '@/lib/api/modules/settings';
import { notify } from '@/lib/notify';
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

    fetchUserSettings()
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
      patchUserSettingsCache(data);
      setSaveSuccess(true);
      notify.success(UI.TOAST_SETTINGS_SAVED);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      setSaveError(UI.ERR_SAVE_SETTINGS);
      notify.error(error, UI.ERR_SAVE_SETTINGS);
    } finally {
      setSaving(false);
    }
  }, []);

  return { saveSettings, saving, saveError, saveSuccess };
}
