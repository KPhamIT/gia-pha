"use client";

import { useCallback, useEffect, useState } from "react";
import { sheetSizeMm } from "@/components/cover-studio/cover-bleed";
import { loadCalligraphyFont } from "@/components/family-tree/book/calligraphy-font-loader";
import { injectPageSize, nextFrame, waitForFonts } from "./print-helpers";

export const COVER_BLEED_MM = 3;

/** In bìa: gắn khối bìa vào <body>, đặt khổ giấy A4 + lề tràn, mở hộp thoại in, dọn dẹp sau khi in. */
export function useCoverPrint(fontId: string) {
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (!printing) return;
    const done = () => setPrinting(false);
    window.addEventListener("afterprint", done);
    return () => window.removeEventListener("afterprint", done);
  }, [printing]);

  const print = useCallback(async () => {
    await loadCalligraphyFont(fontId);
    const sheet = sheetSizeMm(COVER_BLEED_MM);
    const removePageSize = injectPageSize(sheet.width, sheet.height);
    setPrinting(true);
    await nextFrame();
    await waitForFonts();
    await nextFrame();
    window.print();
    window.setTimeout(removePageSize, 500);
  }, [fontId]);

  return { printing, print };
}
