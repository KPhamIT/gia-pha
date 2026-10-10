"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadCalligraphyFont } from "@/components/family-tree/book/calligraphy-font-loader";
import {
  DEFAULT_CALLIGRAPHY_FONT_ID,
  getCalligraphyFont,
} from "@/components/family-tree/book/calligraphy-fonts";
import { UI } from "@/lib/constants/ui-strings";
import ShowcaseLightbox from "./ShowcaseLightbox";
import ShowcaseThumb from "./ShowcaseThumb";
import {
  A4_RATIO,
  COVER_SAMPLES,
  ScaledCover,
  coverLabel,
  coverRef,
  type CoverVariant,
} from "./cover-samples";
import type { ShowcaseItem, ShowcaseTexts } from "./showcase-types";

const TEXTS: Record<CoverVariant, ShowcaseTexts> = {
  giaPha: {
    dialog: UI.SHOP_COVER_DIALOG,
    order: UI.SHOP_COVER_ORDER,
    hint: UI.SHOP_COVER_TILT_HINT,
    hintTouch: UI.SHOP_COVER_TILT_HINT_TOUCH,
  },
  vanKhan: {
    dialog: UI.SHOP_PRAYER_COVER_DIALOG,
    order: UI.SHOP_COVER_ORDER,
    hint: UI.SHOP_COVER_TILT_HINT,
    hintTouch: UI.SHOP_COVER_TILT_HINT_TOUCH,
  },
};

const THUMB_MAX_WIDTH_PX = 168;

/** Ô bìa co theo bề rộng cột (tối đa 168px). */
function useCellWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(THUMB_MAX_WIDTH_PX);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(Math.min(THUMB_MAX_WIDTH_PX, el.clientWidth || THUMB_MAX_WIDTH_PX));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

/** Bìa thật (render bằng component Cover Studio) — bấm để xem lớn trong popup 3D. */
export default function CoverGallery({ variant = "giaPha" }: { variant?: CoverVariant }) {
  const fontFamily = getCalligraphyFont(DEFAULT_CALLIGRAPHY_FONT_ID).cssValue;
  const { ref: cellRef, width } = useCellWidth();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = useMemo<ShowcaseItem[]>(
    () =>
      COVER_SAMPLES.map((sample) => ({
        key: `${sample.styleId}-${sample.paletteId}`,
        label: coverLabel(sample),
        ratio: A4_RATIO,
        thick: true,
        orderRef: coverRef(sample, variant),
        renderFront: (w) => (
          <ScaledCover {...sample} width={w} side="front" variant={variant} fontFamily={fontFamily} />
        ),
        renderBack: (w) => (
          <ScaledCover {...sample} width={w} side="back" variant={variant} fontFamily={fontFamily} />
        ),
      })),
    [fontFamily, variant],
  );

  useEffect(() => {
    void loadCalligraphyFont(DEFAULT_CALLIGRAPHY_FONT_ID);
  }, []);

  const getThumbRect = useCallback(
    (index: number) => thumbRefs.current[index]?.getBoundingClientRect() ?? null,
    [],
  );

  const handleClose = useCallback(() => {
    const index = openIndex;
    setOpenIndex(null);
    // Ô bìa đang ẩn khi popup mở — đợi hiện lại rồi mới trả focus.
    if (index != null) {
      requestAnimationFrame(() => thumbRefs.current[index]?.focus({ preventScroll: true }));
    }
  }, [openIndex]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
        {COVER_SAMPLES.map((sample, i) => {
          const label = coverLabel(sample);
          return (
            <li key={`${sample.styleId}-${sample.paletteId}`} className="flex flex-col items-center gap-2.5">
              <div ref={i === 0 ? cellRef : undefined} className="flex w-full justify-center">
                <ShowcaseThumb
                  buttonRef={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  ariaLabel={UI.SHOP_COVER_OPEN(label)}
                  hidden={openIndex === i}
                  onOpen={() => setOpenIndex(i)}
                >
                  <ScaledCover {...sample} width={width} variant={variant} fontFamily={fontFamily} />
                </ShowcaseThumb>
              </div>
              <span className="text-sm font-medium text-[#504443]">{label}</span>
            </li>
          );
        })}
      </ul>

      {openIndex != null ? (
        <ShowcaseLightbox
          items={items}
          index={openIndex}
          texts={TEXTS[variant]}
          getThumbRect={getThumbRect}
          onIndexChange={setOpenIndex}
          onClose={handleClose}
        />
      ) : null}
    </>
  );
}
