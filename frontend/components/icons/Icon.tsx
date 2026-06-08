'use client';

import type { ButtonHTMLAttributes, SVGProps } from 'react';
import iconDefinitions, { IconName } from './icon-paths';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'path'> {
  path: IconName;
  size?: number | string;
  pointer?: boolean;
  asButton?: boolean;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export default function Icon({
  path,
  size = 20,
  className,
  pointer = true,
  asButton = false,
  buttonProps,
  ...props
}: IconProps) {
  const icon = iconDefinitions[path];

  if (!icon) {
    return null;
  }

  const svgClassName = [className, pointer ? 'cursor-pointer' : null].filter(Boolean).join(' ');

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={icon.viewBox}
      width={size}
      height={size}
      className={svgClassName || undefined}
      {...props}
    >
      {icon.paths}
    </svg>
  );

  if (asButton) {
    return (
      <button type="button" {...buttonProps}>
        {svg}
      </button>
    );
  }

  return svg;
}
