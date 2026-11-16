import type { ConfigService } from '@nestjs/config';

export type BlankBookPricing = {
  baseVnd: number;
  perPageVnd: number;
  minPages: number;
  maxPages: number;
  defaultPages: number;
};

function intEnv(config: ConfigService, key: string, fallback: number): number {
  const raw = Number.parseInt(config.get<string>(key) ?? '', 10);
  return Number.isFinite(raw) && raw >= 0 ? raw : fallback;
}

/** Giá sổ gia phả trống = phí cố định + đơn giá × số trang (chỉnh qua env). */
export function readBlankBookPricing(config: ConfigService): BlankBookPricing {
  const minPages = Math.max(1, intEnv(config, 'BLANK_BOOK_MIN_PAGES', 20));
  const maxPages = Math.max(
    minPages,
    intEnv(config, 'BLANK_BOOK_MAX_PAGES', 300),
  );
  return {
    baseVnd: intEnv(config, 'BLANK_BOOK_BASE_VND', 30000),
    perPageVnd: intEnv(config, 'BLANK_BOOK_PER_PAGE_VND', 500),
    minPages,
    maxPages,
    defaultPages: Math.min(maxPages, Math.max(minPages, 100)),
  };
}

export function blankBookPrice(
  pricing: BlankBookPricing,
  pages: number,
): number {
  return pricing.baseVnd + pricing.perPageVnd * pages;
}
