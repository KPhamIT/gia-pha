/** Mẫu bài cúng hệ thống hiển thị công khai (trang /van-khan) — chỉ đọc, giữ nguyên nội dung. */

const PLACEHOLDER_CONTENT = /^(coming|comming)\s*soon/i;
const MIN_PUBLIC_CONTENT_LENGTH = 200;

type PublicCandidate = {
  name: string;
  content: string;
  seoSlug: string | null;
};

export function slugifyVietnamese(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Slug công khai: dùng seoSlug nếu có, nếu không sinh từ tên (không ghi DB). */
export function publicCeremonySlug(template: PublicCandidate): string {
  const seoSlug = template.seoSlug?.trim();
  if (seoSlug) return seoSlug;
  const fromName = slugifyVietnamese(template.name);
  return /^(bai-cung|van-khan)-/.test(fromName)
    ? fromName
    : `bai-cung-${fromName}`;
}

/** Bỏ mẫu chưa có nội dung thật (vd. "comming soon"). */
export function isPublishableCeremony(template: PublicCandidate): boolean {
  const content = template.content.trim();
  return (
    content.length >= MIN_PUBLIC_CONTENT_LENGTH &&
    !PLACEHOLDER_CONTENT.test(content)
  );
}
