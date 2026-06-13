/**
 * Registry of person-page form layouts. To add a new form:
 *   1. Create a component file in this folder implementing PageFormComponent.
 *   2. Append it to PAGE_FORM_STYLES below.
 */
import ClassicForm from './ClassicForm';
import ElegantForm from './ElegantForm';
import CompactForm from './CompactForm';
import type { PageFormStyle } from './types';

export type { PageFormStyle, PageFormComponent, PageFormProps } from './types';

export const PAGE_FORM_STYLES: PageFormStyle[] = [
  { id: 'classic', label: 'Cổ điển', Component: ClassicForm },
  { id: 'elegant', label: 'Trang nhã', Component: ElegantForm },
  { id: 'compact', label: 'Gọn (2 cột)', Component: CompactForm },
];

export const DEFAULT_FORM_STYLE_ID = 'classic';

export function getFormStyle(id: string): PageFormStyle {
  return PAGE_FORM_STYLES.find((s) => s.id === id) ?? PAGE_FORM_STYLES[0];
}

export function isFormStyleId(id: string): boolean {
  return PAGE_FORM_STYLES.some((s) => s.id === id);
}
