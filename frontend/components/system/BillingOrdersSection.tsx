"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatVnd } from "@/components/family-tree/events/event-format";
import OrgUsersTabBar from "@/components/org/OrgUsersTabBar";
import { AC } from "@/components/auth/account-theme";
import { api } from "@/lib/api";
import type { BillingOrder, BillingOrderStatus } from "@/lib/api/modules/billing";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

type Tab = "pending" | "done" | "all";

type Props = {
  variant?: "book" | "landing";
};

const PENDING_STATUSES: BillingOrderStatus[] = [
  "PENDING_PAYMENT",
  "AWAITING_REVIEW",
];
const DONE_STATUSES: BillingOrderStatus[] = [
  "CONFIRMED",
  "REJECTED",
  "CANCELLED",
  "EXPIRED",
];

const BILLING_TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: UI.BILLING_ADMIN_TAB_PENDING },
  { id: "done", label: UI.BILLING_ADMIN_TAB_DONE },
  { id: "all", label: UI.BILLING_ADMIN_TAB_ALL },
];

function filterOrders(orders: BillingOrder[], tab: Tab): BillingOrder[] {
  if (tab === "all") return orders;
  if (tab === "pending") {
    return orders.filter((o) => PENDING_STATUSES.includes(o.status));
  }
  return orders.filter((o) => DONE_STATUSES.includes(o.status));
}

function orderStatusLabel(status: BillingOrderStatus): string {
  return UI.BILLING_ORDER_STATUS[status] ?? status;
}

function formatContact(order: BillingOrder): string {
  return [order.contactName, order.contactPhone, order.contactEmail]
    .filter(Boolean)
    .join(" · ");
}

export default function BillingOrdersSection({ variant = "book" }: Props) {
  const isLanding = variant === "landing";
  const [tab, setTab] = useState<Tab>("pending");
  const [orders, setOrders] = useState<BillingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);

  const loadingClass = isLanding ? AC.muted : BT.mutedOnDark;
  const cardClass = isLanding ? AC.card : BT.card;
  const inputClass = isLanding ? AC.input : BT.input;
  const mutedClass = isLanding ? AC.muted : BT.mutedOnLight;
  const dividerClass = isLanding ? "border-[#d4c3c1]" : BT.dividerOnLight;
  const selectedRing = isLanding ? "ring-2 ring-[#944a00]" : "ring-2 ring-amber-500";
  const confirmBtnClass = isLanding
    ? "rounded-xl bg-[#321716] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#4a2a28] disabled:opacity-50"
    : `${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} w-full sm:w-auto`;
  const rejectBtnClass = isLanding
    ? "mt-3 rounded-xl border border-[#d4c3c1] bg-white px-4 py-2 text-sm font-semibold text-[#93000a] transition hover:bg-[#ffdad6] disabled:opacity-50"
    : `${BT.btnBase} ${BT.btnSm} ${BT.btnDanger} mt-3 w-full sm:w-auto`;

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.billing.listOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const visible = useMemo(() => filterOrders(orders, tab), [orders, tab]);
  const selected = visible.find((o) => o.id === selectedId) ?? null;

  const handleConfirm = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      await api.billing.confirm(selected.id, {
        paymentRef: paymentRef || undefined,
        reviewNote: reviewNote || undefined,
      });
      setSelectedId(null);
      setPaymentRef("");
      setReviewNote("");
      await reload();
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!selected || !rejectReason.trim()) return;
    setBusy(true);
    try {
      await api.billing.reject(selected.id, rejectReason.trim());
      setSelectedId(null);
      setRejectReason("");
      await reload();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {isLanding ? (
        <OrgUsersTabBar tabs={BILLING_TABS} active={tab} onChange={setTab} />
      ) : (
        <div className="flex flex-wrap gap-2">
          {BILLING_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={tab === id ? BT.pillActive : BT.pillIdle}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className={`text-sm ${loadingClass}`}>{UI.LOADING}</p>
      ) : visible.length === 0 ? (
        <p className={`text-sm ${loadingClass}`}>{UI.BILLING_ADMIN_EMPTY}</p>
      ) : (
        <ul className="space-y-2">
          {visible.map((order) => (
            <li key={order.id}>
              <button
                type="button"
                onClick={() => setSelectedId(order.id)}
                className={`${cardClass} w-full px-4 py-3 text-left text-sm text-neutral-900 ${
                  selectedId === order.id ? selectedRing : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`font-mono font-semibold ${isLanding ? "text-[#944a00]" : "text-amber-900"}`}
                  >
                    {order.transferCode}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === "AWAITING_REVIEW"
                        ? isLanding
                          ? "bg-[#f6f3ee] text-[#944a00]"
                          : "bg-amber-100 text-amber-900"
                        : isLanding
                          ? "bg-[#f6f3ee] text-[#504443]"
                          : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {orderStatusLabel(order.status)}
                  </span>
                </div>
                <p
                  className={`mt-1 font-medium ${isLanding ? "text-[#321716]" : "text-neutral-900"}`}
                >
                  {order.organizationName}
                </p>
                <p className={`text-xs ${mutedClass}`}>
                  {formatVnd(order.amountVnd)} · {order.tierLabel} ·{" "}
                  {order.personCountAtOrder} người
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected &&
      (selected.status === "PENDING_PAYMENT" ||
        selected.status === "AWAITING_REVIEW") ? (
        <div className={`${cardClass} space-y-4 p-4 text-neutral-900 md:p-6`}>
          <div>
            <h3
              className={`text-sm font-semibold ${isLanding ? "text-[#321716]" : "text-neutral-900"}`}
            >
              {selected.organizationName}
            </h3>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              {formatVnd(selected.amountVnd)} · {selected.tierLabel}
            </p>
            {formatContact(selected) ? (
              <p className={`mt-2 text-sm ${mutedClass}`}>
                {formatContact(selected)}
              </p>
            ) : null}
          </div>

          <label className="block text-sm">
            <span
              className={`font-medium ${isLanding ? "text-[#504443]" : "text-neutral-800"}`}
            >
              {UI.BILLING_ADMIN_PAYMENT_REF}
            </span>
            <input
              className={`${inputClass} mt-1`}
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span
              className={`font-medium ${isLanding ? "text-[#504443]" : "text-neutral-800"}`}
            >
              {UI.BILLING_ADMIN_REVIEW_NOTE}
            </span>
            <input
              className={`${inputClass} mt-1`}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleConfirm()}
            className={confirmBtnClass}
          >
            {UI.BILLING_ADMIN_CONFIRM}
          </button>

          <div className={`border-t ${dividerClass} pt-4`}>
            <label className="block text-sm">
              <span
                className={`font-medium ${isLanding ? "text-[#504443]" : "text-neutral-800"}`}
              >
                {UI.BILLING_ADMIN_REJECT_REASON}
              </span>
              <input
                className={`${inputClass} mt-1`}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </label>
            <button
              type="button"
              disabled={busy || !rejectReason.trim()}
              onClick={() => void handleReject()}
              className={rejectBtnClass}
            >
              {UI.BILLING_ADMIN_REJECT}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
