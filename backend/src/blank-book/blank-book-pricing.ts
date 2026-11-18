import type { ConfigService } from '@nestjs/config';

export type BlankBookPricing = {
  /** Giá của đơn nhỏ nhất (đúng `minPages` trang). */
  minPriceVnd: number;
  perPageVnd: number;
  minPages: number;
  maxPages: number;
  defaultPages: number;
};

function intEnv(config: ConfigService, key: string, fallback: number): number {
  const raw = Number.parseInt(config.get<string>(key) ?? '', 10);
  return Number.isFinite(raw) && raw >= 0 ? raw : fallback;
}

/** Giá sổ gia phả trống = giá đơn nhỏ nhất + đơn giá × số trang vượt tối thiểu (chỉnh qua env). */
export function readBlankBookPricing(config: ConfigService): BlankBookPricing {
  const minPages = Math.max(1, intEnv(config, 'BLANK_BOOK_MIN_PAGES', 20));
  const maxPages = Math.max(
    minPages,
    intEnv(config, 'BLANK_BOOK_MAX_PAGES', 300),
  );
  return {
    minPriceVnd: intEnv(config, 'BLANK_BOOK_MIN_PRICE_VND', 39900),
    perPageVnd: intEnv(config, 'BLANK_BOOK_PER_PAGE_VND', 200),
    minPages,
    maxPages,
    defaultPages: Math.min(maxPages, Math.max(minPages, 100)),
  };
}

export function blankBookPrice(
  pricing: BlankBookPricing,
  pages: number,
): number {
  const extraPages = Math.max(0, pages - pricing.minPages);
  return pricing.minPriceVnd + pricing.perPageVnd * extraPages;
}
