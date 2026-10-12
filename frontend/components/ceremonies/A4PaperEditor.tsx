"use client";

import { useRef, type RefObject } from "react";
import { ceremonyRootFontPx } from "@/lib/ceremony/apply-ceremony-font-scale";
import { useCeremonyFontSize } from "@/hooks/useCeremonyFontSize";
import A4PaperSheet, { A4PaperHeading } from "./A4PaperSheet";
import { CONTENT_WIDTH_MM, PAPER_WIDTH_PX, PRINT_FONT } from "./a4-paper-layout";
import { useA4Pagination } from "./useA4Pagination";
import { useFitZoom } from "./useFitZoom";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  /** Tiêu đề in ở đầu trang (giống bản in), chỉ hiển thị. */
  title?: string | null;
  /** Chừa chỗ dưới cùng cho nút nổi trên điện thoại. */
  bottomInset?: boolean;
};

/**
 * Soạn bài cúng trên các tờ A4 giống hệt bản in: cùng khổ, lề, nền, font,
 * cỡ chữ (theo mức phóng chữ đã chọn khi xem) và chỗ ngắt trang.
 */
export default function A4PaperEditor({
  textareaRef,
  value,
  onChange,
  title = null,
  bottomInset,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Màn hình hẹp hơn khổ A4: thu nhỏ cả tờ giấy thay vì để chữ xuống dòng khác.
  const zoom = useFitZoom(scrollerRef, PAPER_WIDTH_PX);
  const rootPx = ceremonyRootFontPx(useCeremonyFontSize().scale);
  const {
    lineHeight,
    pages,
    totalLines,
    mirrorRef,
    headingRef,
    registerCopy,
    focusCopy,
    focusActive,
    syncCaret,
  } = useA4Pagination({ value, rootPx, title, textareaRef, scrollerRef });


  const textStyle = {
    fontFamily: PRINT_FONT,
    fontSize: rootPx,
    lineHeight: `${lineHeight}px`,
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    color: "#1a1a1a",
  } as const;

  return (
    <div
      ref={scrollerRef}
      className={`relative min-h-0 flex-1 overflow-auto rounded-xl bg-stone-300/60 py-6${bottomInset ? " pb-20 lg:pb-6" : ""}`}
      onMouseDown={(e) => {
        // Bấm vào lề giấy cũng đưa con trỏ vào nội dung.
        if (e.target instanceof HTMLTextAreaElement || e.target === e.currentTarget) return;
        e.preventDefault();
        focusActive();
      }}
    >
      <div aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 h-0 w-0 overflow-hidden">
        <div
          ref={mirrorRef}
          className="absolute left-0 top-0"
          style={{ ...textStyle, width: `${CONTENT_WIDTH_MM}mm` }}
        />
      </div>
      <div className="mx-auto flex w-fit flex-col items-center gap-6" style={{ zoom }}>
        {pages.map((page, index) => (
          <A4PaperSheet key={index} editable>
            {index === 0 && title ? (
              <A4PaperHeading ref={headingRef} title={title} rootPx={rootPx} />
            ) : null}
            <div
              className="relative"
              style={{ height: page.count * lineHeight, overflow: "clip" }}
            >
              <textarea
                ref={registerCopy}
                data-page={index}
                aria-label={index === 0 ? undefined : `Trang ${index + 1}`}
                className="absolute inset-x-0 block w-full resize-none overflow-hidden border-0 bg-transparent p-0 outline-none"
                style={{
                  ...textStyle,
                  top: -page.start * lineHeight,
                  height: (totalLines + 1) * lineHeight,
                }}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => focusCopy(index)}
                onSelect={syncCaret}
                spellCheck={false}
              />
            </div>
          </A4PaperSheet>
        ))}
      </div>
    </div>
  );
}
