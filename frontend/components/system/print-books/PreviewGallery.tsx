"use client";

import { useCallback, useRef, useState } from "react";
import ShowcaseLightbox from "@/components/shop/ShowcaseLightbox";
import ShowcaseThumb from "@/components/shop/ShowcaseThumb";
import type { ShowcaseItem } from "@/components/shop/showcase-types";
import { UI } from "@/lib/constants/ui-strings";

const TEXTS = {
  dialog: UI.PRINT_BOOKS_PREVIEW,
  order: "",
  hint: UI.SHOP_COVER_TILT_HINT,
  hintTouch: UI.SHOP_COVER_TILT_HINT_TOUCH,
};

type Props = {
  items: ShowcaseItem[];
  /** Bề rộng ô nhỏ (px). */
  width: number;
  className?: string;
};

/** Ô xem trước bìa / trang ruột — bấm để mở popup 3D giống trang dịch vụ (/dich-vu). */
export default function PreviewGallery({ items, width, className = "grid grid-cols-2 gap-4" }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const getThumbRect = useCallback((index: number) => thumbRefs.current[index]?.getBoundingClientRect() ?? null, []);

  const handleClose = useCallback(() => {
    const index = openIndex;
    setOpenIndex(null);
    if (index != null) requestAnimationFrame(() => thumbRefs.current[index]?.focus({ preventScroll: true }));
  }, [openIndex]);

  return (
    <>
      <ul className={className}>
        {items.map((item, i) => (
          <li key={item.key} className="flex flex-col items-center gap-2">
            <ShowcaseThumb
              buttonRef={(el) => {
                thumbRefs.current[i] = el;
              }}
              ariaLabel={`${UI.PRINT_BOOKS_PREVIEW}: ${item.label}`}
              hidden={openIndex === i}
              onOpen={() => setOpenIndex(i)}
            >
              {item.renderFront(width)}
            </ShowcaseThumb>
            <span className="text-xs font-medium text-[#504443]">{item.label}</span>
          </li>
        ))}
      </ul>

      {openIndex != null ? (
        <ShowcaseLightbox
          items={items}
          index={openIndex}
          texts={TEXTS}
          getThumbRect={getThumbRect}
          onIndexChange={setOpenIndex}
          onClose={handleClose}
        />
      ) : null}
    </>
  );
}
