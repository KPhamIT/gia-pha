"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  SAFE_MARGIN_MM,
  TRIM_HEIGHT_MM,
  TRIM_WIDTH_MM,
  sheetSizeMm,
} from "./cover-bleed";
import styles from "./CoverFaces.module.scss";

type CoverSheetProps = {
  bleedMm: number;
  showCropMarks: boolean;
  showSafeGuide: boolean;
  children: ReactNode;
  className?: string;
};

function CropMarks({ bleedMm }: { bleedMm: number }) {
  if (bleedMm <= 0) return null;
  const b = `var(--cover-bleed)`;
  const marks: CSSProperties[] = [
    { top: b, left: 0 },
    { top: b, right: 0 },
    { bottom: b, left: 0 },
    { bottom: b, right: 0 },
    { top: 0, left: b },
    { top: 0, right: b },
    { bottom: 0, left: b },
    { bottom: 0, right: b },
  ];
  const isH = (i: number) => i < 4;

  return (
    <div className={styles.cropMarks} aria-hidden>
      {marks.map((pos, i) => (
        <span
          key={i}
          className={`${styles.cropMark} ${isH(i) ? styles.cropH : styles.cropV}`}
          style={pos}
        />
      ))}
    </div>
  );
}

/** Tờ in: bleed ngoài + vùng cắt A4 + (tuỳ chọn) dấu cắt / safe. */
export default function CoverSheet({
  bleedMm,
  showCropMarks,
  showSafeGuide,
  children,
  className = "",
}: CoverSheetProps) {
  const sheet = sheetSizeMm(bleedMm);
  const style = {
    width: `${sheet.width}mm`,
    height: `${sheet.height}mm`,
    ["--cover-bleed" as string]: `${bleedMm}mm`,
    ["--cover-safe" as string]: `${SAFE_MARGIN_MM}mm`,
    ["--cover-trim-w" as string]: `${TRIM_WIDTH_MM}mm`,
    ["--cover-trim-h" as string]: `${TRIM_HEIGHT_MM}mm`,
  } as CSSProperties;

  return (
    <div className={`${styles.sheet} ${className}`} style={style} data-cover-sheet>
      <div className={styles.trimArea} data-cover-trim>
        {children}
      </div>
      {showSafeGuide ? <div className={styles.safeGuide} aria-hidden /> : null}
      {showCropMarks ? <CropMarks bleedMm={bleedMm} /> : null}
    </div>
  );
}
