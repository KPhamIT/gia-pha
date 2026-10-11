/**
 * Khung tiêu chí xem tuổi làm nhà. Mỗi tiêu chí là một module độc lập: nhận
 * bối cảnh (năm sinh, năm làm, tuổi mụ…) và trả kết quả của riêng nó.
 * Thêm tiêu chí = viết một module mới + đăng ký trong `criteria/index.ts`.
 */

export type Gender = "male" | "female";

/** Dữ liệu chung tính sẵn một lần, mọi tiêu chí dùng chung. */
export type BuildContext = {
  /** Giới tính gia chủ — dùng cho sao chiếu mệnh, vận hạn. */
  gender: Gender;
  birthYear: number;
  buildYear: number;
  /** Tuổi mụ = năm làm − năm sinh + 1 (âm lịch). */
  age: number;
  birthCan: number;
  yearCan: number;
  birthChi: number;
  yearChi: number;
  birthCanChi: string;
  yearCanChi: string;
};

export type CriterionStatus = "good" | "neutral" | "bad";

/** Hình minh hoạ riêng (tuỳ chọn) — giao diện chọn component theo `kind`. */
export type CriterionVisual = { kind: "hoang-oc-ring"; activeIndex: number };

export type CriterionResult = {
  status: CriterionStatus;
  /** Điểm đạt được, từ 0 đến `maxScore` của tiêu chí. */
  score: number;
  /** Kết luận ngắn của tiêu chí. */
  summary: string;
  /** Giải thích cách tính. */
  details: string[];
  /** Ảnh hưởng theo quan niệm dân gian (vd. sao xấu gây chuyện gì). */
  impact?: string;
  /** Lời khuyên khi kết quả không tốt. */
  advice?: string;
  visual?: CriterionVisual;
  /** Nhãn ngắn cho bảng 10 năm (vd. tên cung Hoang Ốc). */
  shortLabel?: string;
};

/** Nhóm các tiêu chí liên quan nhau — chỉ để hiển thị và bật/tắt cả nhóm. */
export type CriterionGroup = {
  key: string;
  label: string;
  description: string;
  criteria: readonly Criterion[];
};

export type Criterion = {
  key: string;
  label: string;
  /** Trọng số: điểm tối đa của tiêu chí. Tổng được quy về thang 10. */
  maxScore: number;
  /** Ghi chú dưới thẻ (vd. "tham khảo thêm"). */
  note?: string;
  evaluate: (ctx: BuildContext) => CriterionResult;
};
