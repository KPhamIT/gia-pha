"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AC } from "@/components/auth/account-theme";
import { formatCoverSubtitle } from "@/components/family-tree/book/book-cover-subtitle";
import { loadCalligraphyFont } from "@/components/family-tree/book/calligraphy-font-loader";
import { DEFAULT_CALLIGRAPHY_FONT_ID, getCalligraphyFont } from "@/components/family-tree/book/calligraphy-fonts";
import { formatVnd } from "@/components/family-tree/events/event-format";
import { COVER_SAMPLES, buildCoverContent } from "@/components/shop/cover-samples";
import { blankBookSettings } from "@/components/system/print-books/blank-book-settings";
import CoverPicker from "@/components/system/print-books/CoverPicker";
import { giaPhaPreviewItems } from "@/components/system/print-books/gia-pha-preview-items";
import PreviewGallery from "@/components/system/print-books/PreviewGallery";
import { cleanClanName } from "@/components/system/print-books/print-helpers";
import { api } from "@/lib/api";
import { blankBookPrice, type BlankBookConfig } from "@/lib/api/modules/blank-book";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";
import { ClanSection, ContactSection } from "./BlankBookFormFields";
import { blankBookOrderPath } from "./blank-book-paths";

const FONT_ID = DEFAULT_CALLIGRAPHY_FONT_ID;
const PREVIEW_W = 150;

/** Form công khai: tên dòng họ + mẫu bìa + số trang → giá → tạo đơn và chuyển sang trang thanh toán. */
export default function BlankBookOrderForm() {
  const router = useRouter();
  const fontFamily = getCalligraphyFont(FONT_ID).cssValue;
  const [config, setConfig] = useState<BlankBookConfig | null>(null);
  const [clanName, setClanName] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [clanAddress, setClanAddress] = useState("");
  const [coverIndex, setCoverIndex] = useState(0);
  const [pageCount, setPageCount] = useState<number | "">("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void loadCalligraphyFont(FONT_ID);
    const onConfig = (c: BlankBookConfig) => {
      setConfig(c);
      setPageCount((prev) => (prev === "" ? c.defaultPages : prev));
    };
    api.blankBook.getConfig().then(onConfig, (err) => notify.error(err, UI.BLANK_BOOK_CONFIG_FAILED));
  }, []);

  const clan = useMemo(
    () => ({ clanName: cleanClanName(clanName), establishedYear: establishedYear.trim(), clanAddress: clanAddress.trim() }),
    [clanName, establishedYear, clanAddress],
  );
  const displayClan = clan.clanName || UI.PRINT_BOOKS_CLAN_NAME_PLACEHOLDER;
  const content = useMemo(() => buildCoverContent("giaPha", { ...clan, clanName: displayClan }), [clan, displayClan]);
  const settings = useMemo(() => blankBookSettings(displayClan, FONT_ID), [displayClan]);
  const pages = typeof pageCount === "number" ? pageCount : 0;
  const pagesValid = config ? pages >= config.minPages && pages <= config.maxPages : false;
  const total = config && pagesValid ? blankBookPrice(config, pages) : null;

  const previewItems = giaPhaPreviewItems({
    sample: COVER_SAMPLES[coverIndex],
    content,
    fontFamily,
    settings,
    footer: formatCoverSubtitle(displayClan),
    pages: Math.max(1, pages),
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!config) return;
    if (!clan.clanName) {
      notify.error(null, UI.PRINT_BOOKS_CLAN_REQUIRED);
      return document.getElementById("blank-book-clan")?.focus();
    }
    if (!pagesValid) return notify.error(null, UI.BLANK_BOOK_PAGES_INVALID(config.minPages, config.maxPages));
    if (!contactEmail.trim() && !contactPhone.trim()) return notify.error(null, UI.BLANK_BOOK_CONTACT_REQUIRED);

    setSubmitting(true);
    try {
      const order = await api.blankBook.createOrder({
        clanName: clan.clanName,
        establishedYear: clan.establishedYear || undefined,
        clanAddress: clan.clanAddress || undefined,
        pageCount: pages,
        coverIndex,
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
      });
      router.push(blankBookOrderPath(order.accessToken));
    } catch (err) {
      notify.error(err, UI.BLANK_BOOK_ORDER_FAILED);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="space-y-5">
        <ClanSection
          clanName={{ value: clanName, onChange: setClanName }}
          clanAddress={{ value: clanAddress, onChange: setClanAddress }}
          establishedYear={{ value: establishedYear, onChange: setEstablishedYear }}
        />

        <section className={`${AC.card} p-5`}>
          <h2 className={AC.sectionTitle}>{UI.BLANK_BOOK_STEP_COVER}</h2>
          <div className="mt-4">
            <CoverPicker variant="giaPha" content={content} fontFamily={fontFamily} value={coverIndex} onChange={setCoverIndex} />
          </div>
        </section>

        <section className={`${AC.card} p-5`}>
          <h2 className={AC.sectionTitle}>{UI.BLANK_BOOK_STEP_PAGES}</h2>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <label className="block w-40">
              <span className={`text-sm font-medium ${AC.muted}`}>{UI.BLANK_BOOK_PAGES_LABEL}</span>
              <input
                type="number"
                min={config?.minPages}
                max={config?.maxPages}
                value={pageCount}
                onChange={(e) => setPageCount(e.target.value === "" ? "" : Number(e.target.value))}
                className={`${AC.input} mt-1`}
              />
            </label>
            {config ? (
              <p className={`pb-2 text-sm ${AC.label}`}>
                {UI.BLANK_BOOK_PAGES_RANGE(config.minPages, config.maxPages)}{" "}
                {UI.BLANK_BOOK_PRICE_FORMULA(formatVnd(config.minPriceVnd), config.minPages, formatVnd(config.perPageVnd))}
              </p>
            ) : null}
          </div>
          {pagesValid ? <p className={`mt-2 text-sm ${AC.label}`}>{UI.PRINT_BOOKS_PAGE_COUNT_HINT(pages)}</p> : null}
        </section>

        <ContactSection
          email={{ value: contactEmail, onChange: setContactEmail }}
          phone={{ value: contactPhone, onChange: setContactPhone }}
        />

        <section className={`${AC.cardMuted} flex flex-wrap items-center justify-between gap-4 p-5`}>
          <div>
            <p className={`text-sm ${AC.muted}`}>{UI.BLANK_BOOK_TOTAL}</p>
            <p className="font-serif text-2xl font-bold text-[#944a00]">{total !== null ? formatVnd(total) : "—"}</p>
          </div>
          <button
            type="submit"
            disabled={!config || submitting}
            className="rounded-xl bg-[#944a00] px-6 py-3 text-sm font-semibold text-white hover:bg-[#7a3d00] disabled:opacity-60"
          >
            {submitting ? UI.BLANK_BOOK_SUBMITTING : UI.BLANK_BOOK_SUBMIT}
          </button>
        </section>
      </div>

      <aside className={`${AC.cardPaper} h-fit p-5`}>
        <h2 className={AC.sectionTitle}>{UI.PRINT_BOOKS_PREVIEW}</h2>
        <div className="mt-4">
          <PreviewGallery items={previewItems} width={PREVIEW_W} className="grid grid-cols-3 gap-3 lg:grid-cols-1" />
        </div>
      </aside>
    </form>
  );
}
