import { scrollHeaderAt, type TreeExportSettings } from "./tree-export-settings";
import {
  bannerTitle,
  coupletAt,
  LEFT_TEXT,
  noCouplets,
  palette,
  RIGHT_TEXT,
} from "./tree-export-theme-helpers";

export { FRAME_H, FRAME_W } from "./tree-export-theme-helpers";

/**
 * Kiểu gia phả trọn bộ: chọn một kiểu là mọi thành phần (khung nền, cuốn thư,
 * câu đối, màu ô, đường nối, tiêu đề dòng họ) đổi theo — người dùng không phải chỉnh.
 * Màu chữ / nền đã kiểm tương phản WCAG ≥ 4.5 cho tên, ≥ 3 cho đường nối.
 */
export type TreeExportTheme = {
  id: string;
  label: string;
  /** 3 màu đại diện cho thẻ chọn kiểu: nền trang, nhấn, ô thành viên. */
  swatch: [string, string, string];
  /** Ảnh khung nền phủ cả khổ in; null = nền màu + viền vẽ. */
  frame: { url: string; aspectRatio: number } | null;
  /** Có khung nền nhưng vẫn dùng cuốn thư + rồng ở đầu trang. */
  scrollHeader?: boolean;
  overrides: Partial<TreeExportSettings>;
};

export const TREE_EXPORT_THEMES: TreeExportTheme[] = [
  {
    id: "cung-dinh",
    label: "Cung đình đỏ vàng",
    swatch: ["#f7f0dd", "#9b1c1c", "#fff7e0"],
    frame: null,
    overrides: {
      backgroundColor: "#f7f0dd",
      borderStyleId: "imperial",
      borderColor: "#8b1a1a",
      // Cuốn thư, rồng, chiều cao đầu trang lấy theo mặc định (tree-export-settings).
      // Câu đối nằm trong dải viền hồi văn (dày 700) — cột rộng ≈ 2 × 1680.
      coupletLeft: coupletAt(0.0585, null, LEFT_TEXT),
      coupletRight: coupletAt(0.9415, null, RIGHT_TEXT),
      coupletColor: "#7f1d1d",
      ...palette(["#fffaf0", "#f3d79a", "#7f1d1d", "#b45309", "ornate"], ["#9b1c1c", "#fde68a"], "#b45309"),
      treeSideInset: 4600,
    },
  },
  {
    id: "hoang-trieu",
    label: "Hoàng triều đỏ thắm",
    swatch: ["#b91c1c", "#facc15", "#fff8e7"],
    frame: { url: "/images/khung/khung6.svg", aspectRatio: 54000 / 34000 },
    overrides: {
      backgroundColor: "#b91c1c",
      borderStyleId: "plain",
      headerHeight: 7300,
      title: bannerTitle({ x: 0.41, y: 0.127, width: 0.18, height: 0.076 }, 2.9),
      coupletLeft: coupletAt(0.074, 0.4, LEFT_TEXT),
      coupletRight: coupletAt(0.926, 0.4, RIGHT_TEXT),
      coupletColor: "#fde68a",
      ...palette(["#fffaf0", "#fbe3a6", "#7f1d1d", "#a16207", "ornate"], ["#f4c430", "#7f1d1d"], "#fcd34d"),
      treeSideInset: 5600,
    },
  },
  {
    id: "hoa-phuong",
    label: "Hoa phượng hồng",
    swatch: ["#ffffff", "#be123c", "#fff5f5"],
    frame: { url: "/images/khung/khung1.svg", aspectRatio: 10104 / 6746 },
    overrides: {
      backgroundColor: "#ffffff",
      borderStyleId: "plain",
      headerHeight: 7700,
      title: bannerTitle({ x: 0.38, y: 0.108, width: 0.24, height: 0.075 }, 1.31),
      ...noCouplets,
      ...palette(["#fffafa", "#fbd5da", "#9f1239", "#e11d48", "classic"], ["#be123c", "#fff1c1"], "#e11d48"),
      treeSideInset: 6500,
    },
  },
  {
    id: "hoa-van-co",
    label: "Hoa văn cổ cam",
    swatch: ["#ffffff", "#c2410c", "#fffbeb"],
    frame: { url: "/images/khung/khung5.svg", aspectRatio: 11043 / 7521 },
    overrides: {
      backgroundColor: "#ffffff",
      borderStyleId: "plain",
      headerHeight: 7700,
      title: bannerTitle({ x: 0.39, y: 0.079, width: 0.22, height: 0.07 }, 1.34),
      ...noCouplets,
      ...palette(["#fffdf5", "#fde2b8", "#9a3412", "#ea580c", "double"], ["#c2410c", "#fff7d6"], "#ea580c"),
      treeSideInset: 6500,
    },
  },
  {
    id: "co-thu",
    label: "Cổ thư thanh nhã",
    swatch: ["#fffdf7", "#7c2d12", "#fdf6e3"],
    // Khung 7 đã bỏ cuốn thư be; đầu trang dùng cuốn thư đỏ + rồng như "Cung đình".
    frame: { url: "/images/khung/khung7-trong.svg", aspectRatio: 42377 / 28484 },
    scrollHeader: true,
    overrides: {
      backgroundColor: "#fffdf7",
      borderStyleId: "plain",
      // Viền khung 7 dày ≈ viền hồi văn → câu đối và lề cây đặt như "Cung đình".
      coupletLeft: coupletAt(0.0585, null, LEFT_TEXT),
      coupletRight: coupletAt(0.9415, null, RIGHT_TEXT),
      coupletColor: "#7f1d1d",
      ...palette(["#fffbf0", "#f1dcae", "#78350f", "#b7791f", "classic"], ["#7c2d12", "#fde68a"], "#a16207"),
      treeSideInset: 4600,
    },
  },
  {
    id: "phuong-hoang",
    label: "Phượng hoàng trống đồng",
    swatch: ["#fffdf2", "#1e3a8a", "#fffdf2"],
    frame: { url: "/images/khung/khung2.svg", aspectRatio: 33763 / 22055 },
    overrides: {
      backgroundColor: "#ffffff",
      borderStyleId: "plain",
      headerHeight: 5400,
      // Chữ "GIA PHẢ" in sẵn trong ảnh là chữ trắng (vô hình trên nền trắng) — vẽ đè cả hai dòng.
      title: {
        ...bannerTitle({ x: 0.4, y: 0.045, width: 0.2, height: 0.095 }, 2.6),
        color: "#b91c1c",
        strokeColor: "#ffffff",
      },
      // Câu đối nằm giữa đuôi phượng và cây; đuôi xoè rộng ở nửa trên nên cột dịch vào trong.
      coupletLeft: coupletAt(0.126, 0.36, LEFT_TEXT),
      coupletRight: coupletAt(0.874, 0.36, RIGHT_TEXT),
      coupletFontSize: 1150,
      coupletColor: "#8b1a1a",
      ...palette(["#fffef7", "#f2e3b0", "#1e3a8a", "#c9a227", "classic"], ["#1e3a8a", "#fde68a"], "#8a6d1d"),
      treeSideInset: 7600,
    },
  },
  {
    id: "muc-tau",
    label: "Mực tàu tối giản",
    swatch: ["#faf8f3", "#1f2937", "#ffffff"],
    frame: { url: "/images/khung/khung3.svg", aspectRatio: 10236 / 6804 },
    scrollHeader: true,
    overrides: {
      backgroundColor: "#faf8f3",
      borderStyleId: "plain",
      // Viền hồi văn khung 3 dày ≈ 2000 (tới chỉ đỏ) — cuốn thư, câu đối, cây đều nằm trong.
      ...scrollHeaderAt(2300),
      coupletLeft: coupletAt(0.0833, null, LEFT_TEXT),
      coupletRight: coupletAt(0.9167, null, RIGHT_TEXT),
      coupletColor: "#1f2937",
      ...palette(["#ffffff", "#e5e7eb", "#111827", "#374151", "modern"], ["#1f2937", "#f9fafb"], "#6b7280"),
      treeSideInset: 5900,
      treeBottomInset: 2000,
    },
  },
];
