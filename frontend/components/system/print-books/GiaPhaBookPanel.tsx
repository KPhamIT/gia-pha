"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { AC } from "@/components/auth/account-theme";
import { formatCoverSubtitle } from "@/components/family-tree/book/book-cover-subtitle";
import { defaultBookSettings, type BookSettings } from "@/components/family-tree/book/book-settings";
import { loadCalligraphyFont } from "@/components/family-tree/book/calligraphy-font-loader";
import { PAGE_BORDER_STYLES } from "@/components/family-tree/book/page-border-styles";
import { PAGE_FORM_STYLES } from "@/components/family-tree/book/page-form-styles";
import { COVER_SAMPLES, buildCoverContent, type CoverClanInfo } from "@/components/shop/cover-samples";
import { UI } from "@/lib/constants/ui-strings";
import { fitGenealogyPagesForPrint, resetGenealogyPrintFit } from "@/utils/fit-genealogy-print";
import BlankBookPrintStack from "./BlankBookPages";
import CoverPicker from "./CoverPicker";
import CoverPrintSheets from "./CoverPrintSheets";
import { giaPhaPreviewItems } from "./gia-pha-preview-items";
import PreviewGallery from "./PreviewGallery";
import { nextFrame, waitForFonts } from "./print-helpers";
import { COVER_BLEED_MM, useCoverPrint } from "./useCoverPrint";

const MAX_PAGES = 500;
const PREVIEW_W = 190;

type Props = { clan: CoverClanInfo; fontFamily: string; fontId: string; onMissingClan: () => void };

/** Sổ gia phả trống: bìa theo mẫu + Lời mở đầu + N trang hồ sơ để viết tay. */
export default function GiaPhaBookPanel({ clan, fontFamily, fontId, onMissingClan }: Props) {
  const [coverIndex, setCoverIndex] = useState(0);
  const [pageCount, setPageCount] = useState(50);
  const [borderStyleId, setBorderStyleId] = useState(defaultBookSettings().borderStyleId);
  const [formStyleId, setFormStyleId] = useState(defaultBookSettings().formStyleId);
  const [printingInner, setPrintingInner] = useState(false);
  const cover = useCoverPrint(fontId);

  const sample = COVER_SAMPLES[coverIndex];
  const content = useMemo(() => buildCoverContent("giaPha", clan), [clan]);
  const footer = formatCoverSubtitle(clan.clanName);
  const settings: BookSettings = useMemo(
    () => ({
      ...defaultBookSettings(),
      borderStyleId,
      formStyleId,
      coverFontId: fontId,
      prefaceBody: UI.PRINT_BOOKS_PREFACE_BODY(clan.clanName || "…………"),
      prefaceSignature: "",
      showPageNumbers: false,
    }),
    [borderStyleId, formStyleId, fontId, clan.clanName],
  );

  useEffect(() => {
    if (!printingInner) return;
    const done = () => setPrintingInner(false);
    window.addEventListener("afterprint", done);
    return () => window.removeEventListener("afterprint", done);
  }, [printingInner]);

  const printInner = useCallback(async () => {
    if (!clan.clanName) return onMissingClan();
    await loadCalligraphyFont(fontId);
    flushSync(() => setPrintingInner(true));
    await nextFrame();
    await waitForFonts();
    const root = document.querySelector<HTMLElement>("[data-print-root='true'] [data-print-all-stack]");
    resetGenealogyPrintFit(root);
    fitGenealogyPagesForPrint(root, "[data-genealogy-paper]");
    await nextFrame();
    window.print();
  }, [clan.clanName, fontId, onMissingClan]);

  const pages = Math.min(MAX_PAGES, Math.max(1, pageCount || 1));
  const previewItems = giaPhaPreviewItems({ sample, content, fontFamily, settings, footer, pages });
  const printCover = () => (clan.clanName ? void cover.print() : onMissingClan());

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="space-y-6">
        <section className={`${AC.card} p-5`}>
          <h3 className={AC.sectionTitle}>{UI.PRINT_BOOKS_COVER}</h3>
          <div className="mt-4">
            <CoverPicker variant="giaPha" content={content} fontFamily={fontFamily} value={coverIndex} onChange={setCoverIndex} />
          </div>
        </section>

        <section className={`${AC.card} grid gap-4 p-5 sm:grid-cols-3`}>
          <label className="block">
            <span className={`text-sm font-medium ${AC.muted}`}>{UI.PRINT_BOOKS_PAGE_COUNT}</span>
            <input
              type="number"
              min={1}
              max={MAX_PAGES}
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              className={`${AC.input} mt-1`}
            />
          </label>
          <label className="block">
            <span className={`text-sm font-medium ${AC.muted}`}>{UI.PRINT_BOOKS_BORDER}</span>
            <select value={borderStyleId} onChange={(e) => setBorderStyleId(e.target.value)} className={`${AC.input} mt-1`}>
              {PAGE_BORDER_STYLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={`text-sm font-medium ${AC.muted}`}>{UI.PRINT_BOOKS_FORM}</span>
            <select value={formStyleId} onChange={(e) => setFormStyleId(e.target.value)} className={`${AC.input} mt-1`}>
              {PAGE_FORM_STYLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <p className={`text-sm sm:col-span-3 ${AC.label}`}>{UI.PRINT_BOOKS_PAGE_COUNT_HINT(pages)}</p>
        </section>

        <section className={`${AC.card} space-y-3 p-5`}>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={printCover} className="rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7a3d00]">
              {UI.PRINT_BOOKS_PRINT_COVER}
            </button>
            <button type="button" onClick={() => void printInner()} className="rounded-xl bg-[#321716] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4a2c2a]">
              {UI.PRINT_BOOKS_PRINT_INNER}
            </button>
          </div>
          <p className={`text-xs ${AC.label}`}>{UI.PRINT_BOOKS_PRINT_HINT}</p>
        </section>
      </div>

      <aside className={`${AC.cardPaper} p-5`}>
        <h3 className={AC.sectionTitle}>{UI.PRINT_BOOKS_PREVIEW}</h3>
        <div className="mt-4">
          <PreviewGallery items={previewItems} width={PREVIEW_W} className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-1 xl:grid-cols-2" />
        </div>
      </aside>

      {cover.printing ? <CoverPrintSheets sample={sample} content={content} fontFamily={fontFamily} bleedMm={COVER_BLEED_MM} /> : null}
      {printingInner ? <BlankBookPrintStack settings={settings} pageCount={pages} clanFooterLabel={footer} /> : null}
    </div>
  );
}
