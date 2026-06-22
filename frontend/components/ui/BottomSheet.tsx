"use client";

import { useEffect, type ReactNode } from "react";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { dismissOverlayFocus } from "@/hooks/useOverlayViewport";
import OverlayPortal from "./OverlayPortal";

type BottomSheetProps = {
  children: ReactNode;
  onClose?: () => void;
  maxWidth?: "sm" | "md" | "lg";
  showHandle?: boolean;
  zClass?: string;
  /** Fixed-height search sheet — stays at bottom, only inner list updates. */
  variant?: "default" | "search";
};

const MAX_WIDTH: Record<NonNullable<BottomSheetProps["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

/** Bottom sheet on mobile; centered dialog on desktop (unless variant=search). */
export default function BottomSheet({
  children,
  onClose,
  maxWidth = "md",
  showHandle = true,
  zClass = "z-50",
  variant = "default",
}: BottomSheetProps) {
  const isSearch = variant === "search";
  const overlayClass = isSearch
    ? LAYOUT.bottomSheetSearchOverlay
    : LAYOUT.bottomSheetOverlay;
  const panelClass = isSearch
    ? LAYOUT.bottomSheetSearchPanel
    : `${LAYOUT.bottomSheetPanel} ${MAX_WIDTH[maxWidth]}`;

  useEffect(() => () => dismissOverlayFocus(), []);

  const handleClose = () => {
    dismissOverlayFocus();
    onClose?.();
  };

  return (
    <OverlayPortal>
      <div className={`${overlayClass} ${zClass}`}>
        {onClose ? (
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={handleClose}
            aria-label="Đóng"
          />
        ) : null}
        <div className={panelClass}>
          {showHandle ? <div className={LAYOUT.bottomSheetHandle} /> : null}
          {children}
        </div>
      </div>
    </OverlayPortal>
  );
}
