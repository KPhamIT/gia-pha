'use client';

import { useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useOverlayViewport } from '@/hooks/useOverlayViewport';

type Props = {
  children: ReactNode;
};

const emptySubscribe = () => () => {};

/** Renders overlays on `document.body`, outside transformed/scrolling ancestors. */
export default function OverlayPortal({ children }: Props) {
  // `false` on the server + during hydration, `true` afterwards — lets us defer
  // the portal to the client without a mount-effect setState.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  useOverlayViewport();

  if (!mounted) return null;
  return createPortal(children, document.body);
}
