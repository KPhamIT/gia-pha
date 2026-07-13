"use client";

import { useCallback, useEffect, useState } from "react";
import { loadCalligraphyFont } from "@/components/family-tree/book/calligraphy-font-loader";
import { sheetSizeMm } from "./cover-bleed";
import type { CoverDesign, CoverSide } from "./cover-studio-settings";

const nextFrame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

export type CoverPrintMode = CoverSide | "both";

/**
 * In bìa với khổ = A4 + bleed; inject @page size tạm thời.
 */
export function useCoverPrint(design: CoverDesign | null) {
  const [printMode, setPrintMode] = useState<CoverPrintMode | null>(null);

  useEffect(() => {
    if (!printMode) return;
    const reset = () => setPrintMode(null);
    window.addEventListener("afterprint", reset);
    return () => window.removeEventListener("afterprint", reset);
  }, [printMode]);

  const print = useCallback(
    async (mode: CoverPrintMode) => {
      if (!design) return;
      await loadCalligraphyFont(design.fontId);
      const sheet = sheetSizeMm(design.bleedMm);
      const style = document.createElement("style");
      style.setAttribute("data-cover-print-page", "true");
      style.textContent = `@page{size:${sheet.width}mm ${sheet.height}mm;margin:0}`;
      document.head.appendChild(style);

      setPrintMode(mode);
      await nextFrame();
      await nextFrame();
      window.print();

      window.setTimeout(() => {
        style.remove();
      }, 500);
    },
    [design],
  );

  return { printMode, print };
}
