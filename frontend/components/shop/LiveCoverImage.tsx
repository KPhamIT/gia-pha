"use client";

import { useEffect, useRef, useState } from "react";
import { loadCalligraphyFont } from "@/components/family-tree/book/calligraphy-font-loader";
import {
  DEFAULT_CALLIGRAPHY_FONT_ID,
  getCalligraphyFont,
} from "@/components/family-tree/book/calligraphy-fonts";
import { A4_RATIO, COVER_SAMPLES, ScaledCover, type CoverVariant } from "./cover-samples";

/** Ảnh bìa minh hoạ sản phẩm — render trực tiếp mẫu bìa đầu tiên, co theo khung. */
export default function LiveCoverImage({
  alt,
  variant = "giaPha",
}: {
  alt: string;
  variant?: CoverVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const fontFamily = getCalligraphyFont(DEFAULT_CALLIGRAPHY_FONT_ID).cssValue;

  useEffect(() => {
    void loadCalligraphyFont(DEFAULT_CALLIGRAPHY_FONT_ID);
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={alt}
      className="w-1/2 max-w-[260px] overflow-hidden rounded-lg shadow-[0_14px_34px_rgba(50,23,22,0.22)] ring-1 ring-black/5"
      style={{ aspectRatio: `1 / ${A4_RATIO}` }}
    >
      {width > 0 ? <ScaledCover {...COVER_SAMPLES[0]} width={width} variant={variant} fontFamily={fontFamily} /> : null}
    </div>
  );
}
