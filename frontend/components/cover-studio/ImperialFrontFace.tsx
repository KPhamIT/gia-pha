"use client";

import type { CoverFrontContent } from "./cover-studio-settings";
import type { CoverPaletteId } from "./cover-templates";
import CoverOrnateFrame from "./CoverOrnateFrame";
import { coverThemeClass } from "./cover-theme-class";
import styles from "./CoverFaces.module.scss";

type ImperialFrontFaceProps = {
  paletteId: CoverPaletteId;
  fontFamily: string;
  content: CoverFrontContent;
};

/**
 * Bố cục chữ của màu imperial (không cột dọc, năm/địa chỉ ở chân).
 * Không dùng hình rồng.
 */
export default function ImperialFrontFace({
  paletteId,
  fontFamily,
  content,
}: ImperialFrontFaceProps) {
  const subtitle = content.subtitle.trim()
    ? `Dòng họ ${content.subtitle.trim()}`
    : "Dòng họ";

  return (
    <div className={`${styles.face} ${coverThemeClass("ornate", paletteId)}`}>
      <CoverOrnateFrame />
      <div className={styles.inner}>
        <span className={styles.badge}>家 譜</span>
        <h1 className={styles.title} style={{ fontFamily }}>
          {content.title.trim() || "GIA PHẢ"}
        </h1>
        <div className={styles.divider}>❖</div>
        <p className={styles.subtitle} style={{ fontFamily }}>
          {subtitle}
        </p>
        <div className={styles.seal} style={{ fontFamily }}>
          譜
        </div>
        <p className={styles.lineage}>{content.lineage}</p>
        <p className={styles.footer}>
          {[content.establishedYear, content.clanAddress]
            .map((s) => s.trim())
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </div>
  );
}
