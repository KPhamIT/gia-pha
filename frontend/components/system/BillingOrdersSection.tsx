"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatVnd } from "@/components/family-tree/events/event-format";
import { api } from "@/lib/api";
import type { BillingOrder, BillingOrderStatus } from "@/lib/api/modules/billing";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

type Tab = "pending" | "done" | "all";

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

export default function BillingOrdersSection() {
  const [tab, setTab] = useState<Tab>("pending");
  const [orders, setOrders] = useState<BillingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);

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
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["pending", UI.BILLING_ADMIN_TAB_PENDING],
            ["done", UI.BILLING_ADMIN_TAB_DONE],
            ["all", UI.BILLING_ADMIN_TAB_ALL],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={tab === key ? BT.pillActive : BT.pillIdle}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>
      ) : visible.length === 0 ? (
        <p className={`text-sm ${BT.mutedOnDark}`}>{UI.BILLING_ADMIN_EMPTY}</p>
      ) : (
        <ul className="space-y-2">
          {visible.map((order) => (
            <li key={order.id}>
              <button
                type="button"
                onClick={() => setSelectedId(order.id)}
                className={`${BT.card} w-full px-4 py-3 text-left text-sm text-neutral-900 ${
                  selectedId === order.id ? "ring-2 ring-amber-500" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-semibold text-amber-900">
                    {order.transferCode}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === "AWAITING_REVIEW"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {orderStatusLabel(order.status)}
                  </span>
                </div>
                <p className="mt-1 font-medium text-neutral-900">
                  {order.organizationName}
                </p>
                <p className={`text-xs ${BT.mutedOnLight}`}>
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
        <div className={`${BT.card} space-y-4 p-4 text-neutral-900`}>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              {selected.organizationName}
            </h3>
            <p className={`mt-1 text-sm ${BT.mutedOnLight}`}>
              {formatVnd(selected.amountVnd)} · {selected.tierLabel}
            </p>
            {formatContact(selected) ? (
              <p className={`mt-2 text-sm ${BT.mutedOnLight}`}>
                {formatContact(selected)}
              </p>
            ) : null}
          </div>

          <label className="block text-sm">
            <span className="font-medium text-neutral-800">
              {UI.BILLING_ADMIN_PAYMENT_REF}
            </span>
            <input
              className={`${BT.input} mt-1`}
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-neutral-800">
              {UI.BILLING_ADMIN_REVIEW_NOTE}
            </span>
            <input
              className={`${BT.input} mt-1`}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleConfirm()}
            className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary} w-full sm:w-auto`}
          >
            {UI.BILLING_ADMIN_CONFIRM}
          </button>

          <div className={`border-t ${BT.dividerOnLight} pt-4`}>
            <label className="block text-sm">
              <span className="font-medium text-neutral-800">
                {UI.BILLING_ADMIN_REJECT_REASON}
              </span>
              <input
                className={`${BT.input} mt-1`}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </label>
            <button
              type="button"
              disabled={busy || !rejectReason.trim()}
              onClick={() => void handleReject()}
              className={`${BT.btnBase} ${BT.btnSm} ${BT.btnDanger} mt-3 w-full sm:w-auto`}
            >
              {UI.BILLING_ADMIN_REJECT}
            </button>
          </div>
        </div>
      ) : null}

      <Link
        href="/system"
        className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOnDark} inline-flex`}
      >
        ← {UI.BILLING_ADMIN_BACK}
      </Link>
    </div>
  );
}
