/**
 * Bài blog đã gộp (10/2026): nội dung mẫu trùng lặp → chuyển 301 về bài tốt nhất cùng chủ đề.
 * Key/value là slug (không gồm `/bai-viet/`). Bài nhóm "SEO" bị gỡ hẳn (404), không redirect.
 */
export const BLOG_MERGED_SLUGS: Record<string, string> = {
  // → Gia phả là gì
  "nguon-goc-va-lich-su-cua-gia-pha-tai-viet-nam": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",
  "vi-sao-moi-gia-dinh-nen-xay-dung-gia-pha": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",
  "gia-pha-dong-ho-va-cay-gia-dinh-khac-nhau-nhu-the-nao": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",
  "nhung-thong-tin-can-co-trong-mot-cuon-gia-pha": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",
  "vai-tro-cua-gia-pha-trong-viec-ket-noi-cac-the-he": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",
  "tai-sao-con-chau-can-tim-hieu-ve-nguon-coi-to-tien": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",
  "gia-pha-co-gia-tri-nhu-the-nao-doi-voi-lich-su-dong-ho": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",
  "vi-sao-nguoi-viet-luon-coi-trong-nguon-coi-to-tien": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",
  "van-hoa-uong-nuoc-nho-nguon-qua-viec-lap-gia-pha": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",
  "tam-quan-trong-cua-viec-giao-duc-con-chau-ve-lich-su-dong-ho": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",
  "gia-pha-song-ngu-viet-han-khi-nao-can-va-cach-trinh-bay": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",
  "gia-pha-la-gi-giai-thich-gia-pha-don-gian-cho-nguoi-moi-bat-dau": "gia-pha-la-gi-y-nghia-cua-gia-pha-doi-voi-moi-dong-ho",

  // → Thu thập & xác minh thông tin
  "nhung-sai-lam-thuong-gap-khi-lap-gia-pha": "cach-thu-thap-thong-tin-de-viet-gia-pha-chinh-xac",
  "cach-xac-minh-thong-tin-to-tien-trong-gia-pha": "cach-thu-thap-thong-tin-de-viet-gia-pha-chinh-xac",
  "huong-dan-phong-van-nguoi-cao-tuoi-de-ghi-chep-gia-pha": "cach-thu-thap-thong-tin-de-viet-gia-pha-chinh-xac",
  "nhung-luu-y-khi-cap-nhat-thong-tin-thanh-vien-trong-gia-pha": "cach-thu-thap-thong-tin-de-viet-gia-pha-chinh-xac",

  // → 5 bước tạo và in gia phả trên Cội Nguồn
  "huong-dan-cach-lap-gia-pha-dong-ho-tu-a-den-z": "5-buoc-tao-va-in-gia-pha-dong-ho-coi-nguon",
  "cac-buoc-xay-dung-gia-pha-cho-gia-dinh-moi-bat-dau": "5-buoc-tao-va-in-gia-pha-dong-ho-coi-nguon",
  "huong-dan-so-hoa-gia-pha-giay-thanh-gia-pha-dien-tu": "5-buoc-tao-va-in-gia-pha-dong-ho-coi-nguon",
  "cach-tao-cay-gia-dinh-truc-tuyen-don-gian": "5-buoc-tao-va-in-gia-pha-dong-ho-coi-nguon",
  "huong-dan-tao-gia-pha-truc-tuyen-mien-phi-cho-dong-ho": "5-buoc-tao-va-in-gia-pha-dong-ho-coi-nguon",
  "cach-in-gia-pha-ra-sach-dep-cho-le-gio-to-dong-ho": "5-buoc-tao-va-in-gia-pha-dong-ho-coi-nguon",
  "xuat-pdf-cay-gia-pha-de-in-kho-lon-treo-nha-tho-ho": "5-buoc-tao-va-in-gia-pha-dong-ho-coi-nguon",
  "gia-pha-cho-dong-ho-it-nguoi-bat-dau-tu-dau": "5-buoc-tao-va-in-gia-pha-dong-ho-coi-nguon",

  // → Sổ gia phả truyền thống vs điện tử
  "gia-pha-dien-tu-la-gi-xu-huong-luu-giu-gia-pha-thoi-dai-so": "so-gia-pha-truyen-thong-va-so-gia-pha-dien-tu-so-sanh-chi-tiet",
  "cach-luu-tru-gia-pha-an-toan-qua-nhieu-the-he": "so-gia-pha-truyen-thong-va-so-gia-pha-dien-tu-so-sanh-chi-tiet",
  "lam-the-nao-de-bao-ton-gia-pha-cho-con-chau-mai-sau": "so-gia-pha-truyen-thong-va-so-gia-pha-dien-tu-so-sanh-chi-tiet",
  "so-sanh-cay-gia-dinh-truyen-thong-va-cay-gia-dinh-online": "so-gia-pha-truyen-thong-va-so-gia-pha-dien-tu-so-sanh-chi-tiet",
  "so-sanh-gia-pha-giay-va-gia-pha-online": "so-gia-pha-truyen-thong-va-so-gia-pha-dien-tu-so-sanh-chi-tiet",

  // → Ngày giỗ tổ
  "y-nghia-cua-viec-tho-cung-to-tien-trong-van-hoa-viet-nam": "ngay-gio-to-dong-ho-co-y-nghia-gi",
  "nhung-phong-tuc-truyen-thong-trong-cac-dong-ho-viet-nam": "ngay-gio-to-dong-ho-co-y-nghia-gi",
  "quan-ly-ngay-gio-am-lich-trong-gia-pha-dien-tu": "ngay-gio-to-dong-ho-co-y-nghia-gi",

  // → Đời, chi, nhánh
  "vai-tro-cua-truong-ho-trong-viec-gin-giu-truyen-thong-dong-toc": "the-he-chi-nhanh-trong-gia-pha-dong-ho-giai-thich-de-hieu",
  "tim-ho-noi-ho-ngoai-tren-cay-gia-dinh-huong-dan-nhanh": "the-he-chi-nhanh-trong-gia-pha-dong-ho-giai-thich-de-hieu",

  // → Gia phả 3 đời, 5 đời
  "cach-quan-ly-thong-tin-nhieu-the-he-trong-cay-gia-dinh": "gia-pha-3-doi-5-doi-la-gi-cach-ghi-dung-the-he",

  // → Nhà thờ họ / họp họ
  "nhung-net-dep-trong-truyen-thong-ho-toc-viet-nam": "nha-tho-ho-la-gi-vai-tro-cua-nha-tho-ho-trong-dong-toc",
  "cach-thuyet-phuc-truong-ho-dau-tu-vao-gia-pha-online": "cach-to-chuc-hop-ho-hieu-qua-va-y-nghia",

  // → Vẽ sơ đồ cây gia đình
  "cay-gia-dinh-la-gi-huong-dan-xay-dung-cay-gia-dinh-de-hieu": "cach-ve-so-do-cay-gia-dinh-chuan-va-khoa-hoc",
  "loi-ich-cua-viec-tao-cay-gia-dinh-truc-tuyen": "cach-ve-so-do-cay-gia-dinh-chuan-va-khoa-hoc",
  "cac-ky-hieu-thuong-dung-trong-cay-gia-dinh": "cach-ve-so-do-cay-gia-dinh-chuan-va-khoa-hoc",
  "nhung-loi-thuong-gap-khi-xay-dung-cay-gia-dinh": "cach-ve-so-do-cay-gia-dinh-chuan-va-khoa-hoc",
  "cay-gia-dinh-giup-con-chau-hieu-ve-to-tien-nhu-the-nao": "cach-ve-so-do-cay-gia-dinh-chuan-va-khoa-hoc",
  "huong-dan-tao-cay-gia-dinh-cho-dai-gia-dinh-nhieu-the-he": "cach-ve-so-do-cay-gia-dinh-chuan-va-khoa-hoc",

  // → Mẫu sơ đồ phả hệ Excel/Word
  "nhung-cong-cu-ho-tro-xay-dung-cay-gia-dinh-hien-nay": "mau-so-do-pha-he-word-va-excel-cho-dong-ho",
  "phan-mem-gia-pha-excel-lam-gia-pha-bang-excel-va-han-che-can-biet": "mau-so-do-pha-he-word-va-excel-cho-dong-ho",

  // → Tiểu sử tổ tiên
  "le-tao-mo-va-ghi-nhan-mo-phan-trong-gia-pha": "ghi-chep-tieu-su-to-tien-trong-gia-pha-mau-va-goi-y",
  "ke-chuyen-to-tien-cho-tre-em-qua-cay-gia-dinh-tuong-tac": "ghi-chep-tieu-su-to-tien-trong-gia-pha-mau-va-goi-y",

  // → Website / gia phả online / phần mềm
  "loi-ich-cua-viec-su-dung-website-gia-pha-truc-tuyen": "website-gia-pha-tieu-chi-chon-website-gia-pha-cho-dong-ho",
  "nhung-tinh-nang-can-co-cua-mot-website-gia-pha-hien-dai": "website-gia-pha-tieu-chi-chon-website-gia-pha-cho-dong-ho",
  "bao-mat-thong-tin-gia-pha-tren-moi-truong-internet": "website-gia-pha-tieu-chi-chon-website-gia-pha-cho-dong-ho",
  "gia-pha-va-gdpr-bao-ve-du-lieu-ca-nhan-ho-hang": "website-gia-pha-tieu-chi-chon-website-gia-pha-cho-dong-ho",
  "vi-sao-gia-pha-online-dang-tro-thanh-xu-huong": "gia-pha-online-la-gi-huong-dan-dung-gia-pha-online-hieu-qua",
  "cach-quan-ly-gia-pha-dong-ho-bang-cong-nghe-so": "gia-pha-online-la-gi-huong-dan-dung-gia-pha-online-hieu-qua",
  "gia-pha-dien-tu-giup-ket-noi-ho-hang-o-xa-nhu-the-nao": "gia-pha-online-la-gi-huong-dan-dung-gia-pha-online-hieu-qua",
  "cach-chia-se-gia-pha-cho-con-chau-tren-toan-the-gioi": "gia-pha-online-la-gi-huong-dan-dung-gia-pha-online-hieu-qua",
  "tuong-lai-cua-gia-pha-trong-thoi-dai-chuyen-doi-so": "gia-pha-online-la-gi-huong-dan-dung-gia-pha-online-hieu-qua",
  "so-sanh-ung-dung-gia-pha-tren-dien-thoai-va-website": "gia-pha-online-la-gi-huong-dan-dung-gia-pha-online-hieu-qua",
  "hop-tac-bien-tap-gia-pha-nhieu-nguoi-cung-cap-nhat-online": "gia-pha-online-la-gi-huong-dan-dung-gia-pha-online-hieu-qua",
  "phan-mem-lam-gia-pha-mien-phi-tot-nhat-cho-dong-ho-viet-nam": "phan-mem-gia-pha-nen-chon-phan-mem-gia-pha-nao-cho-dong-ho",
};
