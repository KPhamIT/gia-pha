'use client';

import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';
import type { BookSettings } from './book-settings';
import { CALLIGRAPHY_FONTS } from './calligraphy-fonts';
import { PAGE_BORDER_STYLES } from './page-border-styles';
import { PAGE_FORM_STYLES } from './page-form-styles';

type BookStyleControlsProps = {
  settings: BookSettings;
  onChange: (patch: Partial<BookSettings>) => void;
  onClose: () => void;
};

const selectClass =
  'w-full rounded-lg border border-amber-300/40 bg-amber-50/95 px-3 py-2 text-sm text-amber-950 outline-none focus:border-amber-500';

/** Floating panel to pick book-wide border, form layout and cover font. */
export default function BookStyleControls({ settings, onChange, onClose }: BookStyleControlsProps) {
  return (
    <>
      <button
        type="button"
        aria-label={UI.CANCEL}
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default bg-black/30"
      />
      <div className="absolute right-3 top-14 z-50 w-72 rounded-2xl border border-amber-200/60 bg-white p-4 text-slate-800 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-amber-900">{UI.BOOK_STYLE_TITLE}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full text-slate-500 active:bg-slate-100"
            aria-label={UI.CANCEL}
          >
            <Icon path="close" size={16} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
          </button>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{UI.BOOK_BORDER_STYLE_LABEL}</span>
          <select
            className={selectClass}
            value={settings.borderStyleId}
            onChange={(e) => onChange({ borderStyleId: e.target.value })}
          >
            {PAGE_BORDER_STYLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{UI.BOOK_FORM_STYLE_LABEL}</span>
          <select
            className={selectClass}
            value={settings.formStyleId}
            onChange={(e) => onChange({ formStyleId: e.target.value })}
          >
            {PAGE_FORM_STYLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">{UI.BOOK_COVER_FONT_LABEL}</span>
          <select
            className={selectClass}
            value={settings.coverFontId}
            onChange={(e) => onChange({ coverFontId: e.target.value })}
          >
            {CALLIGRAPHY_FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <p className="mt-3 text-[11px] text-slate-400">{UI.BOOK_SAVED_HINT}</p>
      </div>
    </>
  );
}
