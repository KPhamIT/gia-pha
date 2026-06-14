'use client';

import type { ReactNode } from 'react';
import Icon from '@/components/icons/Icon';

type SheetTone = 'light' | 'book';

type FullScreenSheetProps = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
  headerRight?: ReactNode;
  /** 'book' uses the genealogy-book amber gradient background. */
  tone?: SheetTone;
};

export default function FullScreenSheet({ title, onClose, children, headerRight, tone = 'light' }: FullScreenSheetProps) {
  const isBook = tone === 'book';
  // Matches the genealogy-book pages manager: amber gradient + white content.
  const rootClass = isBook
    ? 'bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50'
    : 'bg-white';
  const headerClass = isBook ? 'border-amber-100/10' : 'border-slate-200';
  const backBtnClass = isBook ? 'text-amber-50 active:bg-white/10' : 'text-slate-600 active:bg-slate-100';
  const titleClass = isBook ? 'text-amber-50' : 'text-slate-900';

  return (
    <div className={`fixed inset-0 z-50 flex flex-col pb-[env(safe-area-inset-bottom)] ${rootClass}`}>
      <header className={`flex shrink-0 items-center gap-3 border-b px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] ${headerClass}`}>
        <button
          type="button"
          onClick={onClose}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${backBtnClass}`}
          aria-label="Đóng"
        >
          <Icon path="arrowLeft" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
        {title ? <h1 className={`min-w-0 flex-1 truncate text-lg font-semibold ${titleClass}`}>{title}</h1> : <div className="flex-1" />}
        {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
