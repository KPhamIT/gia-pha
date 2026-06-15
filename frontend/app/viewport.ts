import type { Viewport } from 'next';

/** Lock page zoom on iOS — graph/book have their own pinch-zoom; avoids stuck zoom after focusing inputs. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};
