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
  /** Căn icon + label trong nút có chữ (menu FAB, danh sách…) */
  labeledAlign?: 'center' | 'start';
  /** Nút nhỏ gọn (menu FAB mobile) */
  size?: 'default' | 'dense';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export default function IconRoundButton({
  icon,
  label,
  variant = 'ghost',
  iconSize = 18,
  loading = false,
  compact = true,
  labeledAlign = 'center',
  size = 'default',
  className = '',
  disabled,
  type = 'button',
  ...rest
}: IconRoundButtonProps) {
  const hasLabel = Boolean(label?.trim());
  const isDense = size === 'dense' && hasLabel;
  const sizeClass = isDense
    ? 'min-h-11 h-11 rounded-xl px-3 py-2 text-xs md:min-h-10 md:h-10'
    : hasLabel && !compact
      ? BT.btnSm
      : hasLabel
        ? BT.btnCompact
        : '';
  const variantClass = hasLabel
    ? isDense
      ? `${BT.btnBase} ${BT.btnOutline} ${sizeClass}`.trim()
      : `${LABELED_VARIANT[variant]} ${sizeClass}`.trim()
    : (ICON_ONLY_VARIANT[variant as keyof typeof ICON_ONLY_VARIANT] ?? ICON_ONLY_VARIANT.gold);
  const alignClass =
    hasLabel && labeledAlign === 'start' ? `justify-start ${isDense ? 'gap-2' : 'gap-2'}` : '';
  const iconSlotClass = isDense ? 'h-8 w-8 shrink-0' : 'h-9 w-9 shrink-0';

  const iconNode = loading ? (
    <LoadingSpinner size={iconSize} />
  ) : (
    <Icon path={icon} size={iconSize} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
  );

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${variantClass} ${alignClass} ${className}`.trim()}
      {...rest}
    >
      {hasLabel && labeledAlign === 'start' ? (
        <span className={`grid shrink-0 place-items-center ${iconSlotClass}`}>{iconNode}</span>
      ) : (
        iconNode
      )}
      {hasLabel ? <span className="min-w-0 text-left">{label}</span> : null}
    </button>
  );
}
