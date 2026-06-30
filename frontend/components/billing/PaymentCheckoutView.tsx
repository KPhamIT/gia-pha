"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatVnd } from "@/components/family-tree/events/event-format";
import { api } from "@/lib/api";
import type { BillingOrder, PaymentQuote } from "@/lib/api/modules/billing";
import {
  tierColorClass,
  tierDotClass,
  tierLabel,
} from "@/lib/constants/billing";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { useAuthStore } from "@/store/authStore";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";

type PaymentCheckoutViewProps = {
  organizationId: number;
};

function copyText(text: string) {
  return navigator.clipboard.writeText(text);
}

function orderStatusLabel(status: BillingOrder["status"]): string {
  switch (status) {
    case "PENDING_PAYMENT":
      return UI.PAYMENT_STATUS_PENDING;
    case "AWAITING_REVIEW":
      return UI.PAYMENT_STATUS_REVIEW;
    case "CONFIRMED":
      return UI.PAYMENT_STATUS_CONFIRMED;
    case "REJECTED":
      return UI.PAYMENT_STATUS_REJECTED;
    case "EXPIRED":
      return UI.PAYMENT_STATUS_EXPIRED;
    case "CANCELLED":
      return UI.PAYMENT_STATUS_CANCELLED;
    default:
      return status;
  }
}

export default function PaymentCheckoutView({
  organizationId,
}: PaymentCheckoutViewProps) {
  const router = useRouter();
  const { isLoggedIn } = useFeatureAccess();
  const user = useAuthStore((s) => s.user);
  const authLoaded = useAuthStore((s) => s.loaded);

  const [quote, setQuote] = useState<PaymentQuote | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<BillingOrder | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!authLoaded || !isLoggedIn) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    void api.billing
      .getQuote(organizationId)
      .then((data) => {
        if (!cancelled) {
          setQuote(data);
          if (data.openOrder) setSubmittedOrder(data.openOrder);
        }
      })
      .catch(() => {
        if (!cancelled) setError(UI.PAYMENT_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoaded, isLoggedIn, organizationId]);

  useEffect(() => {
    if (user?.username) setContactName((v) => v || user.username || "");
    if (user?.email) setContactEmail((v) => v || user.email || "");
  }, [user]);

  const handleSubmitPaid = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const order = await api.billing.submitPaid({
        organizationId,
        contactName: contactName || undefined,
        contactPhone: contactPhone || undefined,
        contactEmail: contactEmail || undefined,
        note: note || undefined,
      });
      setSubmittedOrder(order);
    } catch {
      setError(UI.PAYMENT_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = async () => {
    if (!submittedOrder?.transferCode) return;
    await copyText(submittedOrder.transferCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!authLoaded) {
    return <p className={`text-sm ${BT.mutedOnLight}`}>{UI.PAYMENT_LOADING}</p>;
  }

  if (!isLoggedIn) {
    return (
      <div className="space-y-4">
        <p className={`text-sm leading-relaxed ${BT.mutedOnLight}`}>
          {UI.PAYMENT_LOGIN_REQUIRED}
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`}
        >
          {UI.AUTH_GATE_LOGIN_TITLE}
        </button>
      </div>
    );
  }

  if (loading && !quote) {
    return <p className={`text-sm ${BT.mutedOnLight}`}>{UI.PAYMENT_LOADING}</p>;
  }

  if (!quote) {
    return error ? <p className={BT.errorBgLight}>{error}</p> : null;
  }

  const order = submittedOrder;
  const awaitingReview = order?.status === "AWAITING_REVIEW";
  const qrUrl = quote.bankDisplay.qrImageUrl || "/images/payment-qr.svg";
  const displayTier = order?.tier ?? quote.tier;

  return (
    <div className="space-y-5">
      {error ? <p className={BT.errorBgLight}>{error}</p> : null}

      <p className={`text-sm leading-relaxed ${BT.mutedOnLight}`}>
        {UI.PAYMENT_STEPS_HINT}
      </p>

      <section
        className={`${BT.card} border-2 p-4 ${tierColorClass(displayTier)}`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${tierDotClass(displayTier)}`}
            aria-hidden
          />
          <h2 className="text-sm font-semibold text-neutral-900">
            {UI.PAYMENT_SUMMARY}
          </h2>
        </div>
        <dl className={`mt-3 space-y-2 text-sm ${BT.mutedOnLight}`}>
          <div className="flex justify-between gap-3">
            <dt>{UI.PAYMENT_ORG}</dt>
            <dd className="font-medium text-neutral-900">
              {quote.organizationName}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>{UI.PAYMENT_TIER}</dt>
            <dd className="font-medium text-neutral-900">
              {order?.tierLabel ?? quote.tierLabel ?? tierLabel(quote.tier)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>{UI.PAYMENT_PERSONS}</dt>
            <dd className="text-neutral-800">{quote.personCount}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>{UI.PAYMENT_AMOUNT}</dt>
            <dd className={`font-bold ${BT.money}`}>
              {formatVnd(order?.amountVnd ?? quote.amountVnd)}
            </dd>
          </div>
          {order ? (
            <div className="flex justify-between gap-3">
              <dt>Trạng thái</dt>
              <dd className="font-medium text-neutral-800">
                {orderStatusLabel(order.status)}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      {!awaitingReview ? (
        <>
          <section className={`${BT.card} p-4`}>
            <p className={`text-center text-sm ${BT.mutedOnLight}`}>
              {UI.PAYMENT_QR_HINT}
            </p>
            <div className="mx-auto mt-4 flex justify-center">
              <div className="relative h-56 w-56 overflow-hidden rounded-xl border border-amber-200/80 bg-white shadow-inner">
                <Image
                  src={qrUrl}
                  alt="QR thanh toán"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
            </div>

            {(quote.bankDisplay.accountName ||
              quote.bankDisplay.accountNumber) && (
              <ul
                className={`mt-4 space-y-1.5 border-t border-amber-200/60 pt-4 text-sm ${BT.mutedOnLight}`}
              >
                {quote.bankDisplay.accountName ? (
                  <li>
                    <span className="font-medium text-neutral-800">
                      {UI.PAYMENT_ACCOUNT_NAME}:
                    </span>{" "}
                    {quote.bankDisplay.accountName}
                  </li>
                ) : null}
                {quote.bankDisplay.accountNumber ? (
                  <li>
                    <span className="font-medium text-neutral-800">
                      {UI.PAYMENT_ACCOUNT_NUMBER}:
                    </span>{" "}
                    {quote.bankDisplay.accountNumber}
                  </li>
                ) : null}
                {quote.bankDisplay.bankName ? (
                  <li>
                    <span className="font-medium text-neutral-800">
                      {UI.PAYMENT_BANK}:
                    </span>{" "}
                    {quote.bankDisplay.bankName}
                  </li>
                ) : null}
              </ul>
            )}
          </section>

          <div className={`${BT.card} space-y-3 p-4`}>
            <h2 className="text-sm font-semibold text-neutral-900">
              {UI.PAYMENT_CONTACT_SECTION}
            </h2>
            <label className="block text-sm">
              <span className={BT.mutedOnLight}>{UI.PAYMENT_CONTACT_NAME}</span>
              <input
                className={`${BT.input} mt-1`}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className={BT.mutedOnLight}>{UI.PAYMENT_CONTACT_PHONE}</span>
              <input
                className={`${BT.input} mt-1`}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className={BT.mutedOnLight}>{UI.PAYMENT_CONTACT_EMAIL}</span>
              <input
                type="email"
                className={`${BT.input} mt-1`}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className={BT.mutedOnLight}>{UI.PAYMENT_NOTE}</span>
              <textarea
                className={`${BT.textarea} mt-1 min-h-[80px]`}
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
          </div>

          <p className={`text-xs leading-relaxed ${BT.mutedOnLight}`}>
            {UI.PAYMENT_AMOUNT_WARNING}
          </p>
          <p className={`text-xs leading-relaxed ${BT.mutedOnLight}`}>
            {UI.PAYMENT_PROCESSING_HINT}
          </p>

          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleSubmitPaid()}
            className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} w-full`}
          >
            {UI.PAYMENT_MARK_PAID}
          </button>
        </>
      ) : (
        <>
          <p
            className={`rounded-xl ${BT.bandHeader} px-4 py-3 text-center text-sm font-medium`}
          >
            {UI.PAYMENT_ALREADY_SUBMITTED}
          </p>

          {order ? (
            <section
              className={`rounded-2xl border-2 p-4 ${tierColorClass(order.tier)}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-700">
                {UI.PAYMENT_TRANSFER_CODE}
              </p>
              <p className="mt-2 font-mono text-xl font-bold tracking-wider text-neutral-900">
                {order.transferCode}
              </p>
              <p className={`mt-2 text-xs leading-relaxed ${BT.mutedOnLight}`}>
                {UI.PAYMENT_TRANSFER_CODE_HINT}
              </p>
              <button
                type="button"
                onClick={() => void handleCopyCode()}
                className={`${BT.btnBase} ${BT.btnSm} ${BT.btnGold} mt-3`}
              >
                {copied ? UI.PAYMENT_COPIED : UI.PAYMENT_COPY}
              </button>
            </section>
          ) : null}
        </>
      )}

      {order?.status === "CONFIRMED" ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {UI.PAYMENT_STATUS_CONFIRMED}
        </p>
      ) : null}

      {order?.status === "REJECTED" && order.reviewNote ? (
        <p className={BT.errorBgLight}>{order.reviewNote}</p>
      ) : null}

      <Link
        href="/bang-gia"
        className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline} inline-flex`}
      >
        ← {UI.PRICING_PAGE_TITLE}
      </Link>
    </div>
  );
}
