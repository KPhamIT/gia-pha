"use client";

import { CALLIGRAPHY_FONTS } from "@/components/family-tree/book/calligraphy-fonts";
import { UI } from "@/lib/constants/ui-strings";
import type { CoverDesign } from "./cover-studio-settings";
import { CoverTemplatePicker } from "./CoverStudioControls";
import styles from "./CoverStudio.module.css";

export function CoverStyleSection({
  draft,
  onPatch,
}: {
  draft: CoverDesign;
  onPatch: (patch: Partial<CoverDesign>) => void;
}) {
  return (
    <div className={styles.sectionStack}>
      <label>
        <span className={styles.fieldLabel}>{UI.COVER_STUDIO_NAME_LABEL}</span>
        <input
          className={styles.input}
          value={draft.name}
          placeholder={UI.COVER_STUDIO_NAME_PLACEHOLDER}
          onChange={(e) => onPatch({ name: e.target.value })}
        />
      </label>
      <CoverTemplatePicker
        styleId={draft.styleId}
        paletteId={draft.paletteId}
        onStyleChange={(styleId) => onPatch({ styleId })}
        onPaletteChange={(paletteId) => onPatch({ paletteId })}
      />
      <label>
        <span className={styles.fieldLabel}>{UI.COVER_STUDIO_FONT_LABEL}</span>
        <select
          className={styles.select}
          value={draft.fontId}
          onChange={(e) => onPatch({ fontId: e.target.value })}
        >
          {CALLIGRAPHY_FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
