import {
  COUPLET_LINE_FACTOR,
  coupletSyllables,
  DRAGON_ASPECT,
  SCROLL_ASPECT,
  type ResolvedCouplet,
  type Rect,
} from '@/lib/family-tree/export-tree-svg';

export type DraggableId = 'scroll' | 'dragonLeft' | 'dragonRight' | 'coupletLeft' | 'coupletRight';

export type DragState = {
  id: DraggableId;
  mode: 'move' | 'resize';
  startX: number;
  startY: number;
  boxX: number;
  boxY: number;
};

export const SERIF = "'Times New Roman', 'Songti SC', serif";

const birthDateFormatter = new Intl.DateTimeFormat('vi-VN');

export function formatBirthDate(birthDate: string | null): string {
  if (!birthDate) return '';
  const d = new Date(birthDate);
  return Number.isNaN(d.getTime()) ? '' : birthDateFormatter.format(d);
}

export const IMAGE_ASPECT: Record<'scroll' | 'dragonLeft' | 'dragonRight', number> = {
  scroll: SCROLL_ASPECT,
  dragonLeft: DRAGON_ASPECT,
  dragonRight: DRAGON_ASPECT,
};

export const coupletLineGap = (fontSize: number) => fontSize * COUPLET_LINE_FACTOR;

/** Bounding rect of a couplet's vertical syllable column (x is the column centre). */
export function coupletBounds(c: ResolvedCouplet): Rect {
  const count = Math.max(coupletSyllables(c.text).length, 1);
  const lineGap = coupletLineGap(c.fontSize);
  const height = count * lineGap;
  return {
    x: c.x - c.fontSize * 1.4,
    y: c.y - c.fontSize,
    width: c.fontSize * 2.8,
    height: height + c.fontSize * 0.4,
  };
}
