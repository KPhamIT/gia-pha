import type { ReactNode, Ref } from "react";
import { BRAND_NAME, BRAND_SLOGAN, SITE } from "@/config/site";
import {
  DEFAULT_PAGE_BACKGROUND_ID,
  DEFAULT_PAGE_BACKGROUND_WASH,
  getPageBackground,
} from "@/components/family-tree/book/page-backgrounds";
import {
  GOLD,
  MARGIN_LEFT_MM,
  MARGIN_RIGHT_MM,
  MARGIN_TOP_MM,
} from "@/lib/ceremony/apply-ceremony-print-background";
import { PAPER_HEIGHT_MM, PAPER_WIDTH_MM } from "./a4-paper-layout";

const WASH = DEFAULT_PAGE_BACKGROUND_WASH / 100;
const PAPER_BACKGROUND = `linear-gradient(rgb(255 254 249 / ${WASH}), rgb(255 254 249 / ${WASH})), url("${getPageBackground(DEFAULT_PAGE_BACKGROUND_ID).url}") center / 100% 100% no-repeat, #fffef9`;
const SITE_HOST = new URL(SITE.url).host;
const SIDES = { left: `${MARGIN_LEFT_MM}mm`, right: `${MARGIN_RIGHT_MM}mm` };

/** Một tờ A4 giống bản in: nền hoa văn, kẻ vàng đầu trang, chân trang thương hiệu. */
export default function A4PaperSheet({
  children,
  editable,
}: {
  children: ReactNode;
  editable?: boolean;
}) {
  return (
    <div
      className={`relative shrink-0${editable ? " cursor-text" : ""} shadow-[0_1px_3px_rgb(0_0_0/0.12),0_8px_24px_rgb(74_44_42/0.14)]`}
      style={{
        width: `${PAPER_WIDTH_MM}mm`,
        height: `${PAPER_HEIGHT_MM}mm`,
        background: PAPER_BACKGROUND,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute"
        style={{
          ...SIDES,
          top: "11mm",
          height: "0.4mm",
          background: `linear-gradient(90deg, transparent, ${GOLD} 18%, ${GOLD} 82%, transparent)`,
        }}
      />
      <div className="absolute" style={{ ...SIDES, top: `${MARGIN_TOP_MM}mm` }}>
        {children}
      </div>
      <footer
        aria-hidden="true"
        className="absolute select-none text-center"
        style={{ ...SIDES, bottom: "8mm", lineHeight: 1.35 }}
      >
        <div
          className="flex items-center"
          style={{ gap: "2.5mm", marginBottom: "1.6mm", color: GOLD, fontSize: "7pt" }}
        >
          <span className="flex-1" style={{ height: "0.3mm", background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
          ❖
          <span className="flex-1" style={{ height: "0.3mm", background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        </div>
        <div
          className="font-bold uppercase text-[#6b1d14]"
          style={{ fontSize: "7.5pt", letterSpacing: "0.22em" }}
        >
          {BRAND_NAME}{" "}
          <span className="font-normal normal-case text-[#7a5a3a]" style={{ letterSpacing: "0.08em" }}>
            · {SITE_HOST}
          </span>
        </div>
        <div className="italic text-[#7a5a3a]" style={{ marginTop: "0.6mm", fontSize: "7.5pt" }}>
          {BRAND_SLOGAN}
        </div>
      </footer>
    </div>
  );
}

/** Tiêu đề đầu bài cúng, cùng kích thước với `.ceremony-heading` của bản in. */
export function A4PaperHeading({
  title,
  rootPx,
  ref,
}: {
  title: string;
  rootPx: number;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="select-none text-center"
      style={{ paddingBottom: rootPx * 1.75 }}
    >
      <p
        className="m-0 font-bold uppercase text-[#6b1d14]"
        style={{ fontSize: rootPx * 1.4, lineHeight: 1.45, letterSpacing: "0.06em" }}
      >
        {title}
      </p>
      <div
        className="flex items-center justify-center leading-none"
        style={{ marginTop: rootPx * 0.6, gap: rootPx * 0.75, fontSize: rootPx * 0.85, color: GOLD }}
      >
        <span className="h-px" style={{ width: rootPx * 5.5, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
        ❖
        <span className="h-px" style={{ width: rootPx * 5.5, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
      </div>
    </div>
  );
}
