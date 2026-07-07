/** Đồng bộ với UI.CONTACT_FORM_SUBJECT_OPTIONS (frontend). */
export const CONTACT_SUBJECT_OPTIONS = [
  'Hỗ trợ kỹ thuật',
  'Dịch vụ gia tộc',
  'Sự kiện & Triển lãm',
  'Hợp tác & Quảng cáo',
  'Khác',
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECT_OPTIONS)[number];
