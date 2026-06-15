'use client';

import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';
import { TREE_BORDER_STYLES } from '@/lib/family-tree/svg-border';
import { CALLIGRAPHY_FONTS } from '@/components/family-tree/book/calligraphy-fonts';
import type {
  ExportCoupletCfg,
  ExportImageCfg,
  TreeExportSettings,
} from '@/lib/family-tree/tree-export-settings';

type ImageKey = 'scroll' | 'dragonLeft' | 'dragonRight';
type CoupletKey = 'coupletLeft' | 'coupletRight';

type TreeExportControlsProps = {
  settings: TreeExportSettings;
  collapsed: boolean;
  exporting: boolean;
  assetsReady: boolean;
  onToggleCollapse: () => void;
  onPatch: (patch: Partial<TreeExportSettings>) => void;
  onPatchImage: (key: ImageKey, patch: Partial<ExportImageCfg>) => void;
  onPatchCouplet: (key: CoupletKey, patch: Partial<ExportCoupletCfg>) => void;
  onReset: () => void;
  onClose: () => void;
  onExport: () => void;
};

const fieldLabel = 'mb-1 block text-xs font-medium text-slate-500';
const selectClass =
  'w-full rounded-lg border border-amber-300/50 bg-amber-50/90 px-3 py-2 text-sm text-amber-950 outline-none focus:border-amber-500';
const sectionTitle = 'mt-4 mb-2 text-[11px] font-semibold uppercase tracking-wide text-amber-700';

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5 text-sm text-slate-700">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-amber-600"
      />
    </label>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-700">
      <span>{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-12 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
      />
    </label>
  );
}

export default function TreeExportControls({
  settings,
  collapsed,
  exporting,
  assetsReady,
  onToggleCollapse,
  onPatch,
  onPatchImage,
  onPatchCouplet,
  onReset,
  onClose,
  onExport,
}: TreeExportControlsProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-2 pb-2 md:inset-y-0 md:right-4 md:left-auto md:items-center md:px-0 md:py-4">
      <div className="pointer-events-auto flex max-h-[55vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-amber-200/70 bg-white/92 shadow-2xl backdrop-blur-md md:max-h-[92vh] md:w-80">
        <div className="flex shrink-0 items-center justify-between border-b border-amber-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-amber-900">{UI.EXPORT_TITLE}</h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
              aria-label={collapsed ? UI.EXPORT_TITLE : UI.EXPORT_CLOSE}
            >
              <Icon path={collapsed ? 'chevronUp' : 'chevronDown'} size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
              aria-label={UI.EXPORT_CLOSE}
            >
              <Icon path="close" size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
            </button>
          </div>
        </div>

        {collapsed ? null : (
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            <p className="mb-2 text-[11px] leading-snug text-slate-400">{UI.EXPORT_HINT}</p>

            <div className={sectionTitle}>{UI.EXPORT_SECTION_GENERAL}</div>
            <ColorRow label={UI.EXPORT_BG_COLOR} value={settings.backgroundColor} onChange={(v) => onPatch({ backgroundColor: v })} />
            <ColorRow label={UI.EXPORT_BORDER_COLOR} value={settings.borderColor} onChange={(v) => onPatch({ borderColor: v })} />
            <label className="mb-2 block">
              <span className={fieldLabel}>{UI.EXPORT_BORDER_STYLE}</span>
              <select
                className={selectClass}
                value={settings.borderStyleId}
                onChange={(e) => onPatch({ borderStyleId: e.target.value })}
              >
                {TREE_BORDER_STYLES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="mb-2 block">
              <span className={fieldLabel}>
                {UI.EXPORT_HEADER_HEIGHT}: {Math.round(settings.headerHeight)}
              </span>
              <input
                type="range"
                min={200}
                max={800}
                step={10}
                value={settings.headerHeight}
                onChange={(e) => onPatch({ headerHeight: Number(e.target.value) })}
                className="w-full accent-amber-600"
              />
            </label>

            <div className={sectionTitle}>{UI.EXPORT_SECTION_HEADER}</div>
            <Toggle label={UI.EXPORT_SHOW_SCROLL} checked={settings.scroll.visible} onChange={(v) => onPatchImage('scroll', { visible: v })} />
            <Toggle label={UI.EXPORT_SHOW_DRAGON_LEFT} checked={settings.dragonLeft.visible} onChange={(v) => onPatchImage('dragonLeft', { visible: v })} />
            <Toggle label={UI.EXPORT_SHOW_DRAGON_RIGHT} checked={settings.dragonRight.visible} onChange={(v) => onPatchImage('dragonRight', { visible: v })} />

            <div className={sectionTitle}>{UI.EXPORT_SECTION_COUPLETS}</div>
            <label className="mb-2 block">
              <span className={fieldLabel}>{UI.EXPORT_COUPLET_FONT}</span>
              <select
                className={selectClass}
                value={settings.coupletFontId}
                onChange={(e) => onPatch({ coupletFontId: e.target.value })}
              >
                {CALLIGRAPHY_FONTS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            {(['coupletLeft', 'coupletRight'] as const).map((key) => {
              const couplet = settings[key];
              const label = key === 'coupletLeft' ? UI.EXPORT_COUPLET_LEFT : UI.EXPORT_COUPLET_RIGHT;
              return (
                <div key={key} className="mb-3 rounded-lg border border-slate-200 p-2">
                  <Toggle label={label} checked={couplet.visible} onChange={(v) => onPatchCouplet(key, { visible: v })} />
                  <textarea
                    rows={2}
                    value={couplet.text}
                    placeholder={UI.EXPORT_COUPLET_PLACEHOLDER}
                    onChange={(e) => onPatchCouplet(key, { text: e.target.value })}
                    className="mt-1 w-full resize-none rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-amber-500"
                  />
                  <label className="mt-2 block">
                    <span className={fieldLabel}>
                      {UI.EXPORT_COUPLET_FONT_SIZE}: {couplet.fontSize ?? '—'}
                    </span>
                    <input
                      type="range"
                      min={20}
                      max={90}
                      step={2}
                      value={couplet.fontSize ?? 46}
                      onChange={(e) => onPatchCouplet(key, { fontSize: Number(e.target.value) })}
                      className="w-full accent-amber-600"
                    />
                  </label>
                  <ColorRow label={UI.EXPORT_COUPLET_COLOR} value={couplet.color} onChange={(v) => onPatchCouplet(key, { color: v })} />
                </div>
              );
            })}

            <button
              type="button"
              onClick={onReset}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {UI.EXPORT_RESET}
            </button>
          </div>
        )}

        <div className="shrink-0 border-t border-amber-100 p-3">
          <button
            type="button"
            onClick={onExport}
            disabled={exporting || !assetsReady}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition active:bg-amber-800 disabled:opacity-50"
          >
            <Icon path="download" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
            {exporting ? UI.EXPORT_PREPARING : !assetsReady ? UI.EXPORT_LOADING_ASSETS : UI.EXPORT_DOWNLOAD}
          </button>
        </div>
      </div>
    </div>
  );
}
