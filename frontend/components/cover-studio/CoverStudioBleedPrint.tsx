"use client";

import { UI } from "@/lib/constants/ui-strings";
import { BLEED_OPTIONS_MM } from "./cover-bleed";
import type { CoverDesign } from "./cover-studio-settings";
import styles from "./CoverStudio.module.css";

export function CoverBleedControls({
  draft,
  onPatch,
}: {
  draft: CoverDesign;
  onPatch: (patch: Partial<CoverDesign>) => void;
}) {
  return (
    <div className={styles.sectionStack}>
      <label>
        <span className={styles.fieldLabel}>{UI.COVER_STUDIO_BLEED_LABEL}</span>
        <select
          className={styles.select}
          value={draft.bleedMm}
          title={UI.COVER_STUDIO_BLEED_HINT}
          onChange={(e) =>
            onPatch({ bleedMm: Number(e.target.value) as CoverDesign["bleedMm"] })
          }
        >
          {BLEED_OPTIONS_MM.map((mm) => (
            <option key={mm} value={mm}>
              {mm} mm
            </option>
          ))}
        </select>
      </label>
      <div className={styles.checkRowGroup}>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            checked={draft.showCropMarks}
            onChange={(e) => onPatch({ showCropMarks: e.target.checked })}
          />
          {UI.COVER_STUDIO_CROP_MARKS}
        </label>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            checked={draft.showSafeGuide}
            onChange={(e) => onPatch({ showSafeGuide: e.target.checked })}
          />
          {UI.COVER_STUDIO_SAFE_GUIDE}
        </label>
      </div>
    </div>
  );
}

export function CoverPrintActions({
  onPrintFront,
  onPrintBack,
  onPrintBoth,
  onDuplicate,
  onDelete,
}: {
  onPrintFront: () => void;
  onPrintBack: () => void;
  onPrintBoth: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={styles.sectionStack}>
      <div className={styles.actions}>
        <button type="button" className={styles.actionBtn} onClick={onPrintFront}>
          {UI.COVER_STUDIO_PRINT_FRONT}
        </button>
        <button type="button" className={styles.actionBtn} onClick={onPrintBack}>
          {UI.COVER_STUDIO_PRINT_BACK}
        </button>
        <button
          type="button"
          className={styles.actionBtnPrimary}
          onClick={onPrintBoth}
        >
          {UI.COVER_STUDIO_PRINT_BOTH}
        </button>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.actionBtn} onClick={onDuplicate}>
          {UI.COVER_STUDIO_DUPLICATE}
        </button>
        <button type="button" className={styles.actionBtnDanger} onClick={onDelete}>
          {UI.COVER_STUDIO_DELETE}
        </button>
      </div>
    </div>
  );
}
