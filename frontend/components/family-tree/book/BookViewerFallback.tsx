'use client';

import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';

/** Full-screen loading and error states shown before the book can render. */
export default function BookViewerFallback({ kind, onClose }: { kind: 'loading' | 'error'; onClose: () => void }) {
  if (kind === 'loading') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-amber-950/95 text-amber-50">
        <LoadingSpinner size={32} label={UI.LOADING} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-amber-950/95 text-amber-50">
      <header className="flex items-center gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full active:bg-white/10" aria-label={UI.CANCEL}>
          <Icon path="arrowLeft" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
        <h1 className="text-lg font-semibold">{UI.VIEW_GENEALOGY_BOOK}</h1>
      </header>
      <p className="px-4 text-sm text-amber-100/80">{UI.ERROR_TITLE}</p>
    </div>
  );
}
