"use client";

import BottomSheet from "@/components/ui/BottomSheet";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

type WelcomeSheetProps = {
  onContinue: () => void;
};

/** Lời chào lần đầu vào cây gia phả — mặc định xem tất cả nhánh. */
export default function WelcomeSheet({ onContinue }: WelcomeSheetProps) {
  return (
    <BottomSheet maxWidth="md" zClass="z-[70]">
      <div className={`${LAYOUT.sheetBody} ${LAYOUT.pagePad}`}>
        <h2 className="text-center text-lg font-semibold text-slate-900 md:text-xl">
          {UI.WELCOME_SHEET_TITLE}
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
          {UI.WELCOME_SHEET_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <p className="font-medium text-amber-900">
            {UI.WELCOME_SHEET_CLOSING}
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className={`mt-6 w-full ${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`}
        >
          {UI.WELCOME_SHEET_CONTINUE}
        </button>
      </div>
    </BottomSheet>
  );
}
