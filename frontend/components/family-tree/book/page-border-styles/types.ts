import type { ReactElement, ReactNode } from 'react';

export type PageBorderProps = {
  /** The page inner content the border decorates. */
  children: ReactNode;
};

export type PageBorderComponent = (props: PageBorderProps) => ReactElement;

export type PageBorderStyle = {
  id: string;
  /** Human label shown in the style selector. */
  label: string;
  Component: PageBorderComponent;
};
