import {
  MARGIN_BOTTOM_MM,
  MARGIN_LEFT_MM,
  MARGIN_RIGHT_MM,
  MARGIN_TOP_MM,
} from "@/lib/ceremony/apply-ceremony-print-background";

/**
 * Hình học trang A4 khi in bài cúng — khớp `apply-ceremony-print-background.ts`
 * (lề) và `apply-ceremony-font-scale.ts` (cỡ chữ, giãn dòng).
 */
export const MM_TO_PX = 96 / 25.4;
export const PAPER_WIDTH_MM = 210;
export const PAPER_HEIGHT_MM = 297;
export const PAPER_WIDTH_PX = PAPER_WIDTH_MM * MM_TO_PX;
export const CONTENT_WIDTH_MM = PAPER_WIDTH_MM - MARGIN_LEFT_MM - MARGIN_RIGHT_MM;
/** Chiều cao vùng chữ mỗi trang in (px). */
export const CONTENT_HEIGHT_PX =
  (PAPER_HEIGHT_MM - MARGIN_TOP_MM - MARGIN_BOTTOM_MM) * MM_TO_PX;

export const PRINT_FONT = '"Noto Serif", "Times New Roman", Georgia, serif';

/** Các dòng (đã tự xuống dòng) nằm trên một trang. */
export type PageSlice = { start: number; count: number };

/**
 * Chia dòng theo trang như trình duyệt khi in: trang đầu trừ phần tiêu đề,
 * trang cuối ít nhất 2 dòng (`widows: 2` mặc định).
 */
export function paginateLines(
  totalLines: number,
  firstPageLines: number,
  linesPerPage: number,
): PageSlice[] {
  const pages: PageSlice[] = [];
  let start = 0;
  let capacity = Math.max(1, firstPageLines);
  for (;;) {
    pages.push({ start, count: Math.max(1, Math.min(capacity, totalLines - start)) });
    start += capacity;
    if (start >= totalLines) break;
    capacity = Math.max(1, linesPerPage);
  }
  const last = pages.length - 1;
  if (last > 0 && pages[last].count === 1 && pages[last - 1].count > 2) {
    pages[last - 1].count -= 1;
    pages[last].start -= 1;
    pages[last].count += 1;
  }
  return pages;
}

export function pageOfLine(pages: PageSlice[], line: number): number {
  const index = pages.findIndex((p) => line < p.start + p.count);
  return index === -1 ? pages.length - 1 : index;
}

/** Số dòng hiển thị của `text` trong khối đo (cùng bề rộng, font với textarea). */
export function measureLineCount(
  mirror: HTMLElement,
  text: string,
  lineHeight: number,
): number {
  // Ký tự rỗng giữ dòng trống cuối khi nội dung kết thúc bằng xuống dòng.
  mirror.textContent = `${text}​`;
  return Math.max(1, Math.round(mirror.offsetHeight / lineHeight));
}

const SCROLL_PADDING_PX = 24;

/** Cuộn `scroller` để dòng thứ `lineInPage` của cửa sổ trang hiện trong khung nhìn. */
export function scrollLineIntoView(
  scroller: HTMLElement,
  pageWindow: HTMLElement,
  lineInPage: number,
  lineHeight: number,
): void {
  const box = scroller.getBoundingClientRect();
  const win = pageWindow.getBoundingClientRect();
  // Tờ giấy có thể bị thu nhỏ (zoom) trên màn hình hẹp.
  const scale = pageWindow.offsetHeight ? win.height / pageWindow.offsetHeight : 1;
  const top = win.top + lineInPage * lineHeight * scale;
  const bottom = top + lineHeight * scale;
  if (top < box.top + SCROLL_PADDING_PX) {
    scroller.scrollTop -= box.top + SCROLL_PADDING_PX - top;
  } else if (bottom > box.bottom - SCROLL_PADDING_PX) {
    scroller.scrollTop += bottom - (box.bottom - SCROLL_PADDING_PX);
  }
}

/** Chỉ số dòng chứa vị trí `offset` trong `text`. */
export function measureCaretLine(
  mirror: HTMLElement,
  text: string,
  offset: number,
  lineHeight: number,
): number {
  mirror.textContent = text.slice(0, offset);
  const marker = document.createElement("span");
  marker.textContent = "​";
  mirror.appendChild(marker);
  return Math.floor((marker.offsetTop + 1) / lineHeight);
}
