"use client";

import {
  coverDesignKindLabel,
  coverDesignSwatch,
} from "./cover-templates";
import type { CoverDesign } from "./cover-studio-settings";
import { UI } from "@/lib/constants/ui-strings";
import styles from "./CoverStudio.module.css";

type CoverDesignListProps = {
  designs: CoverDesign[];
  onOpen: (id: string) => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function CoverDesignList({
  designs,
  onOpen,
  onCreate,
  onDuplicate,
  onDelete,
}: CoverDesignListProps) {
  return (
    <div>
      <div className={styles.createBar}>
        <button type="button" className={styles.createBtn} onClick={onCreate}>
          {UI.COVER_STUDIO_CREATE}
        </button>
      </div>

      {designs.length === 0 ? (
        <div className={styles.emptyState}>{UI.COVER_STUDIO_EMPTY}</div>
      ) : (
        <div className={styles.listGrid}>
          {designs.map((design) => (
            <article key={design.id} className={styles.designCard}>
              <button
                type="button"
                className={styles.designThumb}
                style={{
                  background: coverDesignSwatch(design.paletteId, design.styleId),
                }}
                onClick={() => onOpen(design.id)}
                aria-label={design.name}
              >
                {design.front.title || "GIA PHẢ"}
              </button>
              <div>
                <p className={styles.designName}>{design.name}</p>
                <p className={styles.designMeta}>
                  {coverDesignKindLabel(design.styleId, design.paletteId)} ·
                  bleed {design.bleedMm}mm
                </p>
                <p className={styles.designMeta}>
                  {UI.COVER_STUDIO_UPDATED(design.updatedAt)}
                </p>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.actionBtnPrimary}
                  onClick={() => onOpen(design.id)}
                >
                  {UI.COVER_STUDIO_EDIT}
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => onDuplicate(design.id)}
                >
                  {UI.COVER_STUDIO_DUPLICATE}
                </button>
                <button
                  type="button"
                  className={styles.actionBtnDanger}
                  onClick={() => onDelete(design.id)}
                >
                  {UI.COVER_STUDIO_DELETE}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
