type FontDef = {
  family: string;
  file: string;
};

const FONT_FILES: Record<string, FontDef> = {
  thanhcong: { family: 'Thuphap-Thanh-Cong', file: '/fonts/THUPHAPTHANHCONG3a.woff2' },
  xuan: { family: 'Thuphap-Xuan', file: '/fonts/ThuphapXuan.woff2' },
  thuphap: { family: 'VNI-Thuphap', file: '/fonts/VNI-Thuphap.woff2' },
  thufap: { family: 'VNI-Thufap', file: '/fonts/VNI-Thufap3.woff2' },
  thufap2: { family: 'VNI-Thufap2', file: '/fonts/VNI-Thufap2.woff2' },
  thufapfan: { family: 'VNI-Thufapfan', file: '/fonts/VNI-Thufapfan.woff2' },
  vnithufap: { family: 'vnithufap', file: '/fonts/vnithufap.woff2' },
  vnithufap2: { family: 'vnithufap2', file: '/fonts/vnithufap2.woff2' },
  vnithufapfan: { family: 'vnithufapfan', file: '/fonts/vnithufapfan.woff2' },
  slogan: { family: 'vnithuphapslogan', file: '/fonts/vnithuphapslogan.woff2' },
};

const loadedFamilies = new Set<string>();

/** Resolve a font id to its CSS family name + woff2 file path. */
export function getCalligraphyFontDef(fontId: string): FontDef {
  return FONT_FILES[fontId] ?? FONT_FILES.thanhcong;
}

/** Inject @font-face for one calligraphy font (idempotent). */
export function ensureCalligraphyFontLoaded(fontId: string): void {
  if (typeof document === 'undefined') return;

  const def = FONT_FILES[fontId] ?? FONT_FILES.thanhcong;
  if (loadedFamilies.has(def.family)) return;

  loadedFamilies.add(def.family);
  const style = document.createElement('style');
  style.textContent = `@font-face{font-family:"${def.family}";src:url("${def.file}") format("woff2");font-weight:normal;font-style:normal;font-display:swap;}`;
  document.head.appendChild(style);
}
