"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  count: number;
};

export default function ClanDutyStatsCard({ count }: Props) {
  return (
    <section className="flex items-center justify-between rounded-2xl border border-[#944a00]/10 bg-[#FEF3C7] p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#944a00] shadow-lg">
          <Icon
            path="tree"
            size={22}
            fill="none"
            stroke="white"
            strokeWidth={2}
            pointer={false}
          />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-tight text-[#944a00]">
            {UI.CLAN_DUTY_TEAM_LABEL}
          </p>
          <p className="font-serif text-2xl font-semibold leading-none text-[#321716]">
            {UI.CLAN_DUTY_TEAM_COUNT(count)}
          </p>
        </div>
      </div>
      <Icon
        path="chevronRight"
        size={22}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        pointer={false}
        className="text-[#944a00] opacity-40"
      />
    </section>
  );
}
