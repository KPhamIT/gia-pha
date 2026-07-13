"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatVnd } from "@/components/family-tree/events/event-format";
import OrgUsersTabBar from "@/components/org/OrgUsersTabBar";
import { AC } from "@/components/auth/account-theme";
import { api } from "@/lib/api";
import type {
  AppFundAdminItem,
  AppFundContributionStatus,
} from "@/lib/api/modules/app-fund";
import { UI } from "@/lib/constants/ui-strings";

type Tab = "pending" | "done" | "all";

const PENDING: AppFundContributionStatus[] = ["AWAITING_REVIEW"];
const DONE: AppFundContributionStatus[] = [
  "CONFIRMED",
  "REJECTED",
  "CANCELLED",
];

const TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: UI.EVENTS_APP_FUND_ADMIN_TAB_PENDING },
  { id: "done", label: UI.EVENTS_APP_FUND_ADMIN_TAB_DONE },
  { id: "all", label: UI.EVENTS_APP_FUND_ADMIN_TAB_ALL },
];

function filterRows(rows: AppFundAdminItem[], tab: Tab): AppFundAdminItem[] {
  if (tab === "all") return rows;
  if (tab === "pending") {
    return rows.filter((r) => PENDING.includes(r.status));
  }
  return rows.filter((r) => DONE.includes(r.status));
}

export default function AppFundAdminSection() {
  const [tab, setTab] = useState<Tab>("pending");
  const [rows, setRows] = useState<AppFundAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.appFund.listAdmin();
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const visible = useMemo(() => filterRows(rows, tab), [rows, tab]);
  const selected = visible.find((r) => r.id === selectedId) ?? null;

  const handleConfirm = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      await api.appFund.confirm(selected.id, {
        reviewNote: reviewNote || undefined,
      });
      setReviewNote("");
      setSelectedId(null);
      await reload();
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!selected || !rejectReason.trim()) {
      alert(UI.EVENTS_APP_FUND_ADMIN_REJECT_REASON);
      return;
    }
    setBusy(true);
    try {
      await api.appFund.reject(selected.id, {
        reviewNote: rejectReason.trim(),
      });
      setRejectReason("");
      setSelectedId(null);
      await reload();
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-10 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[#321716]">
          {UI.EVENTS_APP_FUND_ADMIN_TITLE}
        </h2>
        <p className={`mt-1 text-sm ${AC.muted}`}>
          {UI.EVENTS_APP_FUND_ADMIN_SUBTITLE}
        </p>
      </div>

      <OrgUsersTabBar tabs={TABS} active={tab} onChange={setTab} />

      {loading ? (
        <p className={`text-sm ${AC.muted}`}>{UI.LOADING}</p>
      ) : visible.length === 0 ? (
        <p className={`text-sm ${AC.muted}`}>
          {UI.EVENTS_APP_FUND_ADMIN_EMPTY}
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((row) => {
            const active = row.id === selectedId;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(row.id)}
                  className={`${AC.card} w-full px-4 py-3 text-left transition ${
                    active ? "ring-2 ring-[#944a00]" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-[#321716]">
                      {row.organizationName}
                    </p>
                    <p className="font-semibold text-[#944a00]">
                      {formatVnd(row.amount)}
                    </p>
                  </div>
                  <p className={`mt-1 text-sm ${AC.muted}`}>
                    {row.donorName}
                    {row.transferCode ? ` · ${row.transferCode}` : ""}
                    {" · "}
                    {UI.EVENTS_APP_FUND_STATUS[row.status] ?? row.status}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selected?.status === "AWAITING_REVIEW" ? (
        <div className={`${AC.card} space-y-3 p-4`}>
          <p className="text-sm font-semibold text-[#321716]">
            {selected.donorName} · {formatVnd(selected.amount)}
            {selected.transferCode ? ` · ${selected.transferCode}` : ""}
          </p>
          <label className="block text-sm">
            <span className={AC.muted}>{UI.EVENTS_APP_FUND_ADMIN_REVIEW_NOTE}</span>
            <input
              className={`${AC.input} mt-1`}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleConfirm()}
            className="rounded-xl bg-[#321716] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#4a2a28] disabled:opacity-50"
          >
            {UI.EVENTS_APP_FUND_ADMIN_CONFIRM}
          </button>
          <label className="block text-sm">
            <span className={AC.muted}>
              {UI.EVENTS_APP_FUND_ADMIN_REJECT_REASON}
            </span>
            <input
              className={`${AC.input} mt-1`}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleReject()}
            className="rounded-xl border border-[#d4c3c1] bg-white px-4 py-2 text-sm font-semibold text-[#93000a] transition hover:bg-[#ffdad6] disabled:opacity-50"
          >
            {UI.EVENTS_APP_FUND_ADMIN_REJECT}
          </button>
        </div>
      ) : null}
    </section>
  );
}
