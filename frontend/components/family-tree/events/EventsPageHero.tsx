"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  canEdit: boolean;
  onCreate: () => void;
};

export default function EventsPageHero({ canEdit, onCreate }: Props) {
  return (
    <section className="py-4 md:py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-[#944a00]">
            {UI.EVENTS_PAGE_EYEBROW}
          </span>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-[#321716] md:text-[32px] md:leading-10">
            {UI.EVENTS_PAGE_TITLE}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-[#504443]">
            {UI.EVENTS_SUBTITLE}
          </p>
        </div>
        {canEdit ? (
          <button
            type="button"
            onClick={onCreate}
            className="hidden shrink-0 items-center gap-2 rounded-xl bg-[#321716] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 active:scale-95 md:inline-flex"
          >
            <Icon
              path="plus"
              size={18}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
            {UI.EVENTS_CREATE_DESKTOP}
          </button>
        ) : null}
      </div>
    </section>
  );
}
