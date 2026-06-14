'use client';

import { BRANCH_OPTIONS, type BranchValue } from '@/lib/constants/branches';
import { UI } from '@/lib/constants/ui-strings';

type BranchPromptSheetProps = {
  onSelect: (branch: BranchValue) => void;
};

/** One-time bottom sheet asking which branch the user belongs to. */
export default function BranchPromptSheet({ onSelect }: BranchPromptSheetProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300" />
        <h2 className="text-lg font-semibold text-slate-900">{UI.BRANCH_PROMPT_TITLE}</h2>
        <p className="mt-1 text-sm text-slate-500">{UI.BRANCH_PROMPT_SUBTITLE}</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {BRANCH_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className="flex flex-col items-center gap-1 rounded-2xl border-2 border-slate-200 bg-slate-50 px-3 py-4 text-center transition hover:border-blue-400 hover:bg-blue-50 active:scale-95"
            >
              <span className="text-base font-semibold text-slate-900">{option.label}</span>
              <span className="text-xs text-slate-400">Nhánh {option.value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
