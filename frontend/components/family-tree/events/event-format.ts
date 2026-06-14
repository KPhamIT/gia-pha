const vnd = new Intl.NumberFormat('vi-VN');

/** Format a number of VND with thousands separators, e.g. 200000 -> "200.000 đ". */
export function formatVnd(amount: number): string {
  return `${vnd.format(amount)} đ`;
}
