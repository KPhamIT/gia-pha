"use client";

import { Dispatch, SetStateAction } from "react";
import type {
  LayoutConfig,
  ThemeMode,
} from "@/components/types/family-tree-types";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import OverlayPortal from "@/components/ui/OverlayPortal";
import FamilyTreeSettingsFields from "./FamilyTreeSettingsFields";

interface FamilyTreeSettingsProps {
  layoutConfig: LayoutConfig;
  setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>;
  theme: ThemeMode;
  setTheme: Dispatch<SetStateAction<ThemeMode>>;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  saveSuccess?: boolean;
  saveError?: string | null;
}

export default function FamilyTreeSettings({
  layoutConfig,
  setLayoutConfig,
  theme,
  setTheme,
  onClose,
  onSave,
  saving = false,
  saveSuccess = false,
  saveError = null,
}: FamilyTreeSettingsProps) {
  return (
    <OverlayPortal>
      <div
        className={`${LAYOUT.sidePanelOverlay} ${LAYOUT.overlayBackdropDark}`}
      >
        <button
          type="button"
          className="absolute inset-0 cursor-default"
          onClick={onClose}
          aria-label={UI.CLOSE_SETTINGS}
        />
        <div
          className={`${LAYOUT.sidePanel} ${BT.shell} scroll-list border-amber-100/10`}
          style={{ animation: "slideInRight 240ms ease-out forwards" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-amber-50 md:text-lg"></h2>
              <p className={`mt-1 text-xs ${BT.mutedOnDark}`}>
                {UI.SETTINGS_XY_HINT}
              </p>
            </div>
            <IconRoundButton
              icon="close"
              variant="ghost"
              label={UI.CANCEL}
              onClick={onClose}
            />
          </div>

          <div className={`mt-4 ${BT.card} p-4`}>
            <FamilyTreeSettingsFields
              layoutConfig={layoutConfig}
              setLayoutConfig={setLayoutConfig}
              theme={theme}
              setTheme={setTheme}
            />
          </div>

          <div className="mt-6 border-t border-amber-100/10 pt-4">
            {saveError ? (
              <p className={`mb-2 text-xs ${BT.error}`}>{saveError}</p>
            ) : null}
            <div className="flex justify-end">
              <IconRoundButton
                icon={saveSuccess ? "check" : "save"}
                variant="gold"
                loading={saving}
                label={UI.SAVE}
                onClick={onSave}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </OverlayPortal>
  );
}
