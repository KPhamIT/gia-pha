"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/icon-paths";
import OverlayPortal from "@/components/ui/OverlayPortal";
import { logout } from "@/lib/auth/session";
import {
  MOBILE_MENU_HELP,
  MOBILE_MENU_MORE,
  MOBILE_MENU_PRIMARY,
  MOBILE_MENU_SETTINGS,
  MOBILE_MENU_SHORTCUTS,
  type MobileMenuLink,
} from "@/lib/navigation/mobile-menu";
import { BRAND_NAME, BRAND_TEXT_CLASS } from "@/config/site";
import { UI } from "@/lib/constants/ui-strings";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { useSwipeLeftDismiss } from "@/hooks/useSwipeLeftDismiss";
import { useAuthStore } from "@/store/authStore";
import { useMobileMenuStore } from "@/store/mobileMenuStore";
import {
  resolveUserDisplayName,
  userDisplayInitials,
} from "@/utils/user-display";

export default function MobileMenuSheet() {
  const open = useMobileMenuStore((s) => s.open);
  const hide = useMobileMenuStore((s) => s.hide);
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const swipe = useSwipeLeftDismiss(hide);

  useEffect(() => {
    hide();
  }, [pathname, hide]);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      setHelpOpen(false);
      setSettingsOpen(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <OverlayPortal>
      <div
        className="overlay-viewport z-[60] flex flex-col bg-[#f2efe9] md:hidden"
        role="dialog"
        aria-modal
        aria-label={BRAND_NAME}
        style={{
          transform: `translateX(${swipe.offsetX}px)`,
          transition: swipe.dismissing
            ? "transform 180ms ease-out"
            : swipe.offsetX === 0
              ? "transform 180ms ease-out"
              : "none",
          opacity: Math.max(0.35, 1 + swipe.offsetX / 400),
        }}
        onTouchStart={swipe.onTouchStart}
        onTouchMove={swipe.onTouchMove}
        onTouchEnd={swipe.onTouchEnd}
        onTouchCancel={swipe.onTouchCancel}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[#d4c3c1]/50 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <h2 className={`font-serif text-2xl font-bold ${BRAND_TEXT_CLASS}`}>
            {BRAND_NAME}
          </h2>
          <button
            type="button"
            onClick={hide}
            aria-label={UI.CLOSE}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#321716] shadow-sm"
          >
            <Icon
              path="close"
              size={20}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
          </button>
        </header>

        <div className="sheet-scroll min-h-0 flex-1 px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
          <ProfileCard onNavigate={hide} />

          <section className="mt-4">
            <h3 className="mb-2 px-1 text-sm font-semibold text-[#504443]">
              {UI.MOBILE_MENU_SHORTCUTS}
            </h3>
            <div
              data-swipe-ignore
              className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {MOBILE_MENU_SHORTCUTS.map((item) => (
                <ShortcutChip key={item.href} item={item} onNavigate={hide} />
              ))}
            </div>
          </section>

          <section className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
            {(expanded
              ? [...MOBILE_MENU_PRIMARY, ...MOBILE_MENU_MORE]
              : MOBILE_MENU_PRIMARY
            ).map((item) => (
              <MenuListRow key={item.href + item.label} item={item} onNavigate={hide} />
            ))}
            <div className="p-2">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="flex w-full items-center justify-center rounded-xl bg-[#ebe8e3] py-2.5 text-sm font-semibold text-[#321716]"
              >
                {expanded ? UI.MOBILE_MENU_SEE_LESS : UI.MOBILE_MENU_SEE_MORE}
              </button>
            </div>
          </section>

          <section className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
            <Accordion
              open={helpOpen}
              onToggle={() => setHelpOpen((v) => !v)}
              icon="alertTriangle"
              title={UI.MOBILE_MENU_HELP}
            >
              {MOBILE_MENU_HELP.map((item) => (
                <MenuListRow
                  key={item.href}
                  item={item}
                  onNavigate={hide}
                  dense
                />
              ))}
            </Accordion>
            <Accordion
              open={settingsOpen}
              onToggle={() => setSettingsOpen((v) => !v)}
              icon="settings"
              title={UI.MOBILE_MENU_SETTINGS}
            >
              {MOBILE_MENU_SETTINGS.map((item) => (
                <MenuListRow
                  key={item.href}
                  item={item}
                  onNavigate={hide}
                  dense
                />
              ))}
              <LogoutRow />
            </Accordion>
          </section>
        </div>
      </div>
    </OverlayPortal>
  );
}

function ProfileCard({ onNavigate }: { onNavigate: () => void }) {
  const { loaded, isLoggedIn } = useAuthBootstrap();
  const user = useAuthStore((s) => s.user);
  const person = useAuthStore((s) => s.person);

  if (!loaded) return null;

  if (!isLoggedIn || !user) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ebe8e3] text-sm font-bold text-[#504443]">
          ?
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-[#321716]">
            {UI.MOBILE_MENU_GUEST_NAME}
          </span>
          <span className="block text-sm text-[#944a00]">
            {UI.MOBILE_MENU_LOGIN}
          </span>
        </span>
        <Icon
          path="chevronRight"
          size={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
          className="text-[#827472]"
        />
      </Link>
    );
  }

  const name = resolveUserDisplayName(user, person);
  const initials = userDisplayInitials(user, person);

  return (
    <Link
      href="/account"
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900">
        {initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-[#321716]">
          {name}
        </span>
        <span className="block text-sm text-[#504443]">
          {UI.MOBILE_MENU_VIEW_PROFILE}
        </span>
      </span>
      <Icon
        path="chevronRight"
        size={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        pointer={false}
        className="text-[#827472]"
      />
    </Link>
  );
}

function ShortcutChip({
  item,
  onNavigate,
}: {
  item: MobileMenuLink;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5"
    >
      <span
        className={`grid h-14 w-14 place-items-center rounded-full ${item.tone ?? "bg-[#ebe8e3] text-[#321716]"}`}
      >
        <Icon
          path={item.icon}
          size={24}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          pointer={false}
        />
      </span>
      <span className="line-clamp-2 w-full text-center text-[11px] font-medium leading-tight text-[#321716]">
        {item.label}
      </span>
    </Link>
  );
}

function MenuListRow({
  item,
  onNavigate,
  dense = false,
}: {
  item: MobileMenuLink;
  onNavigate: () => void;
  dense?: boolean;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 border-b border-[#ebe8e3] last:border-b-0 ${
        dense ? "px-4 py-3" : "px-4 py-3.5"
      }`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f6f3ee] text-[#321716]">
        <Icon
          path={item.icon}
          size={20}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          pointer={false}
        />
      </span>
      <span className="text-sm font-semibold text-[#321716]">{item.label}</span>
    </Link>
  );
}

function Accordion({
  open,
  onToggle,
  icon,
  title,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  icon: IconName;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-[#ebe8e3] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f6f3ee] text-[#321716]">
          <Icon
            path={icon}
            size={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            pointer={false}
          />
        </span>
        <span className="min-w-0 flex-1 text-sm font-semibold text-[#321716]">
          {title}
        </span>
        <Icon
          path={open ? "chevronUp" : "chevronDown"}
          size={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
          className="text-[#827472]"
        />
      </button>
      {open ? <div className="bg-[#faf7f2] pb-1">{children}</div> : null}
    </div>
  );
}

function LogoutRow() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hide = useMobileMenuStore((s) => s.hide);

  if (!isLoggedIn) return null;

  return (
    <button
      type="button"
      onClick={() => {
        hide();
        void logout();
      }}
      className="flex w-full items-center gap-3 px-4 py-3 text-left"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ffdad6] text-[#93000a]">
        <Icon
          path="arrowLeft"
          size={20}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          pointer={false}
        />
      </span>
      <span className="text-sm font-semibold text-[#93000a]">
        {UI.ACCOUNT_LOGOUT}
      </span>
    </button>
  );
}
