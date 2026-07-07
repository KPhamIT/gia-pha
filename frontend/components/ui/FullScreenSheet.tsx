"use client";

import type { ReactNode } from "react";
import Icon from "@/components/icons/Icon";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { UI } from "@/lib/constants/ui-strings";
import { dismissOverlayFocus } from "@/hooks/useOverlayViewport";
import OverlayPortal from "./OverlayPortal";

type SheetTone = "light" | "book" | "heritage";

type FullScreenSheetProps = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
  headerRight?: ReactNode;
  /** 'book' = amber gradient; 'heritage' = chocolate brown; 'light' = white. */
  tone?: SheetTone;
};

export default function FullScreenSheet({
  title,
  onClose,
  children,
  headerRight,
  tone = "book",
}: FullScreenSheetProps) {
  const isBook = tone === "book";
  const isHeritage = tone === "heritage";
  const panelClass = isHeritage
    ? LAYOUT.panelHeritage
    : isBook
      ? LAYOUT.panelBook
      : LAYOUT.panelLight;
  const headerClass = isHeritage
    ? LAYOUT.sheetHeaderHeritage
    : isBook
      ? LAYOUT.sheetHeaderBook
      : LAYOUT.sheetHeaderLight;
  const backBtnClass = isHeritage
    ? "text-[#f3f0eb] active:bg-white/10 md:hover:bg-white/10"
    : isBook
      ? "text-amber-50 active:bg-white/10 md:hover:bg-white/10"
      : "text-slate-600 active:bg-slate-100 md:hover:bg-slate-100";
  const titleClass = isHeritage
    ? "font-serif text-white"
    : isBook
      ? "text-amber-50"
      : "text-slate-900";
  const backdropClass =
    isBook || isHeritage
      ? LAYOUT.overlayBackdropDark
      : LAYOUT.overlayBackdropLight;

  const handleClose = () => {
    dismissOverlayFocus();
    onClose();
  };

  return (
    <OverlayPortal>
      <div className={`${LAYOUT.overlay} ${backdropClass}`}>
        <div className={`${LAYOUT.panel} ${panelClass}`}>
          <header className={`${LAYOUT.sheetHeader} ${headerClass}`}>
            <button
              type="button"
              onClick={handleClose}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors md:h-10 md:w-10 ${backBtnClass}`}
              aria-label={UI.CLOSE}
            >
              <Icon
                path="arrowLeft"
                size={22}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                pointer={false}
              />
            </button>
            {title ? (
              <h1
                className={`min-w-0 flex-1 truncate text-lg font-semibold md:text-xl ${titleClass}`}
              >
                {title}
              </h1>
            ) : (
              <div className="flex-1" />
            )}
            {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
          </header>
          <div className={LAYOUT.sheetBody}>{children}</div>
        </div>
      </div>
    </OverlayPortal>
  );
}
