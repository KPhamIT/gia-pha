import type { UserSettings } from "@/lib/api/modules/settings";

/** Mặc định UI (sổ, cây, theme) — chỉ dùng ở frontend. */
export const DEFAULT_USER_SETTINGS = {
  book: {
    coverTitle: "GIA PHẢ",
    coverFontId: "thanhcong",
    formStyleId: "classic",
    prefaceBody:
      '\'"Cây có cội, nước có nguồn,\nCon người có tổ có tông."\n\nTừ ngàn đời nay, đạo lý "Uống nước nhớ nguồn" luôn là nét đẹp quý báu trong truyền thống dân tộc Việt Nam. Mỗi dòng họ đều có một cội nguồn, một lịch sử hình thành và phát triển được vun đắp bởi công lao của tổ tiên qua nhiều thế hệ.\n\nCuốn gia phả này được biên soạn với mong muốn ghi lại nguồn gốc, quá trình phát triển của dòng họ, lưu giữ những thông tin về tổ tiên, các thế hệ con cháu và những giá trị truyền thống tốt đẹp đã được truyền lại từ đời này sang đời khác.\n\nGia phả không chỉ là bản ghi chép về huyết thống mà còn là cầu nối giữa quá khứ và hiện tại, giúp con cháu hiểu rõ cội nguồn của mình, gìn giữ đạo hiếu, vun đắp tình đoàn kết gia tộc và phát huy những truyền thống tốt đẹp của tổ tiên.\n\nNguyện mong các thế hệ con cháu luôn ghi nhớ công đức tiền nhân, sống nhân nghĩa, hiếu thuận, chăm lo học tập và lao động, cùng nhau xây dựng gia đình hạnh phúc, dòng họ hưng thịnh, góp phần làm rạng danh tổ tiên và quê hương đất nước.\n\nKính cẩn ghi nhớ công đức Tổ tiên.',
    coverLineage: "Phụng lập gia phả – Lưu truyền hậu thế",
    prefaceTitle: "Lời Mở Đầu",
    borderStyleId: "modern",
    coverSubtitle: "",
    prefaceSignature: " ",
  },
  theme: "dark",
  nodeWidth: 80,
  nodeHeight: 120,
  nodeBgColor: "#f60404",
  verticalStep: 220,
  horizontalGap: 15,
  nodeTextColor: "#d4f005",
} satisfies UserSettings;

export function defaultCoverSubtitle(organizationName: string): string {
  return `Dòng họ ${organizationName}`;
}

function withOrgCoverSubtitle(
  settings: UserSettings,
  organizationName?: string | null,
): UserSettings {
  if (!organizationName) return settings;
  const book = {
    ...(settings.book as Record<string, unknown>),
    coverSubtitle: defaultCoverSubtitle(organizationName),
  };
  return { ...settings, book };
}

/** Gộp mặc định FE khi API chưa có dữ liệu (backend chỉ lưu/trả phần user đã lưu). */
export function resolveUserSettings(
  data: UserSettings | null | undefined,
  organizationName?: string | null,
): UserSettings {
  if (!data || Object.keys(data).length === 0) {
    return withOrgCoverSubtitle({ ...DEFAULT_USER_SETTINGS }, organizationName);
  }
  return data;
}
