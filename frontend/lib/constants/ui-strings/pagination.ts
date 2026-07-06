export const PAGINATION_STRINGS = {
  PAGE_PREV: "Trang trước",
  PAGE_NEXT: "Trang sau",
  PAGE_LABEL: (page: number, total: number) => `Trang ${page} / ${total}`,
} as const;
