import type { ReactNode } from "react";

/** Một mục trong popup trưng bày (mẫu bìa, trang sách…). */
export type ShowcaseItem = {
  key: string;
  label: string;
  description?: string;
  /** Tỉ lệ cao / rộng của mặt hiển thị. */
  ratio: number;
  renderFront: (width: number) => ReactNode;
  /** Có mặt sau thì hiện nút lật Trước / Sau. */
  renderBack?: (width: number) => ReactNode;
  /** Mã gửi kèm link Messenger (`?ref=`); bỏ trống thì không hiện nút đặt mua. */
  orderRef?: string;
  /** Vẽ mép giấy bên phải như một cuốn sách dày. */
  thick?: boolean;
};

export type ShowcaseTexts = {
  dialog: string;
  order: string;
  hint: string;
  hintTouch: string;
};
