import { Lunar } from "lunar-javascript";

const LUNAR_MONTHS = [
  "Giêng",
  "Hai",
  "Ba",
  "Tư",
  "Năm",
  "Sáu",
  "Bảy",
  "Tám",
  "Chín",
  "Mười",
  "Mười một",
  "Chạp",
] as const;

const HEAVENLY_STEMS: Record<string, string> = {
  甲: "Giáp",
  乙: "Ất",
  丙: "Bính",
  丁: "Đinh",
  戊: "Mậu",
  己: "Kỷ",
  庚: "Canh",
  辛: "Tân",
  壬: "Nhâm",
  癸: "Quý",
};

const EARTHLY_BRANCHES: Record<string, string> = {
  子: "Tý",
  丑: "Sửu",
  寅: "Dần",
  卯: "Mão",
  辰: "Thìn",
  巳: "Tỵ",
  午: "Ngọ",
  未: "Mùi",
  申: "Thân",
  酉: "Dậu",
  戌: "Tuất",
  亥: "Hợi",
};

const JIE_QI_VI: Record<string, string> = {
  立春: "Lập Xuân",
  雨水: "Vũ Thủy",
  惊蛰: "Kinh Trập",
  春分: "Xuân Phân",
  清明: "Thanh Minh",
  谷雨: "Cốc Vũ",
  立夏: "Lập Hạ",
  小满: "Tiểu Mãn",
  芒种: "Mang Chủng",
  夏至: "Hạ Chí",
  小暑: "Tiểu Thử",
  大暑: "Đại Thử",
  立秋: "Lập Thu",
  处暑: "Xử Thử",
  白露: "Bạch Lộ",
  秋分: "Thu Phân",
  寒露: "Hàn Lộ",
  霜降: "Sương Giáng",
  立冬: "Lập Đông",
  小雪: "Tiểu Tuyết",
  大雪: "Đại Tuyết",
  冬至: "Đông Chí",
  小寒: "Tiểu Hàn",
  大寒: "Đại Hàn",
};

export type LandingLunarInfo = {
  dayLabel: string;
  monthLabel: string;
  yearLabel: string;
  solarTermLabel: string;
  isAuspiciousHour: boolean;
};

function toVietnameseGanZhi(ganZhi: string): string {
  if (ganZhi.length < 2) return ganZhi;
  const stem = HEAVENLY_STEMS[ganZhi[0]] ?? ganZhi[0];
  const branch = EARTHLY_BRANCHES[ganZhi[1]] ?? ganZhi[1];
  return `${stem} ${branch}`;
}

export function formatLunarMonthName(month: number): string {
  const absMonth = Math.abs(month);
  const name = LUNAR_MONTHS[absMonth - 1] ?? String(absMonth);
  return month < 0 ? `Nhuận ${name}` : name;
}

function formatLunarMonth(month: number): string {
  return formatLunarMonthName(month);
}

function getNearestSolarTerm(lunar: Lunar): string {
  const today = lunar.getJieQi();
  if (today) return JIE_QI_VI[today] ?? today;

  const next = lunar.getNextJieQi().getName();
  const prev = lunar.getPrevJieQi().getName();
  return JIE_QI_VI[next] ?? JIE_QI_VI[prev] ?? next;
}

function isCurrentHourAuspicious(lunar: Lunar, date: Date): boolean {
  const times = lunar.getTimes();
  const index = Math.min(Math.floor((date.getHours() + 1) / 2), times.length - 1);
  return times[index]?.getTianShenLuck() === "吉";
}

export function getLandingLunarInfo(date = new Date()): LandingLunarInfo {
  const lunar = Lunar.fromDate(date);
  return {
    dayLabel: String(lunar.getDay()),
    monthLabel: formatLunarMonth(lunar.getMonth()),
    yearLabel: `Năm ${toVietnameseGanZhi(lunar.getYearInGanZhi())}`,
    solarTermLabel: getNearestSolarTerm(lunar),
    isAuspiciousHour: isCurrentHourAuspicious(lunar, date),
  };
}

export function formatLandingUpdateTime(date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
