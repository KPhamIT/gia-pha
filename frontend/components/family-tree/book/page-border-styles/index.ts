/**
 * Registry of page border styles. To add a new border:
 *   1. Create a component file in this folder (see PlainBorder.tsx).
 *   2. Add decorative classes to ../Book.module.css if needed.
 *   3. Append it to PAGE_BORDER_STYLES below.
 */
import PlainBorder from './PlainBorder';
import ClassicBorder from './ClassicBorder';
import DoubleBorder from './DoubleBorder';
import OrnateBorder from './OrnateBorder';
import CloudBorder from './CloudBorder';
import ModernBorder from './ModernBorder';
import type { PageBorderStyle } from './types';

export type { PageBorderStyle, PageBorderComponent, PageBorderProps } from './types';

export const PAGE_BORDER_STYLES: PageBorderStyle[] = [
  { id: 'classic', label: 'Cổ điển', Component: ClassicBorder },
  { id: 'double', label: 'Khung kép', Component: DoubleBorder },
  { id: 'ornate', label: 'Hoa văn góc', Component: OrnateBorder },
  { id: 'cloud', label: 'Mây bo tròn', Component: CloudBorder },
  { id: 'modern', label: 'Tối giản', Component: ModernBorder },
  { id: 'plain', label: 'Không viền', Component: PlainBorder },
];

export const DEFAULT_BORDER_STYLE_ID = 'classic';

export function getBorderStyle(id: string): PageBorderStyle {
  return PAGE_BORDER_STYLES.find((s) => s.id === id) ?? PAGE_BORDER_STYLES[0];
}

export function isBorderStyleId(id: string): boolean {
  return PAGE_BORDER_STYLES.some((s) => s.id === id);
}
