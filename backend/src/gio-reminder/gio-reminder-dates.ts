import { daysUntilNextDeathAnniversary } from '../notifications/utils/lunar-death-anniversary.js';

/** Các mốc gửi nhắc: trước 3 ngày và đúng ngày giỗ. */
export const REMIND_DAYS_BEFORE = [3, 0] as const;

/**
 * Số ngày tới ngày giỗ âm lịch kế tiếp. Tháng thiếu (29 ngày) không có ngày 30 →
 * lùi về ngày 29 thay vì báo lỗi.
 */
export function daysUntilGio(
  lunarMonth: number,
  lunarDay: number,
  referenceDate = new Date(),
): number | null {
  for (let day = lunarDay; day >= Math.max(1, lunarDay - 1); day -= 1) {
    try {
      return daysUntilNextDeathAnniversary(lunarMonth, day, referenceDate);
    } catch {
      // ngày 30 không tồn tại trong tháng thiếu năm nay — thử ngày 29
    }
  }
  return null;
}

/** Ngày dương lịch (giờ Việt Nam) của lần giỗ kế tiếp, dạng "Thứ …, dd/mm/yyyy". */
export function nextGioSolarLabel(
  lunarMonth: number,
  lunarDay: number,
  referenceDate = new Date(),
): { days: number; label: string } | null {
  const days = daysUntilGio(lunarMonth, lunarDay, referenceDate);
  if (days == null) return null;
  const date = new Date(referenceDate.getTime() + days * 86_400_000);
  const label = date.toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return { days, label };
}

/** Ngày hôm nay theo giờ Việt Nam, dạng YYYY-MM-DD (khoá chống gửi trùng). */
export function todayKeyVn(referenceDate = new Date()): string {
  return referenceDate.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });
}
