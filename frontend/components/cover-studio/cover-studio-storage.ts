import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { UI } from "@/lib/constants/ui-strings";
import { isCalligraphyFontId } from "@/components/family-tree/book/calligraphy-fonts";
import type { OrgBookContext } from "@/lib/settings/default-user-settings";
import { DEFAULT_BLEED_MM, isBleedMm } from "./cover-bleed";
import {
  DEFAULT_COVER_PALETTE_ID,
  DEFAULT_COVER_STYLE_ID,
  isCoverPaletteId,
  isCoverStyleId,
  migrateLegacyTemplate,
} from "./cover-templates";
import {
  createEmptyDesign,
  defaultBackContent,
  defaultFrontContent,
  type CoverDesign,
  type CoverStudioStore,
} from "./cover-studio-types";

function normalizeFront(
  raw: unknown,
  org?: OrgBookContext | null,
): CoverDesign["front"] {
  const d = defaultFrontContent(org);
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    title: typeof o.title === "string" ? o.title : d.title,
    subtitle: typeof o.subtitle === "string" ? o.subtitle : d.subtitle,
    lineage: typeof o.lineage === "string" ? o.lineage : d.lineage,
    establishedYear:
      typeof o.establishedYear === "string" ? o.establishedYear : d.establishedYear,
    clanAddress:
      typeof o.clanAddress === "string" ? o.clanAddress : d.clanAddress,
  };
}

function normalizeBack(
  raw: unknown,
  org?: OrgBookContext | null,
): CoverDesign["back"] {
  const d = defaultBackContent(org);
  if (!raw || typeof raw !== "object") return d;
  const o = raw as Record<string, unknown>;
  return {
    title: typeof o.title === "string" ? o.title : d.title,
    body: typeof o.body === "string" ? o.body : d.body,
    sealChar: typeof o.sealChar === "string" ? o.sealChar : d.sealChar,
    footer: typeof o.footer === "string" ? o.footer : d.footer,
  };
}

function resolveStylePalette(o: Record<string, unknown>): Pick<
  CoverDesign,
  "styleId" | "paletteId"
> {
  if (isCoverStyleId(String(o.styleId)) && isCoverPaletteId(String(o.paletteId))) {
    return {
      styleId: o.styleId as CoverDesign["styleId"],
      paletteId: o.paletteId as CoverDesign["paletteId"],
    };
  }
  if (typeof o.templateId === "string") {
    return migrateLegacyTemplate(o.templateId);
  }
  return {
    styleId: DEFAULT_COVER_STYLE_ID,
    paletteId: DEFAULT_COVER_PALETTE_ID,
  };
}

export function normalizeDesign(
  raw: unknown,
  org?: OrgBookContext | null,
): CoverDesign | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const fallback = createEmptyDesign(org);
  const { styleId, paletteId } = resolveStylePalette(o);
  const fontId =
    typeof o.fontId === "string" && isCalligraphyFontId(o.fontId)
      ? o.fontId
      : fallback.fontId;
  const bleedRaw = typeof o.bleedMm === "number" ? o.bleedMm : DEFAULT_BLEED_MM;
  const bleedMm = isBleedMm(bleedRaw) ? bleedRaw : DEFAULT_BLEED_MM;

  return {
    id: typeof o.id === "string" && o.id ? o.id : fallback.id,
    name:
      typeof o.name === "string" && o.name.trim()
        ? o.name.trim()
        : UI.COVER_STUDIO_DEFAULT_NAME,
    styleId,
    paletteId,
    fontId,
    bleedMm,
    showCropMarks: o.showCropMarks !== false,
    showSafeGuide: o.showSafeGuide !== false,
    front: normalizeFront(o.front, org),
    back: normalizeBack(o.back, org),
    updatedAt:
      typeof o.updatedAt === "string" ? o.updatedAt : new Date().toISOString(),
  };
}

export function loadCoverStudioStore(
  org?: OrgBookContext | null,
): CoverStudioStore {
  if (typeof window === "undefined") {
    return { designs: [], activeId: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COVER_STUDIO_DESIGNS);
    if (!raw) return { designs: [], activeId: null };
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const list = Array.isArray(parsed.designs) ? parsed.designs : [];
    const designs = list
      .map((item) => normalizeDesign(item, org))
      .filter((d): d is CoverDesign => Boolean(d));
    const activeId =
      typeof parsed.activeId === "string" &&
      designs.some((d) => d.id === parsed.activeId)
        ? parsed.activeId
        : null;
    return { designs, activeId };
  } catch {
    return { designs: [], activeId: null };
  }
}

export function persistCoverStudioStore(store: CoverStudioStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEYS.COVER_STUDIO_DESIGNS,
    JSON.stringify({
      designs: store.designs,
      activeId: store.activeId,
    }),
  );
}
