'use client';

import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { useSettings } from '@/hooks/useSettings';
import type { UserSettings } from '@/lib/api/modules/settings';
import type { LayoutConfig, ThemeMode } from '@/components/types/family-tree-types';
import type { StandardFeatureKey } from '@/lib/auth/standard-features';

type Args = {
  theme: ThemeMode;
  layoutConfig: LayoutConfig;
  setTheme: (theme: ThemeMode) => void;
  setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
  requireFeature: (key: StandardFeatureKey) => boolean;
};

/** Loads saved user settings into theme/layout on mount and exposes a save action. */
export function useTreeSettingsSync({ theme, layoutConfig, setTheme, setLayoutConfig, requireFeature }: Args) {
  const { saveSettings, saving, saveError, saveSuccess } = useSettings({
    onLoaded: (saved: UserSettings) => {
      if (typeof saved.theme === 'string') setTheme(saved.theme as ThemeMode);
      setLayoutConfig((prev) => ({
        ...prev,
        ...(typeof saved.horizontalGap === 'number' && { horizontalGap: saved.horizontalGap }),
        ...(typeof saved.verticalStep === 'number' && { verticalStep: saved.verticalStep }),
        ...(typeof saved.nodeWidth === 'number' && { nodeWidth: saved.nodeWidth }),
        ...(typeof saved.nodeHeight === 'number' && { nodeHeight: saved.nodeHeight }),
        ...(typeof saved.nodeBgColor === 'string' && { nodeBgColor: saved.nodeBgColor }),
        ...(typeof saved.nodeTextColor === 'string' && { nodeTextColor: saved.nodeTextColor }),
      }));
    },
  });

  const handleSaveSettings = useCallback(() => {
    if (!requireFeature('settings')) return;
    void saveSettings({ theme, ...layoutConfig });
  }, [layoutConfig, requireFeature, saveSettings, theme]);

  return { handleSaveSettings, savingSettings: saving, settingsSaveError: saveError, saveSuccess };
}
