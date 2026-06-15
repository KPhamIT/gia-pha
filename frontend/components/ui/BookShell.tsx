'use client';

import type { ReactNode } from 'react';
import { LAYOUT } from '@/lib/constants/ui-layout';

type BookShellProps = {
  children: ReactNode;
  className?: string;
  /** Wider panel for the genealogy book viewer (A4 aspect). */
  wide?: boolean;
  zClass?: string;
};

/** Full-screen book-tone shell — mobile full bleed, desktop centered panel. */
export default function BookShell({ children, className = '', wide = false, zClass = 'z-50' }: BookShellProps) {
  return (
    <div className={`${LAYOUT.overlay} ${LAYOUT.overlayBackdropDark} ${zClass}`}>
      <div
        className={`${LAYOUT.panel} ${wide ? LAYOUT.panelBookWide : ''} ${LAYOUT.panelBook} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
