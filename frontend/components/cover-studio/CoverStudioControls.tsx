"use client";

import { UI } from "@/lib/constants/ui-strings";
import {
  COVER_PALETTES,
  COVER_STYLES,
  type CoverPaletteId,
  type CoverStyleId,
} from "./cover-templates";
import styles from "./CoverStudio.module.css";

export function CoverTemplatePicker({
  styleId,
  paletteId,
  onStyleChange,
  onPaletteChange,
}: {
  styleId: CoverStyleId;
  paletteId: CoverPaletteId;
  onStyleChange: (id: CoverStyleId) => void;
  onPaletteChange: (id: CoverPaletteId) => void;
}) {
  return (
    <div className={styles.pickerStack}>
      <label>
        <span className={styles.fieldLabel}>{UI.COVER_STUDIO_STYLE_LABEL}</span>
        <select
          className={styles.select}
          value={styleId}
          onChange={(e) => onStyleChange(e.target.value as CoverStyleId)}
        >
          {COVER_STYLES.map((style) => (
            <option key={style.id} value={style.id}>
              {style.label}
            </option>
          ))}
        </select>
      </label>

      <div>
        <span className={styles.fieldLabel}>{UI.COVER_STUDIO_PALETTE_LABEL}</span>
        <div className={styles.paletteRow} role="listbox">
          {COVER_PALETTES.map((palette) => {
            const active = paletteId === palette.id;
            const swatch =
              styleId === "scroll" && palette.id === "classic"
                ? "linear-gradient(160deg, #e07828, #c45a18)"
                : palette.swatch;
            return (
              <button
                key={palette.id}
                type="button"
                role="option"
                aria-selected={active}
                title={palette.label}
                aria-label={palette.label}
                className={
                  active ? styles.paletteDotActive : styles.paletteDot
                }
                style={{ background: swatch }}
                onClick={() => onPaletteChange(palette.id)}
              />
            );
          })}
        </div>
        <p className={styles.paletteActiveLabel}>
          {COVER_PALETTES.find((p) => p.id === paletteId)?.label}
        </p>
      </div>
    </div>
  );
}
