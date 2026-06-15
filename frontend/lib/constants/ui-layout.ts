/**
 * Shared responsive layout tokens for overlays, sheets, and page content.
 * Mobile: full-bleed. Desktop (md+): centered panel with backdrop.
 */
export const LAYOUT = {
  overlay:
    'fixed inset-0 z-50 flex min-h-0 flex-col overflow-hidden md:items-center md:justify-center md:p-6 lg:p-8',
  overlayBackdropDark: 'md:bg-black/55',
  overlayBackdropLight: 'md:bg-slate-900/35',
  panel:
    'flex h-full min-h-0 w-full flex-col overflow-hidden pb-[env(safe-area-inset-bottom)] md:max-h-[min(100%,56rem)] md:h-[min(100%,56rem)] md:max-w-4xl md:flex-none md:rounded-2xl md:shadow-2xl',
  panelBookWide: 'md:max-w-5xl md:max-h-[min(100%,52rem)] md:h-[min(100%,52rem)]',
  panelBook: 'bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50',
  panelLight: 'bg-white text-slate-900',
  sheetHeader:
    'flex shrink-0 items-center gap-3 border-b px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-6 md:py-4 md:pt-4',
  sheetHeaderBook: 'border-amber-100/10',
  sheetHeaderLight: 'border-slate-200',
  sheetBody: 'sheet-scroll',
  pagePad: 'p-4 md:p-6',
  scrollList: 'scroll-list',
  bottomSheetOverlay:
    'fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6 lg:p-8 md:bg-slate-900/35',
  bottomSheetPanel:
    'relative flex max-h-[min(100dvh,100%)] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl pb-[env(safe-area-inset-bottom)] md:max-h-[min(100%,40rem)] md:rounded-2xl md:pb-0',
  bottomSheetHandle: 'mx-auto mb-3 mt-2 h-1 w-10 rounded-full bg-slate-300 md:hidden',
  /** Search sheet: fixed height, always anchored to bottom (no center jump on desktop). */
  bottomSheetSearchOverlay:
    'fixed inset-0 z-50 flex items-end justify-center pb-0 md:bg-slate-900/35 md:px-6 md:pb-6',
  bottomSheetSearchPanel:
    'relative flex h-[min(75dvh,28rem)] min-h-[min(75dvh,28rem)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl pb-[env(safe-area-inset-bottom)] md:rounded-2xl md:pb-0',
  sidePanelOverlay: 'fixed inset-0 z-50 flex md:bg-slate-900/35',
  sidePanel:
    'relative ml-auto h-screen w-full max-w-[min(100%,20rem)] bg-white p-5 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-700 md:max-w-xs lg:max-w-sm',
  centeredOverlay: 'fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-8',
  cardGrid: 'grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4',
} as const;
