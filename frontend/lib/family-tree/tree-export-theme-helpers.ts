import { EXPORT_A0_WIDTH, EXPORT_BORDER_HEIGHT, EXPORT_OUTER_MARGIN } from "./export-tree-geometry";
import {
  DEFAULT_EXPORT_TITLE,
  type ExportTitleCfg,
  type TreeExportSettings,
} from "./tree-export-settings";

/** Trợ giúp dựng dữ liệu kiểu gia phả (toạ độ theo tỉ lệ khung in A0). */
export const FRAME_W = EXPORT_A0_WIDTH - EXPORT_OUTER_MARGIN * 2;
export const FRAME_H = EXPORT_BORDER_HEIGHT;
/** Toạ độ x tuyệt đối theo tỉ lệ bề ngang khung in. */
export const fx = (ratio: number) => EXPORT_OUTER_MARGIN + FRAME_W * ratio;
export const fy = (ratio: number) => EXPORT_OUTER_MARGIN + FRAME_H * ratio;

export const coupletAt = (xRatio: number, yRatio: number | null, text: string) => ({
  x: fx(xRatio),
  y: yRatio == null ? null : fy(yRatio),
  width: null,
  height: null,
  visible: true,
  text,
});
const hiddenCouplet = (text: string) => ({
  x: null,
  y: null,
  width: null,
  height: null,
  visible: false,
  text,
});
export const LEFT_TEXT = "Tổ Tiên Công Đức Thiên Niên Thịnh";
export const RIGHT_TEXT = "Tử Hiếu Tôn Hiền Vạn Đại Vinh";
export const noCouplets = {
  coupletLeft: hiddenCouplet(LEFT_TEXT),
  coupletRight: hiddenCouplet(RIGHT_TEXT),
};

/** Màu thẻ thường, khung đời 1–2 và đường nối. */
export const palette = (
  node: [bgTop: string, bgBottom: string, text: string, border: string, card: string],
  featured: [bg: string, text: string],
  edgeColor: string,
): Partial<TreeExportSettings> => ({
  nodeBgColor: node[0],
  nodeBgGradient: node[1],
  nodeShadow: true,
  nodeTextColor: node[2],
  nodeBorderColor: node[3],
  nodeBorderStyleId: node[4],
  featuredBgColor: featured[0],
  featuredTextColor: featured[1],
  edgeColor,
});

/** Chữ đặt vào dải cuốn thư có sẵn trong ảnh khung; `arc` đo từ mép trên dải (0 = thẳng). */
export const bannerTitle = (
  rect: ExportTitleCfg["rect"],
  arc: number,
): ExportTitleCfg => ({
  ...DEFAULT_EXPORT_TITLE,
  mode: "frame",
  rect,
  arc,
});
