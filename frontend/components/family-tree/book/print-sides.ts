import type { Leaf } from "./book-leaves";

/** In sổ: một mặt (chỉ thông tin) hoặc hai mặt (sau mỗi person thêm trang nền). */
export type BookPrintSides = "simplex" | "duplex";

export const DEFAULT_BOOK_PRINT_SIDES: BookPrintSides = "simplex";

export function isBookPrintSides(value: unknown): value is BookPrintSides {
  return value === "simplex" || value === "duplex";
}

export function normalizeBookPrintSides(value: unknown): BookPrintSides {
  return isBookPrintSides(value) ? value : DEFAULT_BOOK_PRINT_SIDES;
}

/** Số trang PDF khi in toàn bộ (duplex: +1 nền sau mỗi person). */
export function countPrintAllPages(
  leaves: Leaf[],
  printSides: BookPrintSides,
): number {
  if (printSides !== "duplex") return leaves.length;
  let count = 0;
  for (const leaf of leaves) {
    count += 1;
    if (leaf.kind === "person") count += 1;
  }
  return count;
}
