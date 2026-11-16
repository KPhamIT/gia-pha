"use client";

import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { loadCalligraphyFont } from "@/components/family-tree/book/calligraphy-font-loader";
import { fitGenealogyPagesForPrint, resetGenealogyPrintFit } from "@/utils/fit-genealogy-print";
import { nextFrame, waitForFonts } from "./print-helpers";

/**
 * In ruột sổ gia phả trống: bật `printing` để gắn `BlankBookPrintStack`, chờ font,
 * co chữ cho vừa trang rồi mở hộp thoại in; tự tắt sau khi in xong.
 */
export function useInnerPrint(fontId: string) {
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (!printing) return;
    const done = () => setPrinting(false);
    window.addEventListener("afterprint", done);
    return () => window.removeEventListener("afterprint", done);
  }, [printing]);

  const print = useCallback(async () => {
    await loadCalligraphyFont(fontId);
    flushSync(() => setPrinting(true));
    await nextFrame();
    await waitForFonts();
    const root = document.querySelector<HTMLElement>("[data-print-root='true'] [data-print-all-stack]");
    resetGenealogyPrintFit(root);
    fitGenealogyPagesForPrint(root, "[data-genealogy-paper]");
    await nextFrame();
    window.print();
  }, [fontId]);

  return { printing, print };
}
