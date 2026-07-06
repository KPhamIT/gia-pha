import type { ReactNode } from "react";

export type TermsIconName =
  | "gavel"
  | "verified"
  | "shield"
  | "balance"
  | "security";

const ICONS: Record<TermsIconName, ReactNode> = {
  gavel: (
    <path
      fill="currentColor"
      d="M2 20h4v2H0v-2h2zm18 0h2v2h-6v-2h4zM6 16l-2-2 8-8 2 2-8 8zm3.5-9.5L14 6l2-2 4.5 4.5-2 2-4.5-4.5zM4 10.5 2.5 9 7 4.5 8.5 6 4 10.5z"
    />
  ),
  verified: (
    <path
      fill="currentColor"
      d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14-4-4 1.41-1.41L11 12.17l5.59-5.58L18 8l-7 7z"
    />
  ),
  shield: (
    <path
      fill="currentColor"
      d="M12 1 4 4v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V4l-8-3zm-1 14-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z"
    />
  ),
  balance: (
    <path
      fill="currentColor"
      d="M12 3c-4.97 0-9 1.79-9 4v2h18V7c0-2.21-4.03-4-9-4zM4 11v2.5c0 2.5 3.58 4.5 8 4.5s8-2 8-4.5V11H4zm2 2h12v.5c0 1.38-2.69 2.5-6 2.5s-6-1.12-6-2.5V13z"
    />
  ),
  security: (
    <path
      fill="currentColor"
      d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18 7 3.12v4.7c0 4.54-3.07 8.83-7 9.82-3.93-.99-7-5.28-7-9.82v-4.7l7-3.12z"
    />
  ),
};

type TermsIconProps = {
  name: TermsIconName;
  className?: string;
  size?: number;
};

export default function TermsIcon({
  name,
  className,
  size = 24,
}: TermsIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}
