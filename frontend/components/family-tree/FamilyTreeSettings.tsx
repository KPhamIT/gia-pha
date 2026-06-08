'use client';

import { Dispatch, SetStateAction } from 'react';
import Icon from '../icons/Icon';

interface LayoutConfig {
  horizontalGap: number;
  verticalStep: number;
}

interface FamilyTreeSettingsProps {
  layoutConfig: LayoutConfig;
  setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
  theme: 'light' | 'dark';
  setTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
  onClose: () => void;
}

export default function FamilyTreeSettings({
  layoutConfig,
  setLayoutConfig,
  theme,
  setTheme,
  onClose,
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
              <h2 className="text-base font-semibold text-slate-900">Cài đặt</h2>
              <p className="mt-1 text-xs text-slate-500">Khoảng cách X / Y</p>
            </div>
            <Icon
              path="close"
              asButton
              buttonProps={{
                onClick: onClose,
                className: 'grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100',
                'aria-label': 'Đóng cài đặt',
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
              Chế độ hiển thị
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                <span>{theme === 'dark' ? 'Tối' : 'Sáng'}</span>
                <Icon
                  path={theme === 'dark' ? 'sun' : 'moon'}
                  asButton
                  buttonProps={{
                    onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
                    className:
                      'ml-auto rounded-full border border-slate-300 bg-white p-2 text-slate-900 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-700',
                    'aria-label': `Chuyển sang chế độ ${theme === 'dark' ? 'sáng' : 'tối'}`,
                  }}
                  width={18}
                  height={18}
                  stroke="currentColor"
                  strokeWidth={2}
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Khoảng cách ngang
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
              Khoảng cách dọc
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
