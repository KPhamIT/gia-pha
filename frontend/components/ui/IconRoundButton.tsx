'use client';

import type { ButtonHTMLAttributes } from 'react';
import Icon from '@/components/icons/Icon';
import type { IconName } from '@/components/icons/icon-paths';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { BT } from '@/lib/constants/ui-theme';

const ICON_ONLY_VARIANT = {
  ghost: BT.iconGhost,
  gold: BT.iconGold,
  danger: BT.iconDanger,
  fab: BT.iconFab,
  fabSm: BT.iconFabSm,
} as const;

const LABELED_VARIANT = {
  ghost: `${BT.btnBase} ${BT.btnCompact} ${BT.btnGhost}`,
  gold: `${BT.btnBase} ${BT.btnCompact} ${BT.btnGold}`,
  primary: `${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`,
  danger: `${BT.btnBase} ${BT.btnCompact} ${BT.btnDanger}`,
  outline: `${BT.btnBase} ${BT.btnSm} ${BT.btnOutline}`,
  onDark: `${BT.btnBase} ${BT.btnSm} ${BT.btnOnDark}`,
  fab: `${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`,
  fabSm: `${BT.btnBase} ${BT.btnSm} ${BT.btnOutline}`,
} as const;

export type BookButtonVariant = keyof typeof LABELED_VARIANT;

type IconRoundButtonProps = {
  icon: IconName;
  /** Text ngắn hiển thị cạnh icon (≤ ~10 ký tự) */
  label?: string;
  variant?: BookButtonVariant;
  iconSize?: number;
  loading?: boolean;
  compact?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export default function IconRoundButton({
  icon,
  label,
  variant = 'ghost',
  iconSize = 18,
  loading = false,
  compact = true,
  className = '',
  disabled,
  type = 'button',
  ...rest
}: IconRoundButtonProps) {
  const hasLabel = Boolean(label?.trim());
  const sizeClass = hasLabel && !compact ? BT.btnSm : hasLabel ? BT.btnCompact : '';
  const variantClass = hasLabel
    ? `${LABELED_VARIANT[variant]} ${sizeClass}`.trim()
    : (ICON_ONLY_VARIANT[variant as keyof typeof ICON_ONLY_VARIANT] ?? ICON_ONLY_VARIANT.gold);

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${variantClass} ${className}`.trim()}
      {...rest}
    >
      {loading ? (
        <LoadingSpinner size={iconSize} />
      ) : (
        <Icon path={icon} size={iconSize} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
      )}
      {hasLabel ? <span>{label}</span> : null}
    </button>
  );
}
