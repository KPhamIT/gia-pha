'use client';

import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';
import { formatVnd } from './event-format';
import { isFullyPaid, personMeta } from './event-contribution-utils';
import type { Person } from '@/components/types/family-tree-types';

type Props = {
  member: Person;
  amount: number;
  amountPerPerson: number;
  inputValue: string;
  saving: boolean;
  onToggle: () => void;
  onInputChange: (value: string) => void;
  onCommit: () => void;
};

export default function ContributionMemberRow({
  member,
  amount,
  amountPerPerson,
  inputValue,
  saving,
  onToggle,
  onInputChange,
  onCommit,
}: Props) {
  const paid = isFullyPaid(amount, amountPerPerson);
  const partial = amount > 0 && !paid;
  const meta = personMeta(member);

  return (
    <li>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={onToggle}
          disabled={saving}
          className="flex min-w-0 flex-1 items-center gap-3 text-left active:bg-amber-50 disabled:opacity-60"
        >
          <span
            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
              paid ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300 text-transparent'
            }`}
          >
            <Icon path="check" size={14} fill="none" stroke="currentColor" strokeWidth={3} pointer={false} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-slate-800">{member.fullName}</span>
            {meta ? <span className="block truncate text-xs text-slate-400">{meta}</span> : null}
          </span>
          <span
            className={`shrink-0 text-xs font-semibold ${
              paid ? 'text-amber-700' : partial ? 'text-amber-700' : 'text-slate-400'
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
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-24 shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-right text-xs text-slate-800 outline-none focus:border-amber-400 disabled:opacity-60"
          />
        ) : null}
      </div>
    </li>
  );
}
