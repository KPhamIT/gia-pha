"use client";

import { useState } from "react";
import { AC } from "@/components/auth/account-theme";
import { formatVnd } from "@/components/family-tree/events/event-format";
import type { BlankBookOrder, BlankBookPayment } from "@/lib/api/modules/blank-book";
import { UI } from "@/lib/constants/ui-strings";

const FALLBACK_QR = "/images/payment-qr.webp";

/** QR + thông tin chuyển khoản (nội dung = mã đơn) và trạng thái đang chờ xác nhận. */
export default function BlankBookPaymentPanel({ order, payment }: { order: BlankBookOrder; payment: BlankBookPayment }) {
  const bankRows: [string, string][] = [
    [UI.PAYMENT_BANK, payment.bankName],
    [UI.PAYMENT_ACCOUNT_NUMBER, payment.accountNumber],
    [UI.PAYMENT_ACCOUNT_NAME, payment.accountName],
    [UI.BLANK_BOOK_ORDER_AMOUNT, formatVnd(order.amountVnd)],
    [UI.BLANK_BOOK_TRANSFER_CONTENT, order.code],
  ];
  return (
    <section className={`${AC.card} p-5`}>
      <h2 className={AC.sectionTitle}>{UI.BLANK_BOOK_PAY_TITLE}</h2>
      <p className={`mt-1 text-sm ${AC.muted}`}>{UI.BLANK_BOOK_PAY_HINT(order.code)}</p>
      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        {/* eslint-disable-next-line @next/next/no-img-element -- QR có thể là URL ngoài (env PAYMENT_QR_URL) */}
        <img
          src={payment.qrImageUrl || FALLBACK_QR}
          alt={UI.PAYMENT_QR_HINT}
          onError={(e) => {
            if (!e.currentTarget.src.endsWith(FALLBACK_QR)) e.currentTarget.src = FALLBACK_QR;
          }}
          className="h-56 w-56 rounded-lg border border-[#d4c3c1] object-contain"
        />
        <dl className="w-full space-y-2 text-sm">
          {bankRows
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-[#eee4dc] pb-1.5">
                <dt className={AC.label}>{k}</dt>
                <dd className="text-right font-semibold text-[#321716]">
                  <CopyValue value={v} />
                </dd>
              </div>
            ))}
        </dl>
      </div>
      <p className="mt-4 flex items-center gap-2 rounded-lg bg-[#fdf1e2] p-3 text-sm text-[#7a3d00]" role="status">
        <span className="inline-block h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[#944a00]" aria-hidden />
        {UI.BLANK_BOOK_WAITING}
      </p>
    </section>
  );
}

function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    void navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  return (
    <button type="button" onClick={copy} className="text-right hover:text-[#944a00]" title={UI.PAYMENT_COPY}>
      {value} <span className={`text-xs font-normal ${AC.label}`}>{copied ? UI.PAYMENT_COPIED : UI.PAYMENT_COPY}</span>
    </button>
  );
}
