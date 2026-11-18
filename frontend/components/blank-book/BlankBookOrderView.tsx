"use client";

import { useEffect, useMemo, useState } from "react";
import { AC } from "@/components/auth/account-theme";
import { formatCoverSubtitle } from "@/components/family-tree/book/book-cover-subtitle";
import { loadCalligraphyFont } from "@/components/family-tree/book/calligraphy-font-loader";
import { DEFAULT_CALLIGRAPHY_FONT_ID, getCalligraphyFont } from "@/components/family-tree/book/calligraphy-fonts";
import { formatVnd } from "@/components/family-tree/events/event-format";
import { COVER_SAMPLES, buildCoverContent } from "@/components/shop/cover-samples";
import BlankBookPrintStack from "@/components/system/print-books/BlankBookPages";
import { blankBookSettings } from "@/components/system/print-books/blank-book-settings";
import CoverPrintSheets from "@/components/system/print-books/CoverPrintSheets";
import { COVER_BLEED_MM } from "@/components/system/print-books/useCoverPrint";
import { api } from "@/lib/api";
import type { BlankBookOrder } from "@/lib/api/modules/blank-book";
import { UI } from "@/lib/constants/ui-strings";
import BlankBookPaymentPanel from "./BlankBookPaymentPanel";
import { useBlankBookPrint } from "./useBlankBookPrint";

const FONT_ID = DEFAULT_CALLIGRAPHY_FONT_ID;
const POLL_MS = 8000;

/** Trang đơn của khách: chờ thanh toán (QR, tự cập nhật) → tải bìa + ruột sổ trống. */
export default function BlankBookOrderView({ accessToken }: { accessToken: string }) {
  const [order, setOrder] = useState<BlankBookOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const load = async () => {
      try {
        const data = await api.blankBook.getOrder(accessToken);
        if (cancelled) return;
        setOrder(data);
        if (data.status === "PENDING") timer = window.setTimeout(load, POLL_MS);
      } catch {
        if (!cancelled) setNotFound(true);
      }
    };
    void load();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [accessToken]);

  if (notFound) return <p className={`text-sm ${AC.muted}`}>{UI.BLANK_BOOK_ORDER_NOT_FOUND}</p>;
  if (!order) return <p className={`text-sm ${AC.muted}`}>{UI.LOADING}</p>;

  return (
    <div className="space-y-5">
      <OrderSummary order={order} />
      {order.status === "PENDING" && order.payment ? <BlankBookPaymentPanel order={order} payment={order.payment} /> : null}
      {order.status === "PAID" ? <DownloadPanel order={order} /> : null}
      {order.status === "CANCELLED" ? <p className={`text-sm ${AC.muted}`}>{UI.BLANK_BOOK_CANCELLED}</p> : null}
    </div>
  );
}

function OrderSummary({ order }: { order: BlankBookOrder }) {
  const rows: [string, string][] = [
    [UI.BLANK_BOOK_ORDER_CODE, order.code],
    [UI.BLANK_BOOK_ORDER_CLAN, order.clanName],
    [UI.BLANK_BOOK_ORDER_PAGES, String(order.pageCount)],
    [UI.BLANK_BOOK_ORDER_AMOUNT, formatVnd(order.amountVnd)],
  ];
  return (
    <dl className={`${AC.cardMuted} grid gap-2 p-4 text-sm sm:grid-cols-4`}>
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className={AC.label}>{k}</dt>
          <dd className="font-semibold text-[#321716]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function DownloadPanel({ order }: { order: BlankBookOrder }) {
  const fontFamily = getCalligraphyFont(FONT_ID).cssValue;
  const printer = useBlankBookPrint(FONT_ID);
  const sample = COVER_SAMPLES[order.coverIndex] ?? COVER_SAMPLES[0];
  const content = useMemo(
    () =>
      buildCoverContent("giaPha", {
        clanName: order.clanName,
        establishedYear: order.establishedYear ?? "",
        clanAddress: order.clanAddress ?? "",
      }),
    [order.clanName, order.establishedYear, order.clanAddress],
  );
  const settings = useMemo(() => blankBookSettings(order.clanName, FONT_ID), [order.clanName]);

  useEffect(() => {
    void loadCalligraphyFont(FONT_ID);
  }, []);

  return (
    <section className={`${AC.card} p-5`}>
      <h2 className={AC.sectionTitle}>{UI.BLANK_BOOK_PAID_TITLE}</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void printer.print("cover")}
          disabled={printer.busy}
          className="rounded-xl bg-[#944a00] px-5 py-3 text-sm font-semibold text-white hover:bg-[#7a3d00] disabled:opacity-60"
        >
          {UI.BLANK_BOOK_DOWNLOAD_COVER}
        </button>
        <button
          type="button"
          onClick={() => void printer.print("inner")}
          disabled={printer.busy}
          className="rounded-xl bg-[#321716] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4a2c2a] disabled:opacity-60"
        >
          {UI.BLANK_BOOK_DOWNLOAD_INNER(order.pageCount)}
        </button>
      </div>
      <p className={`mt-3 text-xs ${AC.label}`}>{UI.BLANK_BOOK_DOWNLOAD_HINT}</p>

      {printer.mode === "cover" ? <CoverPrintSheets sample={sample} content={content} fontFamily={fontFamily} bleedMm={COVER_BLEED_MM} /> : null}
      {printer.mode === "inner" ? (
        <BlankBookPrintStack settings={settings} pageCount={order.pageCount} clanFooterLabel={formatCoverSubtitle(order.clanName)} />
      ) : null}
    </section>
  );
}
