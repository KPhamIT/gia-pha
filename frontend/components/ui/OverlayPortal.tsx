'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useOverlayViewport } from '@/hooks/useOverlayViewport';

type Props = {
  children: ReactNode;
};

/** Renders overlays on `document.body`, outside transformed/scrolling ancestors. */
export default function OverlayPortal({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  useOverlayViewport();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
