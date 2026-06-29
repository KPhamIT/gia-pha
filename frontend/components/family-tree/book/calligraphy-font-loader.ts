import { isCalligraphyFontId } from "./calligraphy-fonts";

type FontDef = {
  family: string;
  file: string;
};

const FONT_FILES: Record<string, FontDef> = {
  thanhcong: {
    family: "Thuphap-Thanh-Cong",
    file: "/fonts/THUPHAPTHANHCONG3a.woff2",
  },
  xuan: { family: "Thuphap-Xuan", file: "/fonts/ThuphapXuan.woff2" },
  thuphap: { family: "VNI-Thuphap", file: "/fonts/VNI-Thuphap.woff2" },
  thufap: { family: "VNI-Thufap", file: "/fonts/VNI-Thufap3.woff2" },
  thufap2: { family: "VNI-Thufap2", file: "/fonts/VNI-Thufap2.woff2" },
  thufapfan: { family: "VNI-Thufapfan", file: "/fonts/VNI-Thufapfan.woff2" },
  vnithufap: { family: "vnithufap", file: "/fonts/vnithufap.woff2" },
  vnithufap2: { family: "vnithufap2", file: "/fonts/vnithufap2.woff2" },
  vnithufapfan: { family: "vnithufapfan", file: "/fonts/vnithufapfan.woff2" },
  slogan: { family: "vnithuphapslogan", file: "/fonts/vnithuphapslogan.woff2" },
};

const injectedFamilies = new Set<string>();

/** Resolve a font id to its CSS family name + woff2 file path. */
export function getCalligraphyFontDef(fontId: string): FontDef {
  return FONT_FILES[fontId] ?? FONT_FILES.thanhcong;
}

function injectFontFace(def: FontDef): void {
  if (typeof document === "undefined" || injectedFamilies.has(def.family))
    return;

  injectedFamilies.add(def.family);
  const style = document.createElement("style");
  style.setAttribute("data-calligraphy-font", def.family);
  style.textContent = `@font-face{font-family:"${def.family}";src:url("${def.file}") format("woff2");font-weight:normal;font-style:normal;font-display:swap;}`;
  document.head.appendChild(style);
}

/** Inject @font-face for one calligraphy font (idempotent). Bỏ qua font thường. */
export function ensureCalligraphyFontLoaded(fontId: string): void {
  if (!isCalligraphyFontId(fontId)) return;
  injectFontFace(getCalligraphyFontDef(fontId));
}

/** Inject @font-face and wait until the browser can render the family. */
export async function loadCalligraphyFont(fontId: string): Promise<void> {
  if (!isCalligraphyFontId(fontId)) return;
  if (typeof document === "undefined") return;

  const def = getCalligraphyFontDef(fontId);
  injectFontFace(def);

  if (!("fonts" in document)) return;

  try {
    await document.fonts.load(`1rem "${def.family}"`);
    await document.fonts.ready;
  } catch {
    /* fall back to serif if the file is missing */
  }
}
