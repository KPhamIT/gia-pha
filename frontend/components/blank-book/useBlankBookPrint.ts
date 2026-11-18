"use client";

import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { sheetSizeMm } from "@/components/cover-studio/cover-bleed";
import { loadCalligraphyFont } from "@/components/family-tree/book/calligraphy-font-loader";
import { injectPageSize, nextFrame, waitForFonts } from "@/components/system/print-books/print-helpers";
import { COVER_BLEED_MM } from "@/components/system/print-books/useCoverPrint";
import { fitGenealogyPagesForPrint, resetGenealogyPrintFit } from "@/utils/fit-genealogy-print";

export type BlankBookPrintMode = "cover" | "inner";

/**
 * In bìa / ruột cho khách. Khác công cụ /system/in-sach: khối in được GIỮ LẠI sau khi in
 * (không gỡ ở `afterprint`). Trên điện thoại (Chrome Android, Safari…) `window.print()` trả về
 * ngay và `afterprint` chạy trước khi trình duyệt dựng bản PDF — nếu gỡ khối in lúc đó, file ra trắng.
 * Mỗi lúc chỉ gắn một khối in (bìa hoặc ruột) để file không lẫn trang.
 */
export function useBlankBookPrint(fontId: string) {
  const [mode, setMode] = useState<BlankBookPrintMode | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => document.querySelectorAll("[data-print-books-page]").forEach((el) => el.remove()), []);

  const print = useCallback(
    async (next: BlankBookPrintMode) => {
      setBusy(true);
      try {
        await loadCalligraphyFont(fontId);
        flushSync(() => setMode(next));
        document.querySelectorAll("[data-print-books-page]").forEach((el) => el.remove());
        const sheet = next === "cover" ? sheetSizeMm(COVER_BLEED_MM) : { width: 210, height: 297 };
        injectPageSize(sheet.width, sheet.height);
        await nextFrame();
        await waitForFonts();
        if (next === "inner") {
          const root = document.querySelector<HTMLElement>("[data-print-root='true'] [data-print-all-stack]");
          resetGenealogyPrintFit(root);
          fitGenealogyPagesForPrint(root, "[data-genealogy-paper]");
          await nextFrame();
        }
      } finally {
        setBusy(false);
      }
      window.print();
    },
    [fontId],
  );

  return { mode, busy, print };
}
