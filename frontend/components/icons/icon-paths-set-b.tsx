import type { IconDefinition, IconName } from './icon-paths';

/** Second half of the icon set (see icon-paths.tsx for the merged map). */
export const ICON_SET_B: Partial<Record<IconName, IconDefinition>> = {
  chevronDown: {
    viewBox: '0 0 24 24',
    paths: <path d="m6 9 6 6 6-6" />,
  },
  chevronUp: {
    viewBox: '0 0 24 24',
    paths: <path d="m18 15-6-6-6 6" />,
  },
  book: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    ),
  },
  chevronLeft: {
    viewBox: '0 0 24 24',
    paths: <path d="m15 18-6-6 6-6" />,
  },
  chevronRight: {
    viewBox: '0 0 24 24',
    paths: <path d="m9 18 6-6-6-6" />,
  },
  print: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
        <rect x="6" y="14" width="12" height="8" rx="1" />
      </>
    ),
  },
  printAll: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M7 3h8l3 3v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <path d="M15 3v4h4" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
        <path d="M5 7H4a2 2 0 0 0-2 2v5h18v-5a2 2 0 0 0-2-2h-1" />
      </>
    ),
  },
  list: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
      </>
    ),
  },
  calendar: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </>
    ),
  },
  image: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L4 22" />
      </>
    ),
  },
  download: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5" />
        <path d="M12 15V3" />
      </>
    ),
  },
  lock: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
  share: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M16 6l-4-4-4 4" />
        <path d="M12 2v13" />
      </>
    ),
  },
};
