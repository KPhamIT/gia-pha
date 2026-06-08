import { ReactNode } from 'react';

export type IconName = 'settings' | 'close' | 'chevronRight' | 'user' | 'home' | 'sun' | 'moon';

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
  chevronRight: {
    viewBox: '0 0 24 24',
    paths: <path d="m9 18 6-6-6-6" />,
  },
  user: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4 20v-1a6 6 0 0 1 12 0v1" />
      </>
    ),
  },
  home: {
    viewBox: '0 0 24 24',
    paths: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M6 10.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5" />
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
};

export default iconDefinitions;
