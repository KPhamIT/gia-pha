"use client";

import type { CoverBackContent } from "./cover-studio-settings";
import type { CoverPaletteId, CoverStyleId } from "./cover-templates";
import CoverOrnateFrame from "./CoverOrnateFrame";
import { coverThemeClass } from "./cover-theme-class";
import styles from "./CoverFaces.module.scss";

type BackCoverFaceProps = {
  styleId: CoverStyleId;
  paletteId: CoverPaletteId;
  fontFamily: string;
  content: CoverBackContent;
};

/** Bìa sau — theme theo loại + màu. */
export default function BackCoverFace({
  styleId,
  paletteId,
  fontFamily,
  content,
}: BackCoverFaceProps) {
  return (
    <div className={`${styles.face} ${coverThemeClass(styleId, paletteId)}`}>
      <CoverOrnateFrame />
      <div className={styles.inner}>
        <span className={styles.badge}>家 譜</span>
        <h1 className={styles.title} style={{ fontFamily }}>
          {content.title.trim() || "GIA PHẢ"}
        </h1>
        <div className={styles.divider}>❖</div>
        <div className={styles.seal} style={{ fontFamily }}>
          {content.sealChar.trim() || "譜"}
        </div>
        <p className={styles.body}>{content.body}</p>
        <p className={styles.footer} style={{ fontFamily }}>
          {content.footer}
        </p>
      </div>
    </div>
  );
}
