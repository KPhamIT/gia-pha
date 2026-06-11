'use client';

import { Dispatch, SetStateAction } from 'react';
import type { LayoutConfig, ThemeMode } from '../types/family-tree-types';
import Icon from '../icons/Icon';
import LoadingSpinner from '../icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';

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
    <>
      <div className="fixed inset-0 z-50 flex">
        <div
          className="absolute inset-0 bg-slate-900/40 transition-opacity duration-300"
          onClick={onClose}
        />
        <div
          className="relative ml-auto h-screen w-[220px] max-w-[220px] bg-white p-5 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-700"
          style={{ animation: 'slideInRight 240ms ease-out forwards' }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">{UI.SETTINGS_TITLE}</h2>
              <p className="mt-1 text-xs text-slate-500">{UI.SETTINGS_XY_HINT}</p>
            </div>
            <Icon
              path="close"
              asButton
              buttonProps={{
                onClick: onClose,
                className: 'grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100',
                'aria-label': UI.CLOSE_SETTINGS,
              }}
              width={16}
              height={16}
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
            />
          </div>

          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {UI.DISPLAY_MODE}
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                <span>{theme === 'dark' ? UI.THEME_DARK : UI.THEME_LIGHT}</span>
                <Icon
                  path={theme === 'dark' ? 'sun' : 'moon'}
                  asButton
                  buttonProps={{
                    onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
                    className:
                      'ml-auto rounded-full border border-slate-300 bg-white p-2 text-slate-900 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-700',
                    'aria-label': theme === 'dark' ? UI.SWITCH_TO_LIGHT : UI.SWITCH_TO_DARK,
                  }}
                  width={18}
                  height={18}
                  stroke="currentColor"
                  strokeWidth={2}
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {UI.H_GAP_LABEL}
              <input
                type="number"
                min={0}
                step={10}
                value={layoutConfig.horizontalGap}
                onChange={(event) =>
                  setLayoutConfig((prev) => ({
                    ...prev,
                    horizontalGap: Math.max(0, Number(event.target.value) || 0),
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {UI.V_GAP_LABEL}
              <input
                type="number"
                min={0}
                step={10}
                value={layoutConfig.verticalStep}
                onChange={(event) =>
                  setLayoutConfig((prev) => ({
                    ...prev,
                    verticalStep: Math.max(0, Number(event.target.value) || 0),
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {UI.NODE_BG_COLOR}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={layoutConfig.nodeBgColor}
                  onChange={(event) => setLayoutConfig((prev) => ({ ...prev, nodeBgColor: event.target.value }))}
                  className="h-8 w-8 cursor-pointer rounded border border-slate-300"
                />
                <span className="font-mono text-xs text-slate-500">{layoutConfig.nodeBgColor}</span>
              </div>
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              {UI.NODE_TEXT_COLOR}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={layoutConfig.nodeTextColor}
                  onChange={(event) => setLayoutConfig((prev) => ({ ...prev, nodeTextColor: event.target.value }))}
                  className="h-8 w-8 cursor-pointer rounded border border-slate-300"
                />
                <span className="font-mono text-xs text-slate-500">{layoutConfig.nodeTextColor}</span>
              </div>
            </label>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
            {saveError ? (
              <p className="mb-2 text-xs text-red-500">{saveError}</p>
            ) : null}
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
                <Icon
                  path={saveSuccess ? 'check' : 'save'}
                  width={16}
                  height={16}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  pointer={false}
                />
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
    </>
  );
}
