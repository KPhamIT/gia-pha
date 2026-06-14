/**
 * Shared theme tokens for the event screens.
 * Matches the genealogy-book "pages manager" palette: amber/gold gradient
 * background with white content cards and amber-toned headers/accents.
 */
export const ET = {
  /** White content card with a soft amber border. */
  card: 'rounded-2xl border border-amber-200/60 bg-white text-slate-800 shadow-lg shadow-black/20',
  /** White list/section container with an amber hairline border. */
  panel: 'overflow-hidden rounded-xl border border-amber-200/60 bg-white text-slate-800',
  /** Group / table header band (light gold). */
  bandHeader: 'bg-amber-100/90 text-amber-900',
  /** Primary action button (gold). */
  primaryBtn: 'bg-amber-700 text-amber-50 shadow active:bg-amber-800 disabled:opacity-50',
  /** Round add/+ button on the dark header (mirrors the book save button). */
  roundBtn: 'bg-amber-100 text-amber-950 active:bg-amber-200',
  /** Card footer button — fixed contribution list (solid gold). */
  contribBtn: 'bg-amber-700 text-amber-50 active:bg-amber-800',
  /** Card footer button — merit donation list (light gold, outlined). */
  donationBtn: 'border border-amber-300 bg-amber-100 text-amber-900 active:bg-amber-200',
  /** Muted text on the dark amber background. */
  mutedOnDark: 'text-amber-100/70',
  /** Money amounts. */
  money: 'text-amber-800',
  /** Positive / collected accent. */
  gold: 'text-amber-700',
  /** Pending / outstanding accent. */
  pending: 'text-slate-400',
} as const;
