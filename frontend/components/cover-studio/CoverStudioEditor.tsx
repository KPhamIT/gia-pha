"use client";

import { useEffect } from "react";
import { getCalligraphyFont } from "@/components/family-tree/book/calligraphy-fonts";
import { loadCalligraphyFont } from "@/components/family-tree/book/calligraphy-font-loader";
import { UI } from "@/lib/constants/ui-strings";
import type { CoverDesign, CoverSide } from "./cover-studio-settings";
import BackCoverFace from "./BackCoverFace";
import CoverPreview from "./CoverPreview";
import CoverSheet from "./CoverSheet";
import CoverStudioFormPanel from "./CoverStudioFormPanel";
import FrontCoverFace from "./FrontCoverFace";
import { useCoverPrint } from "./useCoverPrint";
import styles from "./CoverStudio.module.css";

type CoverStudioEditorProps = {
  draft: CoverDesign;
  side: CoverSide;
  isDirty: boolean;
  onSideChange: (side: CoverSide) => void;
  onPatch: (patch: Partial<CoverDesign>) => void;
  onPatchFront: (patch: Partial<CoverDesign["front"]>) => void;
  onPatchBack: (patch: Partial<CoverDesign["back"]>) => void;
  onSave: () => void;
  onBack: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

export default function CoverStudioEditor({
  draft,
  side,
  isDirty,
  onSideChange,
  onPatch,
  onPatchFront,
  onPatchBack,
  onSave,
  onBack,
  onDuplicate,
  onDelete,
}: CoverStudioEditorProps) {
  const fontFamily = getCalligraphyFont(draft.fontId).cssValue;
  const { printMode, print } = useCoverPrint(draft);

  useEffect(() => {
    void loadCalligraphyFont(draft.fontId);
  }, [draft.fontId]);

  const face =
    side === "front" ? (
      <FrontCoverFace
        styleId={draft.styleId}
        paletteId={draft.paletteId}
        fontFamily={fontFamily}
        content={draft.front}
      />
    ) : (
      <BackCoverFace
        styleId={draft.styleId}
        paletteId={draft.paletteId}
        fontFamily={fontFamily}
        content={draft.back}
      />
    );

  return (
    <div className={styles.workspace}>
      <CoverStudioFormPanel
        draft={draft}
        side={side}
        isDirty={isDirty}
        onSideChange={onSideChange}
        onPatch={onPatch}
        onPatchFront={onPatchFront}
        onPatchBack={onPatchBack}
        onSave={onSave}
        onBack={onBack}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onPrintFront={() => void print("front")}
        onPrintBack={() => void print("back")}
        onPrintBoth={() => void print("both")}
      />

      <section className={styles.previewPane}>
        <p className={styles.previewHint}>{UI.COVER_STUDIO_PREVIEW_HINT}</p>
        <CoverPreview bleedMm={draft.bleedMm}>
          <CoverSheet
            bleedMm={draft.bleedMm}
            showCropMarks={draft.showCropMarks}
            showSafeGuide={draft.showSafeGuide}
          >
            {face}
          </CoverSheet>
        </CoverPreview>
      </section>

      {printMode ? (
        <div className={styles.printRoot} aria-hidden>
          {(printMode === "front" || printMode === "both") && (
            <div className={styles.printPage}>
              <CoverSheet
                bleedMm={draft.bleedMm}
                showCropMarks={draft.showCropMarks}
                showSafeGuide={false}
              >
                <FrontCoverFace
                  styleId={draft.styleId}
                  paletteId={draft.paletteId}
                  fontFamily={fontFamily}
                  content={draft.front}
                />
              </CoverSheet>
            </div>
          )}
          {(printMode === "back" || printMode === "both") && (
            <div className={styles.printPage}>
              <CoverSheet
                bleedMm={draft.bleedMm}
                showCropMarks={draft.showCropMarks}
                showSafeGuide={false}
              >
                <BackCoverFace
                  styleId={draft.styleId}
                  paletteId={draft.paletteId}
                  fontFamily={fontFamily}
                  content={draft.back}
                />
              </CoverSheet>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
