"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import {
  applyCeremonyPrintBackground,
  preloadCeremonyPrintBackground,
} from "@/lib/ceremony/apply-ceremony-print-background";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";
import { buildPrayerBookDocument } from "./prayer-book-document";

/**
 * In ruột sách văn khấn: lấy HTML các bài (đã điền tên dòng họ) → ghép thành một
 * tài liệu trong iframe ẩn → nền giấy + chân trang giống bản in bài khấn → in.
 */
export function usePrayerBookPrint() {
  const [preparing, setPreparing] = useState(false);

  const print = useCallback(async (ids: number[], clanName: string) => {
    setPreparing(true);
    try {
      const pages = await api.ceremonies.renderPrintBook(ids, clanName);
      const html = buildPrayerBookDocument(pages, UI.PRINT_BOOKS_TOC_TITLE);

      document.getElementById("prayer-book-print-frame")?.remove();
      const iframe = document.createElement("iframe");
      iframe.id = "prayer-book-print-frame";
      iframe.setAttribute("aria-hidden", "true");
      Object.assign(iframe.style, { position: "fixed", left: "-300vw", top: "0", width: "210mm", height: "297mm", border: "0" });
      document.body.appendChild(iframe);

      await new Promise<void>((resolve) => {
        iframe.addEventListener("load", () => resolve(), { once: true });
        iframe.srcdoc = html;
      });
      applyCeremonyPrintBackground(iframe);
      await preloadCeremonyPrintBackground();
      const doc = iframe.contentDocument;
      if (doc && "fonts" in doc) await doc.fonts.ready;

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      notify.error(err, UI.PRINT_BOOKS_RENDER_ERR);
    } finally {
      setPreparing(false);
    }
  }, []);

  return { preparing, print };
}
