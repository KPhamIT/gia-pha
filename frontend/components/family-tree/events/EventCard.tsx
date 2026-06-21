'use client';

import IconRoundButton from '@/components/ui/IconRoundButton';
import { UI } from '@/lib/constants/ui-strings';
import type { FamilyEvent } from '@/components/types/event-types';
import { formatEventDate, formatVnd } from './event-format';
import { ET } from './event-theme';

type Props = {
  event: FamilyEvent;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onViewContribution: () => void;
  onViewDonation: () => void;
};

export default function EventCard({
  event,
  canEdit,
  onEdit,
  onDelete,
  onViewContribution,
  onViewDonation,
}: Props) {
  const date = formatEventDate(event.eventDate);
  const isContribution = event.type === 'CONTRIBUTION';

  return (
    <article className={`${ET.card} flex flex-col p-4 transition-shadow md:p-5 md:hover:shadow-xl`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isContribution ? 'bg-amber-700 text-amber-50' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isContribution ? UI.EVENT_BADGE_CONTRIBUTION : UI.EVENT_BADGE_INFO}
            </span>
            {isContribution && event.maleOnly ? (
              <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                {UI.EVENT_MALE_ONLY_BADGE}
              </span>
            ) : null}
            {date ? <span className="text-xs text-neutral-400">{date}</span> : null}
          </div>
          <h2 className="mt-1.5 text-base font-semibold text-neutral-900 md:text-lg">{event.title}</h2>
        </div>
        {canEdit ? (
          <div className="flex shrink-0 gap-1">
            <IconRoundButton icon="edit" variant="outline" iconSize={14} label={UI.BTN_EDIT} onClick={onEdit} />
            <IconRoundButton icon="trash" variant="danger" iconSize={14} label={UI.DELETE_PERSON} onClick={onDelete} />
          </div>
        ) : null}
      </div>

      {event.description ? (
        <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-neutral-600 md:line-clamp-4">
          {event.description}
        </p>
      ) : null}

      <div className="mt-auto border-t border-amber-200/60 pt-3 md:pt-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-neutral-500">
            {isContribution ? UI.EVENT_PAID_COUNT_SHORT(event.paidCount) : UI.EVENT_DONATION_TOTAL}
          </span>
          <span className={`font-bold tabular-nums ${ET.money}`}>{formatVnd(event.grandTotal)}</span>
        </div>
        <div className="mt-3 flex gap-2">
          {isContribution ? (
            <IconRoundButton
              icon="list"
              variant="primary"
              label={UI.EVENT_VIEW_CONTRIBUTION}
              compact={false}
              className="flex-1"
              onClick={onViewContribution}
            />
          ) : null}
          <IconRoundButton
            icon="userPlus"
            variant="outline"
            label={UI.EVENT_VIEW_DONATION}
            compact={false}
            className={isContribution ? 'flex-1' : 'w-full'}
            onClick={onViewDonation}
          />
        </div>
      </div>
    </article>
  );
}
