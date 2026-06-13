'use client';

import { Dispatch, SetStateAction } from 'react';
import type { LayoutConfig, ThemeMode } from '@/components/types/family-tree-types';
import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';

const numberInputClass =
  'mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-200';

type NumberKey = 'horizontalGap' | 'verticalStep' | 'nodeWidth' | 'nodeHeight';
type ColorKey = 'nodeBgColor' | 'nodeTextColor';

const NUMBER_FIELDS: { key: NumberKey; label: string; min: number }[] = [
  { key: 'horizontalGap', label: UI.H_GAP_LABEL, min: 0 },
  { key: 'verticalStep', label: UI.V_GAP_LABEL, min: 0 },
  { key: 'nodeWidth', label: UI.NODE_WIDTH_LABEL, min: 40 },
  { key: 'nodeHeight', label: UI.NODE_HEIGHT_LABEL, min: 40 },
];

const COLOR_FIELDS: { key: ColorKey; label: string }[] = [
  { key: 'nodeBgColor', label: UI.NODE_BG_COLOR },
  { key: 'nodeTextColor', label: UI.NODE_TEXT_COLOR },
];

type Props = {
  layoutConfig: LayoutConfig;
  setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
  theme: ThemeMode;
  setTheme: Dispatch<SetStateAction<ThemeMode>>;
};

export default function FamilyTreeSettingsFields({ layoutConfig, setLayoutConfig, theme, setTheme }: Props) {
  return (
    <div className="mt-5 space-y-4">
      <label className={labelClass}>
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

      {NUMBER_FIELDS.map(({ key, label, min }) => (
        <label key={key} className={labelClass}>
          {label}
          <input
            type="number"
            min={min}
            step={10}
            value={layoutConfig[key]}
            onChange={(event) =>
              setLayoutConfig((prev) => ({ ...prev, [key]: Math.max(min, Number(event.target.value) || min) }))
            }
            className={numberInputClass}
          />
        </label>
      ))}

      {COLOR_FIELDS.map(({ key, label }) => (
        <label key={key} className={labelClass}>
          {label}
          <div className="mt-2 flex items-center gap-2">
            <input
              type="color"
              value={layoutConfig[key]}
              onChange={(event) => setLayoutConfig((prev) => ({ ...prev, [key]: event.target.value }))}
              className="h-8 w-8 cursor-pointer rounded border border-slate-300"
            />
            <span className="font-mono text-xs text-slate-500">{layoutConfig[key]}</span>
          </div>
        </label>
      ))}
    </div>
  );
}
