'use client';

import type { ReactNode } from 'react';
import Icon from '@/components/icons/Icon';

type FullScreenSheetProps = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
  headerRight?: ReactNode;
};

export default function FullScreenSheet({ title, onClose, children, headerRight }: FullScreenSheetProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white pb-[env(safe-area-inset-bottom)]">
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-600 active:bg-slate-100"
          aria-label="Đóng"
        >
          <Icon path="arrowLeft" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
        {title ? <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-slate-900">{title}</h1> : <div className="flex-1" />}
        {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
