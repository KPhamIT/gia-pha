"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import { CT } from "./contribution-theme";
import { formatVnd } from "./event-format";
import { isFullyPaid, personMeta } from "./event-contribution-utils";
import type { Person } from "@/components/types/family-tree-types";

type Props = {
  member: Person;
  amount: number;
  amountPerPerson: number;
  inputValue: string;
  saving: boolean;
  readOnly?: boolean;
  onToggle: () => void;
  onInputChange: (value: string) => void;
  onCommit: () => void;
};

function StatusIcon({ paid }: { paid: boolean }) {
  return (
    <span
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${
        paid
          ? "border-[#ea580c] bg-[#ea580c] text-white"
          : "border-neutral-300 bg-white text-transparent"
      }`}
    >
      <Icon
        path="check"
        size={14}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        pointer={false}
      />
    </span>
  );
}

function MemberInfo({
  member,
  meta,
  paid,
  partial,
  amount,
  amountPerPerson,
}: {
  member: Person;
  meta: string;
  paid: boolean;
  partial: boolean;
  amount: number;
  amountPerPerson: number;
}) {
  return (
    <>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-[#321716]">
          {member.fullName}
        </span>
        {meta ? (
          <span className="block truncate text-xs text-[#827472]">{meta}</span>
        ) : null}
      </span>
      <span
        className={`shrink-0 text-xs font-semibold ${
          paid || partial ? CT.statsPaid : "text-neutral-400"
        }`}
      >
        {paid
          ? UI.EVENT_PAID
          : partial
            ? amountPerPerson > 0
              ? `${formatVnd(amount)} / ${formatVnd(amountPerPerson)}`
              : formatVnd(amount)
            : UI.EVENT_UNPAID}
      </span>
    </>
  );
}

export default function ContributionMemberRow({
  member,
  amount,
  amountPerPerson,
  inputValue,
  saving,
  readOnly = false,
  onToggle,
  onInputChange,
  onCommit,
}: Props) {
  const paid = isFullyPaid(amount, amountPerPerson);
  const partial = amount > 0 && !paid;
  const meta = personMeta(member);

  if (readOnly) {
    return (
      <li>
        <div className="flex min-w-0 items-center gap-3 px-4 py-3">
          <StatusIcon paid={paid} />
          <MemberInfo
            member={member}
            meta={meta}
            paid={paid}
            partial={partial}
            amount={amount}
            amountPerPerson={amountPerPerson}
          />
        </div>
      </li>
    );
  }

  return (
    <li>
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          disabled={saving}
          className="flex min-w-0 flex-1 items-center gap-3 text-left active:bg-amber-50/80 disabled:opacity-60"
        >
          <StatusIcon paid={paid} />
          <MemberInfo
            member={member}
            meta={meta}
            paid={paid}
            partial={partial}
            amount={amount}
            amountPerPerson={amountPerPerson}
          />
        </button>
        {!paid ? (
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            disabled={saving}
            placeholder={UI.EVENT_AMOUNT_PAID_PLACEHOLDER}
            onChange={(e) => onInputChange(e.target.value)}
            onBlur={onCommit}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-24 shrink-0 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-right text-xs text-neutral-800 outline-none focus:border-[#944a00] focus:ring-1 focus:ring-[#944a00]/30 disabled:opacity-60"
          />
        ) : null}
      </div>
    </li>
  );
}
