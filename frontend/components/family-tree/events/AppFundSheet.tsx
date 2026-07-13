"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FullScreenSheet from "@/components/ui/FullScreenSheet";
import {
  FormField,
  inputClassName,
  textareaClassName,
} from "@/components/ui/CollapsibleSection";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { api } from "@/lib/api";
import type {
  AppFundContribution,
  AppFundSummary,
} from "@/lib/api/modules/app-fund";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useAuthStore } from "@/store/authStore";
import { formatVnd, parseVndInput } from "./event-format";

type Props = {
  organizationId: number;
  initialMode?: "donate" | "donors";
  onClose: () => void;
};

export default function AppFundSheet({
  organizationId,
  initialMode = "donate",
  onClose,
}: Props) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userEmail = useAuthStore((s) => s.user?.email ?? "");
  const { canMutate } = useFeatureAccess();
  const [mode, setMode] = useState<"donate" | "donors">(initialMode);
  const [summary, setSummary] = useState<AppFundSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitted, setSubmitted] = useState<AppFundContribution | null>(null);
  const [copied, setCopied] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const next = await api.appFund.getSummary(organizationId);
      setSummary(next);
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (userEmail && !contactEmail) setContactEmail(userEmail);
  }, [userEmail, contactEmail]);

  const handleSubmitPaid = async () => {
    if (!isLoggedIn) {
      alert(UI.EVENTS_APP_FUND_LOGIN_REQUIRED);
      return;
    }
    const parsedAmount = parseVndInput(amount);
    if (!donorName.trim() || parsedAmount <= 0) {
      alert(UI.EVENTS_APP_FUND_REQUIRED_FIELDS);
      return;
    }
    setSaving(true);
    try {
      const result = await api.appFund.submitPaid({
        organizationId,
        donorName: donorName.trim(),
        amount: parsedAmount,
        note: note.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
      });
      setSummary(result.summary);
      setSubmitted(result.contribution);
      setDonorName("");
      setAmount("");
      setNote("");
    } catch {
      /* axios toast */
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCode = async () => {
    if (!submitted?.transferCode) return;
    try {
      await navigator.clipboard.writeText(submitted.transferCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleRemove = async (id: number) => {
    if (!canMutate) return;
    if (!window.confirm(UI.EVENTS_APP_FUND_DELETE_CONFIRM)) return;
    setSaving(true);
    try {
      const next = await api.appFund.remove(id);
      setSummary(next);
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  };

  const qrUrl =
    summary?.bankDisplay.qrImageUrl || "/images/payment-qr.webp";

  return (
    <FullScreenSheet
      title={
        mode === "donors"
          ? UI.EVENTS_APP_FUND_SHEET_DONORS_TITLE
          : UI.EVENTS_APP_FUND_SHEET_TITLE
      }
      onClose={onClose}
      tone="book"
    >
      <div className="space-y-4 p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size={36} label={UI.LOADING} />
          </div>
        ) : summary ? (
          <>
            <FundSummaryCard summary={summary} canMutate={canMutate} />

            {mode === "donors" ? (
              <>
                <ContributionList
                  summary={summary}
                  canRemove={canMutate}
                  onRemove={handleRemove}
                  confirmedOnly
                />
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                    setMode("donate");
                  }}
                  className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} w-full`}
                >
                  {UI.EVENTS_APP_FUND_DONATE_AGAIN}
                </button>
              </>
            ) : submitted ? (
              <SubmittedBlock
                contribution={submitted}
                copied={copied}
                onCopy={() => void handleCopyCode()}
                onNew={() => setSubmitted(null)}
              />
            ) : (
              <PaymentForm
                qrUrl={qrUrl}
                bank={summary.bankDisplay}
                donorName={donorName}
                amount={amount}
                note={note}
                contactEmail={contactEmail}
                saving={saving}
                disabled={!isLoggedIn}
                onDonorName={setDonorName}
                onAmount={setAmount}
                onNote={setNote}
                onContactEmail={setContactEmail}
                onSubmit={() => void handleSubmitPaid()}
              />
            )}

            {mode === "donate" ? (
              <ContributionList
                summary={summary}
                canRemove={canMutate}
                onRemove={handleRemove}
              />
            ) : null}
          </>
        ) : (
          <p className="text-sm text-neutral-600">{UI.EVENTS_LOAD_ERROR}</p>
        )}
      </div>
    </FullScreenSheet>
  );
}

function PaymentForm({
  qrUrl,
  bank,
  donorName,
  amount,
  note,
  contactEmail,
  saving,
  disabled,
  onDonorName,
  onAmount,
  onNote,
  onContactEmail,
  onSubmit,
}: {
  qrUrl: string;
  bank: AppFundSummary["bankDisplay"];
  donorName: string;
  amount: string;
  note: string;
  contactEmail: string;
  saving: boolean;
  disabled: boolean;
  onDonorName: (v: string) => void;
  onAmount: (v: string) => void;
  onNote: (v: string) => void;
  onContactEmail: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-amber-200/80 bg-white p-4">
      <p className="text-center text-sm text-neutral-600">
        {UI.EVENTS_APP_FUND_QR_HINT}
      </p>
      <div className="mx-auto flex justify-center">
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
      {(bank.accountName || bank.accountNumber) && (
        <ul className="space-y-1.5 border-t border-amber-200/60 pt-4 text-sm text-neutral-600">
          {bank.accountName ? (
            <li>
              <span className="font-medium text-neutral-800">
                {UI.PAYMENT_ACCOUNT_NAME}:
              </span>{" "}
              {bank.accountName}
            </li>
          ) : null}
          {bank.accountNumber ? (
            <li>
              <span className="font-medium text-neutral-800">
                {UI.PAYMENT_ACCOUNT_NUMBER}:
              </span>{" "}
              {bank.accountNumber}
            </li>
          ) : null}
          {bank.bankName ? (
            <li>
              <span className="font-medium text-neutral-800">
                {UI.PAYMENT_BANK}:
              </span>{" "}
              {bank.bankName}
            </li>
          ) : null}
        </ul>
      )}

      <FormField label={UI.EVENTS_APP_FUND_DONOR_LABEL}>
        <input
          className={inputClassName}
          value={donorName}
          placeholder={UI.EVENTS_APP_FUND_DONOR_PLACEHOLDER}
          onChange={(e) => onDonorName(e.target.value)}
          disabled={saving || disabled}
        />
      </FormField>
      <FormField label={UI.EVENTS_APP_FUND_AMOUNT_LABEL}>
        <input
          className={inputClassName}
          inputMode="numeric"
          value={amount}
          placeholder={UI.EVENTS_APP_FUND_AMOUNT_PLACEHOLDER}
          onChange={(e) => onAmount(e.target.value.replace(/[^\d]/g, ""))}
          disabled={saving || disabled}
        />
      </FormField>
      <FormField label={UI.EVENTS_APP_FUND_EMAIL_LABEL}>
        <input
          type="email"
          className={inputClassName}
          value={contactEmail}
          placeholder={UI.EVENTS_APP_FUND_EMAIL_PLACEHOLDER}
          onChange={(e) => onContactEmail(e.target.value)}
          disabled={saving || disabled}
        />
      </FormField>
      <FormField label={UI.EVENTS_APP_FUND_NOTE_LABEL}>
        <textarea
          className={textareaClassName}
          value={note}
          onChange={(e) => onNote(e.target.value)}
          disabled={saving || disabled}
        />
      </FormField>

      {disabled ? (
        <p className="text-sm text-neutral-600">
          {UI.EVENTS_APP_FUND_LOGIN_REQUIRED}
        </p>
      ) : null}

      <button
        type="button"
        disabled={saving || disabled}
        onClick={onSubmit}
        className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} w-full disabled:opacity-50`}
      >
        {UI.EVENTS_APP_FUND_SUBMIT}
      </button>
    </div>
  );
}

function SubmittedBlock({
  contribution,
  copied,
  onCopy,
  onNew,
}: {
  contribution: AppFundContribution;
  copied: boolean;
  onCopy: () => void;
  onNew: () => void;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-amber-200/80 bg-[#FAF7F2] p-4">
      <p className="rounded-xl bg-amber-100/80 px-4 py-3 text-center text-sm font-medium text-[#663100]">
        {UI.EVENTS_APP_FUND_SUBMITTED}
      </p>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-700">
          {UI.EVENTS_APP_FUND_TRANSFER_CODE}
        </p>
        <p className="mt-2 font-mono text-xl font-bold tracking-wider text-neutral-900">
          {contribution.transferCode}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-neutral-600">
          {UI.EVENTS_APP_FUND_TRANSFER_CODE_HINT}
        </p>
        <p className="mt-1 text-sm font-semibold text-[#944a00]">
          {formatVnd(contribution.amount)} · {contribution.donorName}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCopy}
          className={`${BT.btnBase} ${BT.btnSm} ${BT.btnGold}`}
        >
          {copied ? UI.EVENTS_APP_FUND_COPIED : UI.EVENTS_APP_FUND_COPY}
        </button>
        <button
          type="button"
          onClick={onNew}
          className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline}`}
        >
          {UI.EVENTS_APP_FUND_PROMO_CTA}
        </button>
      </div>
    </div>
  );
}

function FundSummaryCard({
  summary,
  canMutate,
}: {
  summary: AppFundSummary;
  canMutate: boolean;
}) {
  const expiryLabel = summary.subscriptionExpiresAt
    ? new Date(summary.subscriptionExpiresAt).toLocaleDateString("vi-VN")
    : null;

  return (
    <div className="space-y-3 rounded-2xl border border-amber-200/80 bg-[#FAF7F2] p-4">
      <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
        <Stat
          label={UI.EVENTS_APP_FUND_TOTAL}
          value={formatVnd(summary.totalRaisedVnd)}
        />
        <Stat
          label={UI.EVENTS_APP_FUND_REQUIRED}
          value={
            summary.requiredAmountVnd > 0
              ? formatVnd(summary.requiredAmountVnd)
              : "—"
          }
        />
        <Stat
          label={
            summary.shortfallVnd > 0
              ? UI.EVENTS_APP_FUND_SHORTFALL
              : UI.EVENTS_APP_FUND_COVERED
          }
          value={
            summary.shortfallVnd > 0
              ? formatVnd(summary.shortfallVnd)
              : formatVnd(0)
          }
          emphasize={summary.shortfallVnd > 0}
        />
      </div>
      <p className="text-xs text-neutral-600">
        {expiryLabel
          ? UI.EVENTS_APP_FUND_EXPIRES(expiryLabel)
          : UI.EVENTS_APP_FUND_EXPIRED}
        {summary.daysUntilExpiry != null && summary.daysUntilExpiry >= 0
          ? ` · ${UI.EVENTS_APP_FUND_DAYS_LEFT(summary.daysUntilExpiry)}`
          : null}
      </p>
      {canMutate ? (
        <>
          <p className="text-xs text-neutral-600">
            {UI.EVENTS_APP_FUND_ADMIN_HINT}
          </p>
          {summary.shortfallVnd > 0 ? (
            <Link
              href={`/bang-gia/thanh-toan?orgId=${summary.organizationId}`}
              className="inline-flex rounded-full bg-[#944a00] px-4 py-2 text-sm font-semibold text-white"
            >
              {UI.EVENTS_APP_FUND_PAY_CTA}
            </Link>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/80 px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p
        className={`mt-0.5 text-base font-semibold ${
          emphasize ? "text-[#7f1d1d]" : "text-[#321716]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ContributionList({
  summary,
  canRemove,
  onRemove,
  confirmedOnly,
}: {
  summary: AppFundSummary;
  canRemove: boolean;
  onRemove: (id: number) => void;
  confirmedOnly?: boolean;
}) {
  const items = confirmedOnly
    ? summary.contributions.filter((c) => c.status === "CONFIRMED")
    : summary.contributions;

  if (items.length === 0) {
    return (
      <p className="text-sm text-neutral-600">{UI.EVENTS_APP_FUND_EMPTY}</p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-start justify-between gap-3 rounded-xl border border-amber-100 bg-white px-3 py-2.5"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#321716]">
              {item.donorName}
            </p>
            <p className="text-xs text-neutral-500">
              {confirmedOnly
                ? null
                : `${UI.EVENTS_APP_FUND_STATUS[item.status] ?? item.status} · `}
              {new Date(item.createdAt).toLocaleDateString("vi-VN")}
              {!confirmedOnly && item.transferCode
                ? ` · ${item.transferCode}`
                : ""}
              {item.note ? ` · ${item.note}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm font-semibold text-[#944a00]">
              {formatVnd(item.amount)}
            </span>
            {canRemove && item.status === "CONFIRMED" ? (
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="text-xs font-semibold text-[#7f1d1d] hover:underline"
              >
                {UI.EVENTS_APP_FUND_DELETE}
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
