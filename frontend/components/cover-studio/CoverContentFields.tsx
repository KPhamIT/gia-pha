"use client";

import { UI } from "@/lib/constants/ui-strings";
import type { CoverDesign } from "./cover-studio-settings";
import styles from "./CoverStudio.module.css";

export function CoverField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className={styles.fieldBlock}>
      <span className={styles.fieldLabel}>{label}</span>
      {multiline ? (
        <textarea
          className={styles.textarea}
          value={value}
          rows={2}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export function CoverFrontFields({
  draft,
  onPatchFront,
}: {
  draft: CoverDesign;
  onPatchFront: (patch: Partial<CoverDesign["front"]>) => void;
}) {
  return (
    <div className={styles.fieldsStack}>
      <CoverField
        label={UI.COVER_STUDIO_FRONT_TITLE}
        value={draft.front.title}
        onChange={(v) => onPatchFront({ title: v })}
      />
      <CoverField
        label={UI.COVER_STUDIO_FRONT_SUBTITLE}
        value={draft.front.subtitle}
        onChange={(v) => onPatchFront({ subtitle: v })}
      />
      <CoverField
        label={UI.COVER_STUDIO_FRONT_LINEAGE}
        value={draft.front.lineage}
        onChange={(v) => onPatchFront({ lineage: v })}
        multiline
      />
      <div className={styles.fieldRow}>
        <CoverField
          label={UI.COVER_STUDIO_FRONT_YEAR}
          value={draft.front.establishedYear}
          onChange={(v) => onPatchFront({ establishedYear: v })}
        />
        <CoverField
          label={UI.COVER_STUDIO_FRONT_ADDRESS}
          value={draft.front.clanAddress}
          onChange={(v) => onPatchFront({ clanAddress: v })}
        />
      </div>
    </div>
  );
}

export function CoverBackFields({
  draft,
  onPatchBack,
}: {
  draft: CoverDesign;
  onPatchBack: (patch: Partial<CoverDesign["back"]>) => void;
}) {
  return (
    <div className={styles.fieldsStack}>
      <CoverField
        label={UI.COVER_STUDIO_BACK_TITLE}
        value={draft.back.title}
        onChange={(v) => onPatchBack({ title: v })}
      />
      <CoverField
        label={UI.COVER_STUDIO_BACK_BODY}
        value={draft.back.body}
        onChange={(v) => onPatchBack({ body: v })}
        multiline
      />
      <div className={styles.fieldRow}>
        <CoverField
          label={UI.COVER_STUDIO_BACK_SEAL}
          value={draft.back.sealChar}
          onChange={(v) => onPatchBack({ sealChar: v })}
        />
        <CoverField
          label={UI.COVER_STUDIO_BACK_FOOTER}
          value={draft.back.footer}
          onChange={(v) => onPatchBack({ footer: v })}
        />
      </div>
    </div>
  );
}
