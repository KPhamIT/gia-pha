'use client';

import { Dispatch, SetStateAction } from 'react';
import type { LayoutConfig, ThemeMode } from '@/components/types/family-tree-types';
import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { LAYOUT } from '@/lib/constants/ui-layout';
import { UI } from '@/lib/constants/ui-strings';
import OverlayPortal from '@/components/ui/OverlayPortal';
import FamilyTreeSettingsFields from './FamilyTreeSettingsFields';

interface FamilyTreeSettingsProps {
  layoutConfig: LayoutConfig;
  setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
  theme: ThemeMode;
  setTheme: Dispatch<SetStateAction<ThemeMode>>;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  saveSuccess?: boolean;
  saveError?: string | null;
}

export default function FamilyTreeSettings({
  layoutConfig,
  setLayoutConfig,
  theme,
  setTheme,
  onClose,
  onSave,
  saving = false,
  saveSuccess = false,
  saveError = null,
}: FamilyTreeSettingsProps) {
  return (
    <OverlayPortal>
      <div className={LAYOUT.sidePanelOverlay}>
        <button
          type="button"
          className="absolute inset-0 cursor-default"
          onClick={onClose}
          aria-label={UI.CLOSE_SETTINGS}
        />
        <div
          className={`${LAYOUT.sidePanel} scroll-list`}
          style={{ animation: 'slideInRight 240ms ease-out forwards' }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 md:text-lg">{UI.SETTINGS_TITLE}</h2>
              <p className="mt-1 text-xs text-slate-500">{UI.SETTINGS_XY_HINT}</p>
            </div>
            <Icon
              path="close"
              asButton
              buttonProps={{
                onClick: onClose,
                className:
                  'grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100',
                'aria-label': UI.CLOSE_SETTINGS,
              }}
              width={16}
              height={16}
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
            />
          </div>

          <FamilyTreeSettingsFields
            layoutConfig={layoutConfig}
            setLayoutConfig={setLayoutConfig}
            theme={theme}
            setTheme={setTheme}
          />

          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
            {saveError ? <p className="mb-2 text-xs text-red-500">{saveError}</p> : null}
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium text-white transition disabled:opacity-50 ${
                saveSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saving ? (
                <LoadingSpinner size={18} label={UI.SAVING_SETTINGS} />
              ) : (
                <Icon path={saveSuccess ? 'check' : 'save'} width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
              )}
              {saving ? UI.SAVING_SETTINGS : saveSuccess ? UI.SAVE_SETTINGS_SUCCESS : UI.SAVE_SETTINGS}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </OverlayPortal>
  );
}
