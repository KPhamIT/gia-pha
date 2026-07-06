import Link from "next/link";
import Icon from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/icon-paths";
import { AC } from "./account-theme";

type RowVariant = "book" | "landing";

export function InfoRow({
  label,
  value,
  muted,
  variant = "landing",
}: {
  label: string;
  value: string;
  muted?: boolean;
  variant?: RowVariant;
}) {
  if (variant === "book") {
    return (
      <div className="flex items-center justify-between gap-4 py-2.5">
        <dt className="text-neutral-500">{label}</dt>
        <dd
          className={`min-w-0 truncate text-right font-medium ${muted ? "text-neutral-400" : "text-neutral-900"}`}
        >
          {value}
        </dd>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className={AC.label}>{label}</dt>
      <dd
        className={`min-w-0 truncate text-right text-sm font-medium ${
          muted ? "text-[#827472]" : "text-[#321716]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export function MenuRow({
  href,
  icon,
  label,
  variant = "landing",
}: {
  href: string;
  icon: IconName;
  label: string;
  variant?: RowVariant;
}) {
  if (variant === "book") {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3 transition-colors active:bg-amber-50 md:hover:bg-amber-50"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-800">
          <Icon
            path={icon}
            size={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900">
          {label}
        </span>
        <Icon
          path="chevronRight"
          size={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
          className="shrink-0 text-neutral-400"
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-[#f6f3ee] active:bg-[#f0ede9]"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ffdcc5] text-[#944a00]">
        <Icon
          path={icon}
          size={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
        />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#321716]">
        {label}
      </span>
      <Icon
        path="chevronRight"
        size={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        pointer={false}
        className="shrink-0 text-[#827472]"
      />
    </Link>
  );
}
