import type { ReactNode } from "react";

export type ServicesIconName =
  | "book"
  | "cloud"
  | "tree"
  | "verified"
  | "lock"
  | "culture"
  | "arrow";

const ICONS: Record<ServicesIconName, ReactNode> = {
  book: (
    <path
      fill="currentColor"
      d="M18 2H6a2 2 0 0 0-2 2v16l8-4 8 4V4a2 2 0 0 0-2-2zm-1 13.5-6-2.25-6 2.25V4h12v11.5z"
    />
  ),
  cloud: (
    <path
      fill="currentColor"
      d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-4 4-2.5-2.5L11 13l1.5 1.5L13 13l4 4 6-6-1.41-1.41L17 13z"
    />
  ),
  tree: (
    <path
      fill="currentColor"
      d="M22 11V3h-2v4h-4V3H8v4H4V3H2v8c0 2.76 2.24 5 5 5 .7 0 1.37-.15 2-.41.63.59 1.43 1.01 2.31 1.18V21h2v-5.23c.88-.17 1.68-.59 2.31-1.18.63.26 1.3.41 2 .41 2.76 0 5-2.24 5-5zm-9 0H8V5h5v6zm9 0h-5V5h5v6z"
    />
  ),
  verified: (
    <path
      fill="currentColor"
      d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14-4-4 1.41-1.41L11 12.17l5.59-5.58L18 8l-7 7z"
    />
  ),
  lock: (
    <path
      fill="currentColor"
      d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0v2z"
    />
  ),
  culture: (
    <path
      fill="currentColor"
      d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z"
    />
  ),
  arrow: (
    <path
      fill="currentColor"
      d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
    />
  ),
};

type ServicesIconProps = {
  name: ServicesIconName;
  className?: string;
  size?: number;
};

export default function ServicesIcon({
  name,
  className,
  size = 24,
}: ServicesIconProps) {
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
