import { ReactNode } from 'react';

export type IconName = 'settings' | 'close' | 'sun' | 'moon' | 'trash' | 'userPlus' | 'arrowLeft' | 'alertTriangle' | 'check' | 'save' | 'search' | 'edit' | 'center' | 'plus' | 'chevronDown' | 'chevronUp' | 'book' | 'chevronLeft' | 'chevronRight' | 'print' | 'printAll' | 'list';

export interface IconDefinition {
  viewBox: string;
  paths: ReactNode;
}

const iconDefinitions: Record<IconName, IconDefinition> = {
  settings: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.7.05 1.38.3 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </>
    ),
  },
  close: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M18 6 6 18" />
        <path d="M6 6l12 12" />
      </>
    ),
  },
  sun: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.93 4.93 6.34 6.34" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m4.93 19.07 1.41-1.41" />
        <path d="m17.66 6.34 1.41-1.41" />
      </>
    ),
  },
  moon: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
      </>
    ),
  },
  trash: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6 18 20H6L5 6" />
      </>
    ),
  },
  userPlus: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6" />
        <path d="M22 11h-6" />
      </>
    ),
  },
  arrowLeft: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),
  },
  check: {
    viewBox: '0 0 24 24',
    paths: <path d="M20 6 9 17l-5-5" />,
  },
  save: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <path d="M17 21v-8H7v8" />
        <path d="M7 3v5h8" />
      </>
    ),
  },
  alertTriangle: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
  },
  search: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
  },
  edit: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
  },
  center: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
      </>
    ),
  },
  plus: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
  },
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
};

export default iconDefinitions;
