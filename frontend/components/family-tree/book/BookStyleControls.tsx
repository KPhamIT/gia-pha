"use client";

import Icon from "@/components/icons/Icon";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { UI } from "@/lib/constants/ui-strings";
import type { BookSettings } from "./book-settings";
import { CALLIGRAPHY_FONTS } from "./calligraphy-fonts";
import { ensureCalligraphyFontLoaded } from "./calligraphy-font-loader";
import { PAGE_BORDER_STYLES } from "./page-border-styles";
import { PAGE_FORM_STYLES } from "./page-form-styles";
import {
  getPageBackground,
  PAGE_BACKGROUNDS,
  PAGE_BACKGROUND_WASH_MAX,
  PAGE_BACKGROUND_WASH_MIN,
} from "./page-backgrounds";

type BookStyleControlsProps = {
  settings: BookSettings;
  onChange: (patch: Partial<BookSettings>) => void;
  onClose: () => void;
};

const selectClass =
  "w-full rounded-lg border border-amber-300/40 bg-amber-50/95 px-3 py-2 text-sm text-amber-950 outline-none focus:border-amber-500";

/** Floating panel to pick book-wide border, form layout and cover font. */
export default function BookStyleControls({
  settings,
  onChange,
  onClose,
}: BookStyleControlsProps) {
  const hasPatternedBg = Boolean(
    getPageBackground(settings.pageBackgroundId).url,
  );

  return (
    <div className="overlay-viewport z-40 flex items-end justify-center md:items-center md:bg-black/40 md:p-6">
      <button
        type="button"
        aria-label={UI.CANCEL}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        className={`relative w-full max-w-sm rounded-t-2xl border border-amber-200/60 bg-white text-slate-800 shadow-2xl md:rounded-2xl ${LAYOUT.pagePad}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-amber-900 md:text-base">
            {UI.BOOK_STYLE_TITLE}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full text-slate-500 active:bg-slate-100 md:h-9 md:w-9 md:hover:bg-slate-100"
            aria-label={UI.CLOSE}
          >
            <Icon
              path="close"
              size={16}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
          </button>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-medium text-slate-500">
            {UI.BOOK_PAGE_BACKGROUND_LABEL}
          </span>
          <select
            className={selectClass}
            value={settings.pageBackgroundId}
            onChange={(e) => onChange({ pageBackgroundId: e.target.value })}
          >
            {PAGE_BACKGROUNDS.map((bg) => (
              <option key={bg.id} value={bg.id}>
                {bg.label}
              </option>
            ))}
          </select>
        </label>

        {hasPatternedBg ? (
          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-medium text-slate-500">
              {UI.BOOK_PAGE_BACKGROUND_WASH_LABEL}: {settings.pageBackgroundWash}
              %
            </span>
            <input
              type="range"
              min={PAGE_BACKGROUND_WASH_MIN}
              max={PAGE_BACKGROUND_WASH_MAX}
              step={5}
              value={settings.pageBackgroundWash}
              onChange={(e) =>
                onChange({ pageBackgroundWash: Number(e.target.value) })
              }
              className="w-full accent-amber-700"
            />
            <span className="mt-1 block text-[11px] text-slate-400">
              {UI.BOOK_PAGE_BACKGROUND_WASH_HINT}
            </span>
          </label>
        ) : null}

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-medium text-slate-500">
            {UI.BOOK_BORDER_STYLE_LABEL}
          </span>
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
          <span className="mb-1 block text-xs font-medium text-slate-500">
            {UI.BOOK_FORM_STYLE_LABEL}
          </span>
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

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-medium text-slate-500">
            {UI.BOOK_COVER_FONT_LABEL}
          </span>
          <select
            className={selectClass}
            value={settings.coverFontId}
            onChange={(e) => {
              const coverFontId = e.target.value;
              ensureCalligraphyFontLoaded(coverFontId);
              onChange({ coverFontId });
            }}
          >
            {CALLIGRAPHY_FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-500">
            {UI.BOOK_SHOW_PAGE_NUMBERS_LABEL}
          </span>
          <select
            className={selectClass}
            value={settings.showPageNumbers ? "on" : "off"}
            onChange={(e) =>
              onChange({ showPageNumbers: e.target.value === "on" })
            }
          >
            <option value="on">{UI.BOOK_SHOW_PAGE_NUMBERS_ON}</option>
            <option value="off">{UI.BOOK_SHOW_PAGE_NUMBERS_OFF}</option>
          </select>
          <span className="mt-1 block text-[11px] text-slate-400">
            {UI.BOOK_SHOW_PAGE_NUMBERS_HINT}
          </span>
        </label>

        <p className="mt-3 text-[11px] text-slate-400">{UI.BOOK_SAVED_HINT}</p>
      </div>
    </div>
  );
}
