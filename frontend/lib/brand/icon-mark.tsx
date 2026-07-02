/** Shared brand mark for favicon / PWA icons (ImageResponse / OG). */
export const BRAND_ICON_BG = "#78350f";
export const BRAND_ICON_FG = "#fef3c7";
export const BRAND_ICON_GLYPH = "家";

type BrandIconMarkProps = {
  fontSize: number;
  borderRadius?: number;
};

export function BrandIconMark({
  fontSize,
  borderRadius = 0,
}: BrandIconMarkProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_ICON_BG,
        color: BRAND_ICON_FG,
        fontSize,
        fontWeight: 700,
        borderRadius,
      }}
    >
      {BRAND_ICON_GLYPH}
    </div>
  );
}
