import type { OrgBookContext } from "@/lib/settings/default-user-settings";
import { UI } from "@/lib/constants/ui-strings";
import {
  cloneDesign,
  createEmptyDesign,
  loadCoverStudioStore,
  persistCoverStudioStore,
  type CoverDesign,
} from "./cover-studio-settings";

export function loadStudioState(ctx: OrgBookContext): {
  designs: CoverDesign[];
  draft: CoverDesign | null;
  saved: CoverDesign | null;
} {
  const store = loadCoverStudioStore(ctx);
  const initial = store.designs.find((d) => d.id === store.activeId) ?? null;
  return {
    designs: store.designs,
    draft: initial ? cloneDesign(initial) : null,
    saved: initial ? cloneDesign(initial) : null,
  };
}

export function buildDuplicate(
  source: CoverDesign,
  org: OrgBookContext | null,
): CoverDesign {
  return createEmptyDesign(org, {
    name: `${source.name} (bản sao)`,
    styleId: source.styleId,
    paletteId: source.paletteId,
    fontId: source.fontId,
    bleedMm: source.bleedMm,
    showCropMarks: source.showCropMarks,
    showSafeGuide: source.showSafeGuide,
    front: { ...source.front },
    back: { ...source.back },
  });
}

export function confirmDelete(name: string): boolean {
  return window.confirm(UI.COVER_STUDIO_DELETE_CONFIRM(name));
}

export function confirmDiscard(): boolean {
  return window.confirm(UI.COVER_STUDIO_DISCARD_CONFIRM);
}

export function persistDesigns(
  designs: CoverDesign[],
  activeId: string | null,
): void {
  persistCoverStudioStore({ designs, activeId });
}
