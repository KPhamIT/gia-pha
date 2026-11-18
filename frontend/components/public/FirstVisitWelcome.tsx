"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { UI } from "@/lib/constants/ui-strings";
import { getStoredOrgAccessToken } from "@/lib/org/org-access";
import { useAuthStore } from "@/store/authStore";

/** Trang hiển thị dữ liệu dòng họ mẫu khi khách chưa đăng nhập. */
const SAMPLE_DATA_PATHS = ["/", "/family-tree", "/book", "/events", "/ceremonies", "/notes"];
const SHOW_DELAY_MS = 1200;

function isSampleDataPath(pathname: string): boolean {
  return SAMPLE_DATA_PATHS.some((p) => (p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(`${p}/`)));
}

function readSeen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.FIRST_VISIT_SEEN) === "1";
  } catch {
    return true; // không đọc được storage → không làm phiền
  }
}

function markSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FIRST_VISIT_SEEN, "1");
  } catch {
    /* bỏ qua */
  }
}

/**
 * Đang xem dòng họ mẫu: tài khoản demo tự đăng nhập (chỉ xem), hoặc khách chưa đăng nhập
 * và chưa có link dòng họ thật. Người đã đăng nhập tài khoản thật → không hiện.
 */
function isViewingSample(): boolean {
  const { loaded, isLoggedIn, isDemo } = useAuthStore.getState();
  if (!loaded) return false;
  if (isLoggedIn) return isDemo;
  try {
    return !getStoredOrgAccessToken();
  } catch {
    return false;
  }
}

/** Popup một lần cho khách mới: giải thích dữ liệu đang xem là dòng họ mẫu, mời tạo dòng họ riêng. */
export default function FirstVisitWelcome() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const authLoaded = useAuthStore((st) => st.loaded);

  useEffect(() => {
    if (!isSampleDataPath(pathname) || readSeen()) return;
    if (!authLoaded) {
      void useAuthStore.getState().refresh();
      return;
    }
    // Chờ trang (và đăng nhập demo tự động) ổn định rồi mới kiểm tra lại.
    const timer = window.setTimeout(() => {
      if (readSeen() || !isViewingSample()) return;
      markSeen();
      setOpen(true);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname, authLoaded]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  const close = () => setOpen(false);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#1c1009]/50 backdrop-blur-[2px] md:items-center md:p-6" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-visit-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-[#e8d5b0] bg-[#fffaf0] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 shadow-2xl md:max-w-md md:rounded-3xl md:px-7 md:pb-7"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-[#c8963e] via-[#e9c46a] to-[#c8963e]" />
        <button type="button" onClick={close} aria-label={UI.FIRST_VISIT_CLOSE} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#827472] hover:bg-amber-100/70">
          ×
        </button>
        <span className="inline-block rounded-full border border-[#e8d5b0] bg-amber-100/70 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#944a00]">
          {UI.FIRST_VISIT_BADGE}
        </span>
        <h2 id="first-visit-title" className="mt-3 pr-8 font-serif text-2xl font-semibold leading-snug text-[#321716]">
          {UI.FIRST_VISIT_TITLE}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#504443]">{UI.FIRST_VISIT_BODY}</p>
        <p className="mt-4 text-sm font-semibold text-[#321716]">{UI.FIRST_VISIT_OWN_LEAD}</p>
        <ul className="mt-2 space-y-2">
          {UI.FIRST_VISIT_FEATURES.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-snug text-[#504443]">
              <span aria-hidden className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c8963e] text-[11px] font-bold text-white">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm italic text-[#7a3d00]">{UI.FIRST_VISIT_FREE_NOTE}</p>
        <div className="mt-5 flex flex-col gap-2">
          <Link href="/tao-dong-ho" onClick={close} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#944a00] px-5 text-base font-semibold text-white shadow-sm transition hover:bg-[#7a3d00]">
            {UI.FIRST_VISIT_CTA}
          </Link>
          <button type="button" onClick={close} className="min-h-11 rounded-xl px-5 text-sm font-medium text-[#944a00] hover:bg-amber-100/60">
            {UI.FIRST_VISIT_LATER}
          </button>
        </div>
      </div>
    </div>
  );
}
