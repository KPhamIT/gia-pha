import { BRAND_NAME, BRAND_SLOGAN, SITE } from "@/config/site";
import {
  DEFAULT_PAGE_BACKGROUND_ID,
  DEFAULT_PAGE_BACKGROUND_WASH,
  getPageBackground,
} from "@/components/family-tree/book/page-backgrounds";

const STYLE_ID = "ceremony-print-background";
const FRAME_ID = "ceremony-print-frame";

/**
 * Lề chữ khi in (mm), theo khổ A4 văn bản Việt Nam (NĐ 30/2020: trên/dưới
 * 20–25, trái 30–35, phải 15–20; bài cúng không đóng gáy nên lề trái 25).
 * `@page` không có lề để nền tràn sát mép giấy; lề chữ là padding của body,
 * lặp lại trên mỗi trang nhờ `box-decoration-break: clone`.
 */
export const MARGIN_TOP_MM = 20;
export const MARGIN_BOTTOM_MM = 25;
export const MARGIN_LEFT_MM = 25;
export const MARGIN_RIGHT_MM = 20;

export const GOLD = "#b8893b";

function printBackgroundUrl(): string {
  const { url } = getPageBackground(DEFAULT_PAGE_BACKGROUND_ID);
  // srcDoc không có URL riêng: dùng đường dẫn tuyệt đối.
  return new URL(url, window.location.origin).href;
}

function siteHost(): string {
  return new URL(SITE.url).host;
}

/**
 * Tải sẵn ảnh nền trước khi mở hộp thoại in — nền chỉ dùng cho `@media print`
 * nên trình duyệt không tự tải, lần in đầu có thể ra trang trắng.
 */
export function preloadCeremonyPrintBackground(timeoutMs = 3000): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    const done = () => resolve();
    const timer = window.setTimeout(done, timeoutMs);
    image.onload = image.onerror = () => {
      window.clearTimeout(timer);
      done();
    };
    image.src = printBackgroundUrl();
  });
}

function printStyles(): string {
  const wash = DEFAULT_PAGE_BACKGROUND_WASH / 100;
  return `
    #${FRAME_ID} { display: none; }
    @media print {
      @page { size: A4; margin: 0; }
      html, body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        background: transparent !important;
      }
      body {
        margin: 0 !important;
        padding: ${MARGIN_TOP_MM}mm ${MARGIN_RIGHT_MM}mm ${MARGIN_BOTTOM_MM}mm ${MARGIN_LEFT_MM}mm !important;
        max-width: none !important;
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
      }
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        z-index: -1;
        background:
          linear-gradient(rgb(255 254 249 / ${wash}), rgb(255 254 249 / ${wash})),
          url("${printBackgroundUrl()}") center / 100% 100% no-repeat,
          #fffef9;
      }
      .ceremony-heading { break-after: avoid; }
      #${FRAME_ID} { display: block; }
      #${FRAME_ID} .cn-rule-top {
        position: fixed;
        top: 11mm;
        left: ${MARGIN_LEFT_MM}mm;
        right: ${MARGIN_RIGHT_MM}mm;
        height: 0.4mm;
        background: linear-gradient(90deg, transparent, ${GOLD} 18%, ${GOLD} 82%, transparent);
      }
      #${FRAME_ID} .cn-footer {
        position: fixed;
        bottom: 8mm;
        left: ${MARGIN_LEFT_MM}mm;
        right: ${MARGIN_RIGHT_MM}mm;
        text-align: center;
        font-family: "Noto Serif", "Times New Roman", Georgia, serif;
        line-height: 1.35;
        white-space: normal;
      }
      #${FRAME_ID} .cn-footer-rule {
        display: flex;
        align-items: center;
        gap: 2.5mm;
        margin-bottom: 1.6mm;
        color: ${GOLD};
        font-size: 7pt;
      }
      #${FRAME_ID} .cn-footer-rule::before,
      #${FRAME_ID} .cn-footer-rule::after {
        content: "";
        flex: 1;
        height: 0.3mm;
      }
      #${FRAME_ID} .cn-footer-rule::before {
        background: linear-gradient(90deg, transparent, ${GOLD});
      }
      #${FRAME_ID} .cn-footer-rule::after {
        background: linear-gradient(90deg, ${GOLD}, transparent);
      }
      #${FRAME_ID} .cn-brand {
        font-size: 7.5pt;
        font-weight: 700;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: #6b1d14;
      }
      #${FRAME_ID} .cn-brand span {
        font-weight: 400;
        letter-spacing: 0.08em;
        text-transform: none;
        color: #7a5a3a;
      }
      #${FRAME_ID} .cn-slogan {
        margin-top: 0.6mm;
        font-size: 7.5pt;
        font-style: italic;
        color: #7a5a3a;
      }
    }
  `;
}

/** Đường kẻ vàng đầu trang + chân trang thương hiệu, lặp lại mỗi trang in. */
function buildPrintFrame(doc: Document): HTMLElement {
  const frame = doc.createElement("div");
  frame.id = FRAME_ID;
  frame.setAttribute("aria-hidden", "true");

  const top = doc.createElement("div");
  top.className = "cn-rule-top";

  const footer = doc.createElement("div");
  footer.className = "cn-footer";
  const rule = doc.createElement("div");
  rule.className = "cn-footer-rule";
  rule.textContent = "❖";
  const brand = doc.createElement("div");
  brand.className = "cn-brand";
  brand.textContent = `${BRAND_NAME} `;
  const host = doc.createElement("span");
  host.textContent = `· ${siteHost()}`;
  brand.appendChild(host);
  const slogan = doc.createElement("div");
  slogan.className = "cn-slogan";
  slogan.textContent = BRAND_SLOGAN;
  footer.append(rule, brand, slogan);

  frame.append(top, footer);
  return frame;
}

/**
 * Khi in bài cúng: nền giấy hoa văn rồng giống trang sổ gia phả (/book),
 * lề A4, đường kẻ vàng và chân trang tên website + khẩu hiệu trên mọi trang.
 * Chỉ áp dụng cho bản in.
 */
export function applyCeremonyPrintBackground(
  iframe: HTMLIFrameElement | null,
): void {
  const doc = iframe?.contentDocument;
  if (!doc?.head || !doc.body || doc.getElementById(STYLE_ID)) return;

  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = printStyles();
  doc.head.appendChild(style);
  doc.body.appendChild(buildPrintFrame(doc));
}
