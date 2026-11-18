import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type BlankBookPayment = {
  qrImageUrl: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
};

export type BlankBookConfig = {
  /** Giá của đơn nhỏ nhất (đúng `minPages` trang). */
  minPriceVnd: number;
  perPageVnd: number;
  minPages: number;
  maxPages: number;
  defaultPages: number;
  payment: BlankBookPayment;
};

export type BlankBookOrderStatus = "PENDING" | "PAID" | "CANCELLED";

export type BlankBookOrder = {
  code: string;
  accessToken: string;
  status: BlankBookOrderStatus;
  clanName: string;
  establishedYear: string | null;
  clanAddress: string | null;
  pageCount: number;
  coverIndex: number;
  amountVnd: number;
  paidAt: string | null;
  createdAt: string;
  payment: BlankBookPayment | null;
};

/** Thông tin đơn cho trang xác nhận của chủ web. */
export type BlankBookConfirmView = {
  code: string;
  status: BlankBookOrderStatus;
  clanName: string;
  pageCount: number;
  amountVnd: number;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string;
  paidAt: string | null;
};

export type CreateBlankBookOrderInput = {
  clanName: string;
  establishedYear?: string;
  clanAddress?: string;
  pageCount: number;
  coverIndex: number;
  contactEmail?: string;
  contactPhone?: string;
};

export const blankBook = {
  getConfig: () => axiosClient.get<BlankBookConfig>(API_ROUTES.BLANK_BOOK_CONFIG).then((r) => r.data),
  createOrder: (input: CreateBlankBookOrderInput) =>
    axiosClient.post<BlankBookOrder>(API_ROUTES.BLANK_BOOK_ORDERS, input).then((r) => r.data),
  getOrder: (accessToken: string) =>
    axiosClient.get<BlankBookOrder>(API_ROUTES.BLANK_BOOK_ORDER(accessToken)).then((r) => r.data),
  getForConfirm: (token: string) =>
    axiosClient.get<BlankBookConfirmView>(API_ROUTES.BLANK_BOOK_CONFIRM(token)).then((r) => r.data),
  confirm: (token: string) =>
    axiosClient.post<BlankBookConfirmView>(API_ROUTES.BLANK_BOOK_CONFIRM(token)).then((r) => r.data),
};

/** Giá = giá đơn nhỏ nhất + đơn giá × số trang vượt tối thiểu (khớp backend). */
export function blankBookPrice(
  config: Pick<BlankBookConfig, "minPriceVnd" | "perPageVnd" | "minPages">,
  pages: number,
): number {
  return config.minPriceVnd + config.perPageVnd * Math.max(0, pages - config.minPages);
}
