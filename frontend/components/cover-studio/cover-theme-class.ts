import styles from "./CoverFaces.module.scss";
import type { CoverPaletteId, CoverStyleId } from "./cover-templates";

const ORNATE_THEME: Record<CoverPaletteId, string> = {
  classic: styles.themeClassic,
  elegant: styles.themeElegant,
  ivory: styles.themeIvory,
  jade: styles.themeJade,
  imperial: styles.themeImperial,
};

/** Cuốn thư — cùng 5 palette, tông màu riêng cho layout scroll. */
const SCROLL_THEME: Record<CoverPaletteId, string> = {
  classic: styles.themeScrollClassic,
  elegant: styles.themeScrollElegant,
  ivory: styles.themeScrollIvory,
  jade: styles.themeScrollJade,
  imperial: styles.themeScrollImperial,
};

export function coverThemeClass(
  styleId: CoverStyleId,
  paletteId: CoverPaletteId,
): string {
  if (styleId === "scroll") {
    return SCROLL_THEME[paletteId] ?? styles.themeScrollClassic;
  }
  return ORNATE_THEME[paletteId] ?? styles.themeClassic;
}
