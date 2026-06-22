import { LAYOUT } from "@/lib/constants/ui-layout";

/**
 * Book UI palette — đỏ, vàng, đen, trắng.
 * Dùng làm chuẩn cho toàn app (sổ gia phả, sự kiện, admin, form…).
 */
export const BT = {
  shell: LAYOUT.panelBook,
  shellText: "text-amber-50",
  mutedOnDark: "text-amber-100/70",
  mutedOnLight: "text-neutral-500",

  card: "rounded-2xl border border-amber-200/60 bg-white text-neutral-900 shadow-lg shadow-black/20",
  panel:
    "overflow-hidden rounded-xl border border-amber-200/60 bg-white text-neutral-900",
  bandHeader: "bg-amber-100/90 text-amber-950",
  dividerOnDark: "border-amber-100/10",
  dividerOnLight: "border-amber-200/60",

  input:
    "w-full rounded-xl border border-amber-200/80 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-50",
  textarea:
    "w-full min-h-[120px] resize-y rounded-xl border border-amber-200/80 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-50",

  iconGhost:
    "grid h-11 w-11 shrink-0 place-items-center rounded-full text-amber-50 transition-colors active:bg-white/10 md:h-10 md:w-10 md:hover:bg-white/10 disabled:opacity-40",
  iconGold:
    "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-950 transition-colors active:bg-amber-200 md:h-10 md:w-10 disabled:bg-white/10 disabled:text-amber-100/40",
  iconDanger:
    "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-900/40 text-red-100 transition-colors active:bg-red-900/60 md:h-10 md:w-10 disabled:opacity-40",
  iconFab:
    "grid h-14 w-14 place-items-center rounded-full bg-amber-700 text-amber-50 shadow-lg transition-colors active:bg-amber-800",
  iconFabSm:
    "grid h-11 w-11 place-items-center rounded-full border border-amber-200/60 bg-white text-amber-950 shadow-sm transition-colors active:bg-amber-50 md:h-10 md:w-10",

  /** Nút có icon + text ngắn — mobile min 44px (Apple HIG / WCAG), desktop có thể nhỏ hơn */
  btnBase:
    "inline-flex shrink-0 items-center justify-center gap-1.5 font-semibold transition-colors disabled:opacity-50",
  btnSm: "min-h-11 rounded-xl px-3.5 py-2.5 text-sm md:min-h-10 md:py-2",
  btnCompact: "min-h-11 h-11 rounded-full px-3.5 text-sm md:min-h-10 md:h-10",
  btnGold: "bg-amber-100 text-amber-950 active:bg-amber-200",
  btnPrimary: "bg-amber-700 text-amber-50 shadow active:bg-amber-800",
  btnDanger: "bg-red-900 text-white active:bg-red-950",
  btnGhost: "text-amber-50 active:bg-white/10",
  btnOutline:
    "border border-amber-200/80 bg-white text-amber-950 active:bg-amber-50",
  btnOnDark: "bg-white/10 text-amber-50 active:bg-white/20",

  pillOnDark:
    "rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-amber-50 active:bg-white/20",
  pillActive:
    "rounded-full bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-950",
  pillIdle:
    "rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-amber-100/80 active:bg-white/20",

  primaryBtn:
    "bg-amber-700 text-amber-50 shadow active:bg-amber-800 disabled:opacity-50",
  dangerBtn: "bg-red-900 text-white active:bg-red-950 disabled:opacity-50",
  roundBtn: "bg-amber-100 text-amber-950 active:bg-amber-200",
  contribBtn: "bg-amber-700 text-amber-50 active:bg-amber-800",
  donationBtn:
    "border border-amber-300 bg-amber-100 text-amber-950 active:bg-amber-200",

  tabActive: "border-b-2 border-amber-700 text-amber-800",
  tabIdle: "text-neutral-500 active:text-neutral-700",

  money: "text-amber-800",
  gold: "text-amber-700",
  pending: "text-neutral-400",
  error: "text-red-300",
  errorBg: "rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-200",
  errorBgLight: "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800",

  pagePad: LAYOUT.pagePad,
  cardGrid: LAYOUT.cardGrid,
} as const;

/** @deprecated Use BT — kept for event imports */
export const ET = BT;
