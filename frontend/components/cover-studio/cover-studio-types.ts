import { UI } from "@/lib/constants/ui-strings";
import { DEFAULT_CALLIGRAPHY_FONT_ID } from "@/components/family-tree/book/calligraphy-fonts";
import type { OrgBookContext } from "@/lib/settings/default-user-settings";
import {
  resolveOrgClanAddress,
  resolveOrgEstablishedYear,
} from "@/lib/settings/default-user-settings";
import { DEFAULT_BLEED_MM, type BleedMm } from "./cover-bleed";
import {
  DEFAULT_COVER_PALETTE_ID,
  DEFAULT_COVER_STYLE_ID,
  type CoverPaletteId,
  type CoverStyleId,
} from "./cover-templates";

export type CoverSide = "front" | "back";

export type CoverFrontContent = {
  title: string;
  subtitle: string;
  lineage: string;
  establishedYear: string;
  clanAddress: string;
};

export type CoverBackContent = {
  title: string;
  body: string;
  sealChar: string;
  footer: string;
};

export type CoverDesign = {
  id: string;
  name: string;
  styleId: CoverStyleId;
  paletteId: CoverPaletteId;
  fontId: string;
  bleedMm: BleedMm;
  showCropMarks: boolean;
  showSafeGuide: boolean;
  front: CoverFrontContent;
  back: CoverBackContent;
  updatedAt: string;
};

export type CoverStudioStore = {
  designs: CoverDesign[];
  activeId: string | null;
};

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `cover-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function defaultFrontContent(
  org?: OrgBookContext | null,
): CoverFrontContent {
  return {
    title: UI.BOOK_COVER_DEFAULT_TITLE,
    subtitle: (org?.name ?? "").trim() || "Việt Nam",
    lineage: UI.BOOK_COVER_DEFAULT_LINEAGE,
    establishedYear:
      resolveOrgEstablishedYear(org) || String(new Date().getFullYear()),
    clanAddress: resolveOrgClanAddress(org),
  };
}

export function defaultBackContent(
  org?: OrgBookContext | null,
): CoverBackContent {
  const clan = (org?.name ?? "").trim() || "Việt Nam";
  return {
    title: UI.BOOK_COVER_DEFAULT_TITLE,
    body: "Gìn giữ cội nguồn – kết nối hiện tại – trao truyền giá trị cho mai sau.",
    sealChar: "譜",
    footer: `Dòng họ ${clan}`,
  };
}

export function createEmptyDesign(
  org?: OrgBookContext | null,
  partial?: Partial<CoverDesign>,
): CoverDesign {
  const base: CoverDesign = {
    id: newId(),
    name: UI.COVER_STUDIO_DEFAULT_NAME,
    styleId: DEFAULT_COVER_STYLE_ID,
    paletteId: DEFAULT_COVER_PALETTE_ID,
    fontId: DEFAULT_CALLIGRAPHY_FONT_ID,
    bleedMm: DEFAULT_BLEED_MM,
    showCropMarks: true,
    showSafeGuide: true,
    front: defaultFrontContent(org),
    back: defaultBackContent(org),
    updatedAt: new Date().toISOString(),
  };
  return {
    ...base,
    ...partial,
    id: newId(),
    front: partial?.front ? { ...base.front, ...partial.front } : base.front,
    back: partial?.back ? { ...base.back, ...partial.back } : base.back,
    updatedAt: new Date().toISOString(),
  };
}

export function cloneDesign(design: CoverDesign): CoverDesign {
  return {
    ...design,
    front: { ...design.front },
    back: { ...design.back },
  };
}

export function designsEqual(a: CoverDesign, b: CoverDesign): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
