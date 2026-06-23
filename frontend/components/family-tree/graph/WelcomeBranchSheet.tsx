"use client";

import BottomSheet from "@/components/ui/BottomSheet";
import { BRANCH_OPTIONS, type BranchValue } from "@/lib/constants/branches";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { UI } from "@/lib/constants/ui-strings";

type WelcomeBranchSheetProps = {
  onSelect: (branch: BranchValue) => void;
};

/** First-visit welcome message and branch selection. */
export default function WelcomeBranchSheet({
  onSelect,
}: WelcomeBranchSheetProps) {
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

        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="text-base font-semibold text-slate-900">
            {UI.BRANCH_PROMPT_TITLE}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {UI.BRANCH_PROMPT_SUBTITLE}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {BRANCH_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className="flex flex-col items-center gap-1 rounded-2xl border-2 border-amber-200 bg-amber-50/60 px-3 py-4 text-center transition hover:border-amber-400 hover:bg-amber-50 active:scale-95"
              >
                <span className="text-sm font-semibold text-slate-900">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
