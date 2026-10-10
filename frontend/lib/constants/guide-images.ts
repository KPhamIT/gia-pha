/** Ảnh chụp màn hình cho trang /huong-dan (dòng họ mẫu hư cấu, ảnh desktop). */
export type GuideImage = {
  src: string;
  width: number;
  height: number;
  /** Bề ngang tối đa (px) cho ảnh dọc / gần vuông — tránh ảnh quá cao. */
  maxWidth?: number;
};

const PORTRAIT = 460;
const SQUARE = 640;

const img = (name: string, width: number, height: number, maxWidth?: number): GuideImage => ({
  src: `/images/blog/${name}.webp`,
  width,
  height,
  maxWidth,
});

export const GUIDE_IMAGES = {
  cover: img("bia-so-gia-pha-desktop", 840, 1100, PORTRAIT),
  bookPerson: img("ho-so-thanh-vien-so-gia-pha-desktop", 840, 1100, PORTRAIT),
  bookLayout: img("tuy-chinh-trinh-bay-so-desktop", 800, 1050, PORTRAIT),
  tree: img("cay-gia-pha-nhieu-doi", 1040, 1080, SQUARE),
  treeFilter: img("loc-cay-gia-pha-theo-chi-doi-desktop", 1280, 800),
  treeExport: img("xuat-pha-do-cau-doi-cuon-thu", 1280, 800),
  personBio: img("tieu-su-mo-phan-desktop", 840, 1100, PORTRAIT),
  events: img("lich-su-kien-dong-ho-desktop", 1280, 800),
  contribution: img("dong-gop-quy-ho-theo-gia-dinh", 1280, 800),
  merit: img("danh-sach-cong-duc-dong-ho", 1344, 942),
  clanDuty: img("phan-cong-bien-ho-theo-nam", 1240, 1100, SQUARE),
  upcoming: img("ngay-gio-sap-toi-desktop", 1280, 800),
  account: img("tai-khoan-lien-ket-thanh-vien", 1280, 800),
  orgUsers: img("quan-ly-nguoi-dung-dong-ho", 1280, 800),
} as const;
