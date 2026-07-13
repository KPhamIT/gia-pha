"use client";

import type { CoverFrontContent } from "./cover-studio-settings";
import type { CoverPaletteId } from "./cover-templates";
import CoverCenserArt from "./CoverCenserArt";
import { coverThemeClass } from "./cover-theme-class";
import styles from "./CoverFaces.module.scss";

type HeritageFrontFaceProps = {
  paletteId: CoverPaletteId;
  fontFamily: string;
  content: CoverFrontContent;
};

/** Bìa cuốn thư — đổi màu theo palette. */
export default function HeritageFrontFace({
  paletteId,
  fontFamily,
  content,
}: HeritageFrontFaceProps) {
  const subtitle = content.subtitle.trim()
    ? `Dòng họ ${content.subtitle.trim()}`
    : "Dòng họ";

  return (
    <div className={`${styles.face} ${coverThemeClass("scroll", paletteId)}`}>
      <div className={styles.heritageScallop} aria-hidden />
      <div className={styles.heritagePanel}>
        <div className={styles.heritageGoldFrame} aria-hidden />
        <span className={`${styles.heritageFiligree} ${styles.filigreeTL}`} />
        <span className={`${styles.heritageFiligree} ${styles.filigreeTR}`} />
        <span className={`${styles.heritageFiligree} ${styles.filigreeBL}`} />
        <span className={`${styles.heritageFiligree} ${styles.filigreeBR}`} />

        <div className={styles.heritageStack}>
          <span className={styles.badge}>家 譜</span>
          <h1 className={styles.heritageTitle} style={{ fontFamily }}>
            {content.title.trim() || "GIA PHẢ"}
          </h1>
          <div className={styles.divider}>❖</div>
          <p className={styles.heritageSubtitle} style={{ fontFamily }}>
            {subtitle}
          </p>

          <CoverCenserArt className={styles.heritageCenser} />

          <p className={styles.heritageLineage}>{content.lineage}</p>
          <p className={styles.heritageMeta}>
            {[content.establishedYear, content.clanAddress]
              .map((s) => s.trim())
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
}
