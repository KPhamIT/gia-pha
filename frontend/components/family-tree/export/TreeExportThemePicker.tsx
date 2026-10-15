"use client";

import { UI } from "@/lib/constants/ui-strings";
import {
  TREE_EXPORT_THEMES,
  type TreeExportTheme,
} from "@/lib/family-tree/tree-export-themes";
import { fieldLabel, sectionTitle, selectClass } from "./tree-export-control-bits";

type Props = {
  themeId: string | null;
  clanName: string;
  resolvedClanName: string;
  onApplyTheme: (themeId: string) => void;
  onClanNameChange: (clanName: string) => void;
};

/** Hình thu nhỏ: nền trang, dải tiêu đề màu nhấn, ba thẻ thành viên. */
function ThemeSwatch({ theme }: { theme: TreeExportTheme }) {
  const [page, accent, node] = theme.swatch;
  return (
    <svg viewBox="0 0 60 40" className="block h-auto w-full rounded" aria-hidden>
      <rect width="60" height="40" fill={page} />
      <rect x="1.5" y="1.5" width="57" height="37" fill="none" stroke={accent} strokeWidth="1" />
      <rect x="20" y="4" width="20" height="6" rx="2" fill={accent} />
      <rect x="25" y="14" width="10" height="7" rx="1" fill={accent} />
      <path d="M30 21 V25 M14 25 H46 M14 25 V28 M30 25 V28 M46 25 V28" stroke={accent} strokeWidth="0.8" fill="none" />
      {[9, 25, 41].map((x) => (
        <rect key={x} x={x} y="28" width="10" height="8" rx="1" fill={node} stroke={accent} strokeWidth="0.6" />
      ))}
    </svg>
  );
}

export default function TreeExportThemePicker({
  themeId,
  clanName,
  resolvedClanName,
  onApplyTheme,
  onClanNameChange,
}: Props) {
  return (
    <>
      <div className={sectionTitle}>{UI.EXPORT_SECTION_THEME}</div>
      <p className="mb-2 text-[11px] leading-snug text-slate-500">
        {UI.EXPORT_THEME_HINT}
      </p>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {TREE_EXPORT_THEMES.map((theme) => {
          const active = theme.id === themeId;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onApplyTheme(theme.id)}
              aria-pressed={active}
              className={`rounded-lg border p-1.5 text-left transition ${
                active
                  ? "border-amber-600 bg-amber-50 ring-2 ring-amber-500/40"
                  : "border-slate-200 bg-white hover:border-amber-300"
              }`}
            >
              <ThemeSwatch theme={theme} />
              <span className="mt-1 block truncate text-[11px] font-medium text-slate-700">
                {theme.label}
              </span>
            </button>
          );
        })}
      </div>
      <label className="mb-1 block">
        <span className={fieldLabel}>{UI.EXPORT_CLAN_NAME}</span>
        <input
          type="text"
          value={clanName}
          placeholder={resolvedClanName || "Phạm"}
          onChange={(e) => onClanNameChange(e.target.value)}
          className={selectClass}
        />
      </label>
      <p className="mb-2 text-[11px] leading-snug text-slate-400">
        {resolvedClanName
          ? `${UI.EXPORT_CLAN_NAME_SHOWING}: HỌ ${resolvedClanName.toLocaleUpperCase("vi")}`
          : UI.EXPORT_CLAN_NAME_HINT}
      </p>
    </>
  );
}
