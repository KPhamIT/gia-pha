"use client";

import type { ReactNode } from "react";
import Icon from "@/components/icons/Icon";
import OverlayPortal from "@/components/ui/OverlayPortal";
import { HERITAGE_LAYOUT } from "@/lib/constants/heritage-theme";
import { UI } from "@/lib/constants/ui-strings";
import { dismissOverlayFocus } from "@/hooks/useOverlayViewport";

type Props = {
  title: string;
  onClose?: () => void;
  headerAction?: ReactNode;
  /** Gợi ý ngắn ngay dưới tiêu đề trong header. */
  headerSubtitle?: string;
  contextLabel?: string;
  contextName?: string;
  contextMeta?: string | null;
  children: ReactNode;
  footer?: ReactNode;
  /** Nhúng trong trang khác (xem trước soạn mẫu) — không portal, không overlay. */
  embedded?: boolean;
};

function HeritagePanel({
  title,
  onClose,
  headerAction,
  headerSubtitle,
  contextLabel,
  contextName,
  contextMeta,
  children,
  footer,
  embedded = false,
}: Omit<Props, "embedded"> & { embedded?: boolean }) {
  return (
    <div
      className={
        embedded ? HERITAGE_LAYOUT.panelEmbedded : HERITAGE_LAYOUT.panel
      }
      onClick={embedded ? undefined : (e) => e.stopPropagation()}
    >
      <header
        className={`${HERITAGE_LAYOUT.header}${headerSubtitle ? " md:items-start" : ""}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition hover:bg-white/10 active:bg-white/10${headerSubtitle ? " md:self-start" : ""}`}
              aria-label={UI.CLOSE}
            >
              <Icon
                path="arrowLeft"
                size={22}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                pointer={false}
              />
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            <h1 className="min-w-0 truncate text-lg font-bold tracking-wide">
              {title}
            </h1>
            {headerSubtitle ? (
              <p className={HERITAGE_LAYOUT.headerSubtitle}>{headerSubtitle}</p>
            ) : null}
          </div>
        </div>
        {headerAction ? (
          <div className={`shrink-0${headerSubtitle ? " md:self-center" : ""}`}>
            {headerAction}
          </div>
        ) : null}
      </header>

      {contextName ? (
        <section className={HERITAGE_LAYOUT.contextBar}>
          {contextLabel ? (
            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
              {contextLabel}
            </p>
          ) : null}
          <p className="text-sm font-semibold leading-tight text-[#4a2c2a]">
            {contextName}
            {contextMeta ? (
              <span className="font-normal text-stone-400"> | {contextMeta}</span>
            ) : null}
          </p>
        </section>
      ) : null}

      <div className="relative flex min-h-0 flex-1 flex-col">
        {children}
        {footer ? (
          <div className={HERITAGE_LAYOUT.floatingBar}>{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

export default function CeremonyHeritageShell({
  embedded = false,
  onClose,
  ...props
}: Props) {
  const handleClose = () => {
    dismissOverlayFocus();
    onClose?.();
  };

  if (embedded) {
    return (
      <div className="overflow-hidden rounded-xl border border-[#d4c3c1] shadow-lg">
        <HeritagePanel {...props} embedded onClose={onClose} />
      </div>
    );
  }

  return (
    <OverlayPortal>
      <div
        className={HERITAGE_LAYOUT.overlay}
        onClick={onClose ? handleClose : undefined}
        role={onClose ? "presentation" : undefined}
      >
        <HeritagePanel {...props} onClose={onClose ? handleClose : undefined} />
      </div>
    </OverlayPortal>
  );
}
