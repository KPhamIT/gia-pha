"use client";

import { useState } from "react";
import { UI } from "@/lib/constants/ui-strings";
import type { CoverDesign, CoverSide } from "./cover-studio-settings";
import { CoverBackFields, CoverFrontFields } from "./CoverContentFields";
import { CoverStyleSection } from "./CoverStyleSection";
import {
  CoverBleedControls,
  CoverPrintActions,
} from "./CoverStudioBleedPrint";
import styles from "./CoverStudio.module.css";

type PanelSection = "style" | "content" | "print";

type CoverStudioFormPanelProps = {
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
  onPrintFront: () => void;
  onPrintBack: () => void;
  onPrintBoth: () => void;
};

const SECTIONS = [
  ["style", UI.COVER_STUDIO_SECTION_STYLE],
  ["content", UI.COVER_STUDIO_SECTION_CONTENT],
  ["print", UI.COVER_STUDIO_SECTION_PRINT],
] as const;

export default function CoverStudioFormPanel(props: CoverStudioFormPanelProps) {
  const { draft, side, isDirty, onSideChange, onPatch, onBack, onSave } = props;
  const [section, setSection] = useState<PanelSection>("content");

  return (
    <aside className={styles.panel}>
      <div className={styles.panelToolbar}>
        <button type="button" className={styles.actionBtn} onClick={onBack}>
          {UI.COVER_STUDIO_BACK_SHORT}
        </button>
        <button
          type="button"
          className={styles.actionBtnPrimary}
          onClick={onSave}
          disabled={!isDirty}
        >
          {isDirty ? UI.COVER_STUDIO_SAVE : UI.COVER_STUDIO_SAVED}
        </button>
      </div>

      <div className={styles.sectionTabs} role="tablist">
        {SECTIONS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={section === id}
            className={
              section === id ? styles.sectionTabActive : styles.sectionTab
            }
            onClick={() => setSection(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.panelBody}>
        {section === "style" ? (
          <CoverStyleSection draft={draft} onPatch={onPatch} />
        ) : null}

        {section === "content" ? (
          <div className={styles.sectionStack}>
            <div className={styles.sideTabs}>
              <button
                type="button"
                className={
                  side === "front" ? styles.sideTabActive : styles.sideTab
                }
                onClick={() => onSideChange("front")}
              >
                {UI.COVER_STUDIO_SIDE_FRONT}
              </button>
              <button
                type="button"
                className={
                  side === "back" ? styles.sideTabActive : styles.sideTab
                }
                onClick={() => onSideChange("back")}
              >
                {UI.COVER_STUDIO_SIDE_BACK}
              </button>
            </div>
            {side === "front" ? (
              <CoverFrontFields
                draft={draft}
                onPatchFront={props.onPatchFront}
              />
            ) : (
              <CoverBackFields draft={draft} onPatchBack={props.onPatchBack} />
            )}
          </div>
        ) : null}

        {section === "print" ? (
          <div className={styles.sectionStack}>
            <CoverBleedControls draft={draft} onPatch={onPatch} />
            <CoverPrintActions
              onPrintFront={props.onPrintFront}
              onPrintBack={props.onPrintBack}
              onPrintBoth={props.onPrintBoth}
              onDuplicate={props.onDuplicate}
              onDelete={props.onDelete}
            />
          </div>
        ) : null}
      </div>
    </aside>
  );
}
