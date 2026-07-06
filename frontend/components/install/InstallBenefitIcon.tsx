import type { ReactNode } from "react";

type BenefitIconId = "fast" | "fullscreen" | "notifications" | "performance";

const ICONS: Record<BenefitIconId, ReactNode> = {
  fast: (
    <path
      fill="currentColor"
      d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66l.07-.12C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"
    />
  ),
  fullscreen: (
    <path
      fill="currentColor"
      d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
    />
  ),
  notifications: (
    <path
      fill="currentColor"
      d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
    />
  ),
  performance: (
    <path
      fill="currentColor"
      d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.87-2.77 7.09-6.44 7.8v2.07c4.44-.51 7.94-4.18 7.94-8.87 0-4.61-3.5-8.43-7.94-8.93zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-1.45-1.45A6.973 6.973 0 0 1 12 19z"
    />
  ),
};

type Props = {
  id: BenefitIconId;
  className?: string;
};

export default function InstallBenefitIcon({ id, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      className={className}
      aria-hidden
    >
      {ICONS[id]}
    </svg>
  );
}
