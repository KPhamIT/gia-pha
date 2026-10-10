"use client";

import { DEFAULT_COVER_BADGE, DEFAULT_COVER_SEAL } from "./cover-studio-types";
import { formatCoverSubtitle } from "@/components/family-tree/book/book-cover-subtitle";
import type { CoverFrontContent } from "./cover-studio-settings";
import type { CoverPaletteId } from "./cover-templates";
import CoverOrnateFrame from "./CoverOrnateFrame";
import { coverThemeClass } from "./cover-theme-class";
import styles from "./CoverFaces.module.scss";

type CenteredFrontFaceProps = {
  paletteId: CoverPaletteId;
  fontFamily: string;
  content: CoverFrontContent;
};

function VerticalYear({
  value,
  fontFamily,
}: {
  value: string;
  fontFamily: string;
}) {
  const chars = value.trim().split("");
  return (
    <div
      className={`${styles.verticalCol} ${styles.verticalTopLeft}`}
      style={{ fontFamily }}
      aria-hidden
    >
      <span className={styles.verticalOrnament}>❖</span>
      {chars.map((ch, i) => (
        <span key={`${ch}-${i}`} className={styles.verticalChar}>
          {ch}
        </span>
      ))}
      <span className={styles.verticalOrnament}>❖</span>
    </div>
  );
}

function VerticalAddress({
  value,
  fontFamily,
}: {
  value: string;
  fontFamily: string;
}) {
  const chars = value.trim().replace(/\s+/g, " ").split("");
  return (
    <div
      className={`${styles.verticalCol} ${styles.verticalBottomRight} ${styles.verticalAddress}`}
      style={{ fontFamily }}
      aria-hidden
    >
      {chars.map((ch, i) =>
        ch === " " ? (
          <span key={`sp-${i}`} className={styles.verticalChar}>
            ·
          </span>
        ) : (
          <span key={`${ch}-${i}`} className={styles.verticalChar}>
            {ch}
          </span>
        ),
      )}
    </div>
  );
}

/** Layout khung cổ điển — đổi màu theo palette. */
export default function CenteredFrontFace({
  paletteId,
  fontFamily,
  content,
}: CenteredFrontFaceProps) {
  const subtitle = formatCoverSubtitle(content.subtitle);

  return (
    <div className={`${styles.face} ${coverThemeClass("ornate", paletteId)}`}>
      <CoverOrnateFrame />
      <VerticalYear value={content.establishedYear} fontFamily={fontFamily} />
      <VerticalAddress value={content.clanAddress} fontFamily={fontFamily} />
      <div className={styles.inner}>
        <span className={styles.badge}>{content.badge || DEFAULT_COVER_BADGE}</span>
        <h1 className={styles.title} style={{ fontFamily }}>
          {content.title.trim() || "GIA PHẢ"}
        </h1>
        <div className={styles.divider}>❖</div>
        <p className={styles.subtitle} style={{ fontFamily }}>
          {subtitle}
        </p>
        <div className={styles.seal} style={{ fontFamily }}>
          {content.sealChar || DEFAULT_COVER_SEAL}
        </div>
        <p className={styles.lineage}>{content.lineage}</p>
      </div>
    </div>
  );
}
