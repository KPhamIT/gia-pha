"use client";

import { createPortal } from "react-dom";
import BackCoverFace from "@/components/cover-studio/BackCoverFace";
import CoverSheet from "@/components/cover-studio/CoverSheet";
import FrontCoverFace from "@/components/cover-studio/FrontCoverFace";
import type { CoverContent, CoverSample } from "@/components/shop/cover-samples";
import styles from "./PrintBooks.module.css";

/** Bìa trước + bìa sau khổ A4 + lề tràn, kèm dấu cắt — gắn thẳng vào <body> lúc in. */
export default function CoverPrintSheets({
  sample,
  content,
  fontFamily,
  bleedMm,
}: {
  sample: CoverSample;
  content: CoverContent;
  fontFamily: string;
  bleedMm: number;
}) {
  return createPortal(
    <div className={`${styles.coverPrintRoot} ${styles.offscreen}`} data-print-root="true" aria-hidden>
      <div className={styles.coverPrintPage}>
        <CoverSheet bleedMm={bleedMm} showCropMarks showSafeGuide={false}>
          <FrontCoverFace {...sample} fontFamily={fontFamily} content={content.front} />
        </CoverSheet>
      </div>
      <div className={styles.coverPrintPage}>
        <CoverSheet bleedMm={bleedMm} showCropMarks showSafeGuide={false}>
          <BackCoverFace {...sample} fontFamily={fontFamily} content={content.back} />
        </CoverSheet>
      </div>
    </div>,
    document.body,
  );
}
