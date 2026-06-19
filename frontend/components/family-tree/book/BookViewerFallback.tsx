'use client';

import Icon from '@/components/icons/Icon';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import type { ReactNode } from 'react';
import OverlayPortal from '@/components/ui/OverlayPortal';
import { UI } from '@/lib/constants/ui-strings';

type BookViewerFallbackProps = {
  kind: 'loading' | 'error';
  standalone?: boolean;
  onClose?: () => void;
};

function FallbackShell({
  standalone,
  children,
}: {
  standalone?: boolean;
  children: ReactNode;
}) {
  const body = (
    <div className="flex h-dvh w-full flex-col bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50">
      {children}
    </div>
  );
  if (standalone) return body;
  return (
    <OverlayPortal>
      <div className="fixed inset-0 z-50">{body}</div>
    </OverlayPortal>
  );
}

/** Full-screen loading and error states shown before the book can render. */
export default function BookViewerFallback({
  kind,
  standalone = false,
  onClose,
}: BookViewerFallbackProps) {
  if (kind === 'loading') {
    return (
      <FallbackShell standalone={standalone}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <LoadingSpinner size={32} label={UI.LOADING} />
        </div>
      </FallbackShell>
    );
  }

  return (
    <FallbackShell standalone={standalone}>
      <header className="flex items-center gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-6">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full active:bg-white/10 md:hover:bg-white/10"
            aria-label={standalone ? UI.OPEN_FAMILY_TREE : UI.CANCEL}
          >
            <Icon
              path={standalone ? 'center' : 'arrowLeft'}
              size={22}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
          </button>
        ) : null}
        <h1 className="text-lg font-semibold md:text-xl">{UI.VIEW_GENEALOGY_BOOK}</h1>
      </header>
      <p className="px-4 text-sm text-amber-100/80 md:px-6">{UI.ERROR_TITLE}</p>
    </FallbackShell>
  );
}
