// Registry of Vietnamese calligraphy (thư pháp) fonts available for the book.
// Each cssValue references an @font-face declared in app/globals.css.

export type CalligraphyFont = {
  id: string;
  label: string;
  /** Ready-to-use CSS font-family value. */
  cssValue: string;
};

export const CALLIGRAPHY_FONTS: CalligraphyFont[] = [
  { id: 'thanhcong', label: 'Thư Pháp Thành Công', cssValue: '"Thuphap-Thanh-Cong", serif' },
  { id: 'xuan', label: 'Thư Pháp Xuân', cssValue: '"Thuphap-Xuan", serif' },
  { id: 'thuphap', label: 'VNI Thư Pháp', cssValue: '"VNI-Thuphap", serif' },
  { id: 'thufap', label: 'VNI Thư Pháp 3', cssValue: '"VNI-Thufap", serif' },
  { id: 'thufap2', label: 'VNI Thư Pháp 2', cssValue: '"VNI-Thufap2", serif' },
  { id: 'thufapfan', label: 'VNI Thư Pháp Fan', cssValue: '"VNI-Thufapfan", serif' },
  { id: 'vnithufap', label: 'Thư Pháp Mềm', cssValue: '"vnithufap", serif' },
  { id: 'vnithufap2', label: 'Thư Pháp Mềm 2', cssValue: '"vnithufap2", serif' },
  { id: 'vnithufapfan', label: 'Thư Pháp Mềm Fan', cssValue: '"vnithufapfan", serif' },
  { id: 'slogan', label: 'Thư Pháp Slogan', cssValue: '"vnithuphapslogan", serif' },
];

export const DEFAULT_CALLIGRAPHY_FONT_ID = 'thanhcong';

export function getCalligraphyFont(id: string): CalligraphyFont {
  return CALLIGRAPHY_FONTS.find((f) => f.id === id) ?? CALLIGRAPHY_FONTS[0];
}
