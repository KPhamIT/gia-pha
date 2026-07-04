/** Heritage Modernism — bài cúng / sổ gia phả (Stitch redesign). */
export const HERITAGE = {
  wood: "#4a2c2a",
  woodDark: "#321716",
  gold: "#c5a059",
  cream: "#fcf9f4",
  muted: "#504443",
  border: "#d4c3c1",
} as const;

export const HERITAGE_LAYOUT = {
  overlay:
    "overlay-viewport z-50 flex min-h-0 flex-col overflow-hidden md:items-center md:justify-center md:bg-[#1a1a1a]/85 md:p-4 lg:p-6",
  panel:
    "relative flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden bg-[#fcf9f4] font-serif text-stone-800 shadow-2xl pb-[env(safe-area-inset-bottom)] md:h-[min(100%,56rem)] md:max-h-[min(100vh,900px)] md:w-full md:max-w-[min(100%,96rem)] md:flex-none md:rounded-2xl",
  panelEmbedded:
    "relative flex h-[min(70vh,36rem)] min-h-[24rem] w-full flex-col overflow-hidden bg-[#fcf9f4] font-serif text-stone-800",
  header:
    "sticky top-0 z-20 flex shrink-0 items-center justify-between gap-2 bg-[#4a2c2a] px-4 py-3 text-white shadow-md pt-[max(0.75rem,env(safe-area-inset-top))] md:rounded-t-2xl md:px-6 md:pt-3",
  headerSubtitle:
    "mt-0.5 text-xs leading-snug text-white/75 md:text-[13px]",
  contextBar: "shrink-0 border-b border-stone-200 bg-stone-100 px-6 py-2 md:px-8",
  scrollBody:
    "min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-8 pb-36 md:px-10 md:py-10 lg:px-16",
  viewerRoot:
    "relative flex h-full min-h-0 flex-1 flex-col overflow-hidden",
  prayerContent:
    "mx-auto w-full max-w-prose leading-[1.8] tracking-wide text-stone-800 md:max-w-3xl lg:max-w-4xl",
  floatingBar:
    "pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:justify-end md:px-8 md:pb-6",
  floatingBarInner:
    "w-full max-w-[min(100%,28rem)] rounded-2xl bg-[#4a2c2a]/95 p-4 text-white shadow-2xl backdrop-blur-md transition-all duration-300 ease-out md:max-w-xs",
  floatingBarInnerVisible: "pointer-events-auto translate-y-0 opacity-100",
  floatingBarInnerHidden: "pointer-events-none translate-y-3 opacity-0",
  editorMetaBar:
    "shrink-0 border-b border-stone-200 bg-stone-50 px-4 py-3 md:px-6 lg:px-8",
  editorMain:
    "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-3 md:px-6 md:py-4 lg:px-8",
  editorBody:
    "flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row",
  variableSidebar:
    "hidden min-h-0 w-80 shrink-0 flex-col overflow-hidden border-stone-200 bg-stone-50/90 p-4 lg:flex xl:w-96",
  editorTextarea:
    "min-h-0 w-full flex-1 resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-stone-800 placeholder:text-stone-400 focus:border-[#4a2c2a] focus:outline-none focus:ring-1 focus:ring-[#c5a059]",
} as const;
