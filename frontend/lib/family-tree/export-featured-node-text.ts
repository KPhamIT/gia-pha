/** Bề ngang ước lượng của một ký tự serif đậm (in hoa, có dấu), theo cỡ chữ. */
const CHAR_WIDTH = 0.66;
const LINE_FACTOR = 1.15;
/** Cỡ chữ tên mong muốn theo chiều cao khung: thủy tổ / đời 2 / đời 3. */
const FONT_RATIO = [0.3, 0.24, 0.22];

function padX(height: number): number {
  return Math.max(6, height * 0.06) + height * 0.12;
}

/** Cỡ chữ tên mong muốn của khung ngang hạng `rank`. */
export function featuredMaxFont(rank: number, height: number, nodeFontSize: number): number {
  return Math.max(nodeFontSize, height * (FONT_RATIO[rank] ?? FONT_RATIO[1]!));
}

/** Bề rộng khung cần để tên nằm trọn một dòng ở cỡ chữ `font`. */
export function featuredWidthForName(name: string, height: number, font: number): number {
  return name.trim().length * CHAR_WIDTH * font + padX(height) * 2 + height * 0.1;
}

/** Vị trí dòng tiêu đề, tên (tự thu cỡ chữ cho vừa) và ngày sinh trong khung lớn. */
export function featuredNodeLayout({
  width,
  height,
  name,
  caption,
  hasBirth,
  maxFontSize,
}: {
  width: number;
  height: number;
  name: string;
  caption: string | null;
  hasBirth: boolean;
  maxFontSize: number;
}) {
  const inset = Math.max(6, height * 0.06);
  const availW = width - padX(height) * 2;
  const captionFont = height * 0.1;
  const captionY = inset + height * 0.2;
  const birthFont = height * 0.1;
  const birthY = height - inset - height * 0.1;

  const top = caption ? captionY + captionFont * 0.6 : inset + height * 0.08;
  const bottom = hasBirth
    ? birthY - birthFont * 1.4
    : height - inset - height * 0.08;
  // Luôn một dòng: khung đã giãn theo tên; tên quá dài thì thu cỡ chữ cho vừa.
  const lines = [name];
  const fontSize = Math.min(
    maxFontSize,
    availW / (Math.max(name.length, 1) * CHAR_WIDTH),
    (bottom - top) / LINE_FACTOR,
  );
  const lineGap = fontSize * LINE_FACTOR;
  const firstBaseline =
    top + (bottom - top - lines.length * lineGap) / 2 + fontSize * 0.85;
  const ruleHalf = caption
    ? Math.min(availW / 2, caption.length * captionFont * 0.55)
    : 0;

  return {
    inset,
    cx: width / 2,
    captionFont,
    captionY,
    ruleHalf,
    birthFont,
    birthY,
    lines,
    fontSize,
    lineGap,
    firstBaseline,
  };
}
