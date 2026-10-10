"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { UI } from "@/lib/constants/ui-strings";
import ShowcaseLightbox from "./ShowcaseLightbox";
import ShowcaseThumb from "./ShowcaseThumb";
import type { ShowcaseItem, ShowcaseTexts } from "./showcase-types";

/** Ảnh trang cắt từ sổ gia phả trong ứng dụng (756×1068). */
const PAGE_WIDTH = 756;
const PAGE_HEIGHT = 1068;
const PAGE_RATIO = PAGE_HEIGHT / PAGE_WIDTH;

const TEXTS: ShowcaseTexts = {
  dialog: UI.SHOP_PAGES_DIALOG,
  order: UI.SHOP_PAGES_ORDER,
  hint: UI.SHOP_PAGES_HINT_DESKTOP,
  hintTouch: UI.SHOP_PAGES_HINT_TOUCH,
};

const ITEMS: ShowcaseItem[] = UI.SHOP_PAGES.map((page) => ({
  key: page.key,
  label: page.label,
  description: page.description,
  ratio: PAGE_RATIO,
  orderRef: `so-gia-pha-trang-${page.key}`,
  renderFront: (width) => (
    <Image
      src={page.src}
      alt={page.label}
      width={PAGE_WIDTH}
      height={PAGE_HEIGHT}
      sizes={`${Math.round(width)}px`}
      style={{ width, height: width * PAGE_RATIO }}
      draggable={false}
    />
  ),
}));

/** Một vài trang tiêu biểu trong sổ — bấm để xem lớn trong popup 3D. */
export default function PageGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const getThumbRect = useCallback(
    (index: number) => thumbRefs.current[index]?.getBoundingClientRect() ?? null,
    [],
  );

  const handleClose = useCallback(() => {
    const index = openIndex;
    setOpenIndex(null);
    if (index != null) {
      requestAnimationFrame(() => thumbRefs.current[index]?.focus({ preventScroll: true }));
    }
  }, [openIndex]);

  return (
    <>
      <ul className="mx-auto grid max-w-4xl grid-cols-3 gap-3 sm:gap-8">
        {UI.SHOP_PAGES.map((page, i) => (
          <li key={page.key} className="flex flex-col items-center text-center">
            <ShowcaseThumb
              buttonRef={(el) => {
                thumbRefs.current[i] = el;
              }}
              ariaLabel={UI.SHOP_PAGES_OPEN(page.label)}
              hidden={openIndex === i}
              onOpen={() => setOpenIndex(i)}
            >
              <Image
                src={page.src}
                alt={page.label}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                sizes="(min-width: 640px) 240px, 30vw"
                className="h-auto w-full max-w-[240px]"
              />
            </ShowcaseThumb>
            <p className="mt-3 font-serif text-sm font-semibold text-[#321716] sm:text-lg">
              {page.label}
            </p>
            <p className="mt-1 hidden max-w-[280px] text-sm leading-relaxed text-[#504443] sm:block">
              {page.description}
            </p>
          </li>
        ))}
      </ul>

      {openIndex != null ? (
        <ShowcaseLightbox
          items={ITEMS}
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
