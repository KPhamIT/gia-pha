import { ReactNode } from 'react';
import { ICON_SET_A } from './icon-paths-set-a';
import { ICON_SET_B } from './icon-paths-set-b';

export type IconName =
  | 'settings' | 'close' | 'sun' | 'moon' | 'trash' | 'userPlus' | 'arrowLeft' | 'alertTriangle'
  | 'check' | 'save' | 'search' | 'edit' | 'center' | 'plus' | 'chevronDown' | 'chevronUp' | 'book'
  | 'chevronLeft' | 'chevronRight' | 'print' | 'printAll' | 'list' | 'calendar' | 'image' | 'download'
  | 'lock' | 'share';

export interface IconDefinition {
  viewBox: string;
  paths: ReactNode;
}

const iconDefinitions = { ...ICON_SET_A, ...ICON_SET_B } as Record<IconName, IconDefinition>;

export default iconDefinitions;
