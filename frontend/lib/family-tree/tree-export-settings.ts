import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { isNodeCardId, isTreeBorderId } from "./svg-border";
import {
  type ExportDecorationLayer,
  type ExportLayerTier,
} from "./export-decoration-layers";
import {
  DRAGON_ASPECT,
  EXPORT_A0_WIDTH,
  EXPORT_OUTER_MARGIN,
  EXPORT_PADDING,
  defaultExportBorderRect,
  defaultExportHeaderRect,
  EXPORT_HEADER_HEIGHT_DEFAULT,
  isLegacyExportScale,
  isLegacyHeaderImageCfg,
  isLegacyHeaderImageLayer,
  resolveExportLayout,
  SCROLL_ASPECT,
} from "./export-tree-geometry";
import { EXPORT_IMAGE_SOURCES } from "./export-tree-geometry";

/**
 * A draggable box. Any of x/y/width/height may be `null`, meaning "auto" —
 * the renderer fills it with a computed default based on the canvas geometry.
 * Once the user drags/resizes an item, concrete numbers are stored.
 */
export type ExportBox = {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
};

export type ExportImageCfg = ExportBox & { visible: boolean };

export type ExportCoupletCfg = ExportBox & {
  visible: boolean;
  text: string;
};

/**
 * Presentation settings for exporting the family tree as a print-ready SVG.
 * Persisted per device in localStorage (no backend field exists).
 */
/**
 * Chữ "GIA PHẢ / HỌ …" vẽ động theo dòng họ của người dùng.
 * - scroll: đặt lên dải đỏ của mọi lớp ảnh cuốn thư.
 * - frame: đặt vào ô `rect` (tỉ lệ 0–1 của khung in) — dải cuốn thư có sẵn trong ảnh khung nền.
 * - header: chữ đứng riêng, giữa vùng đầu trang.
 */
export type ExportTitleCfg = {
  mode: "none" | "scroll" | "frame" | "header";
  rect: { x: number; y: number; width: number; height: number } | null;
  /** false khi ảnh khung đã in sẵn chữ "GIA PHẢ" — chỉ vẽ dòng "HỌ …". */
  showGiaPha: boolean;
  color: string;
  /** Viền chữ cho dễ đọc trên nền rực; rỗng = không viền. */
  strokeColor: string;
  /** Id font thư pháp; rỗng = serif đậm. */
  fontId: string;
  /**
   * Độ cong vồng lên theo mép trên dải cuốn thư: bán kính cung (qua mép trên ô chữ)
   * tính theo bề ngang ô chữ; 0 = chữ thẳng. Các dòng chạy trên cung đồng tâm.
   */
  arc: number;
};

export type TreeExportSettings = {
  /** Kiểu gia phả đang áp dụng (null = tự chỉnh). */
  themeId: string | null;
  /** Tên dòng họ trên tiêu đề, vd "Phạm"; rỗng = tự lấy theo tổ chức / thành viên. */
  clanName: string;
  title: ExportTitleCfg;
  /** Màu khung lớn của thủy tổ và đời thứ hai. */
  featuredBgColor: string;
  featuredTextColor: string;
  /** Màu đường nối; null = theo cài đặt cây. */
  edgeColor: string | null;
  /** Lề thêm hai bên vùng cây (đơn vị SVG) — tránh hoa văn hai bên khung nền. */
  treeSideInset: number;
  /** Màu dưới của nền thẻ (chuyển dọc từ nodeBgColor); null = nền đặc. */
  nodeBgGradient: string | null;
  /** Bóng đổ mềm dưới thẻ — tách thẻ khỏi nền trang sáng. */
  nodeShadow: boolean;
  /** Lề dưới vùng cây (SVG units) — viền dày nằm trong ảnh khung nền. */
  treeBottomInset: number;
  backgroundColor: string;
  borderStyleId: string;
  borderColor: string;
  /** Height (in SVG units) of the decorative band above the tree. */
  headerHeight: number;
  scroll: ExportImageCfg;
  dragonLeft: ExportImageCfg;
  dragonRight: ExportImageCfg;
  coupletLeft: ExportCoupletCfg;
  coupletRight: ExportCoupletCfg;
  /** Calligraphy font (thư pháp) used for both couplets, same set as the book cover. */
  coupletFontId: string;
  /** Shared text colour for both couplets. */
  coupletColor: string;
  /** Shared font size (SVG units) for both couplets; null = auto (≈ 18rem column). */
  coupletFontSize: number | null;
  /** Person card appearance. */
  nodeBgColor: string;
  nodeTextColor: string;
  nodeBorderColor: string;
  /** Border/frame style id for each person card. */
  nodeBorderStyleId: string;
  /** Name font size (SVG units) inside each person card. */
  nodeFontSize: number;
  /** Dynamic decoration layers (images + free text). */
  layers: ExportDecorationLayer[];
  /** Extra pan offset on top of auto-fit placement (SVG units). */
  treeOffsetX: number;
  treeOffsetY: number;
  /** Zoom multiplier on top of auto-fit scale (1 = vừa khổ A0). */
  treeUserScale: number;
};

export type TreeExportPreset = {
  id: string;
  label: string;
  settings: TreeExportSettings;
};

export const TREE_EXPORT_PRESETS_KEY = "treeExportPresets";

const GOLD = "#7c2d12";
const COUPLET_COLOR = "#7f1d1d";

/**
 * Đầu trang mặc định (kiểu "Cung đình"): cuốn thư 36% bề ngang để tiêu đề là chữ
 * lớn nhất trang (lớn hơn ô thủy tổ); rồng cân giữa cuốn thư, nằm trong viền.
 */
const HEADER_CONTENT_W = EXPORT_A0_WIDTH - (EXPORT_OUTER_MARGIN + EXPORT_PADDING) * 2;
const SCROLL_WIDTH = Math.round(HEADER_CONTENT_W * 0.36);
// Dưới dải viền "Cung đình hồi văn" (60 + 700) và chỉ vàng trong.
const SCROLL_TOP = 1000;
const DRAGON_SIZE = 5600;
export const SCROLL_HEADER_HEIGHT = 7400;

/**
 * Cuốn thư + rồng + chiều cao đầu trang khi cuốn thư bắt đầu ở `top`
 * (khung nền có viền dày thì hạ cuốn thư xuống dưới viền).
 */
export function scrollHeaderAt(top: number) {
  const dragonTop = Math.round(top + SCROLL_WIDTH / SCROLL_ASPECT / 2 - DRAGON_SIZE / 2);
  return {
    headerHeight: SCROLL_HEADER_HEIGHT + (top - SCROLL_TOP),
    scroll: sizedImage(top, SCROLL_WIDTH),
    dragonLeft: sizedImage(dragonTop, DRAGON_SIZE),
    dragonRight: sizedImage(dragonTop, DRAGON_SIZE),
  };
}

function sizedImage(y: number, width: number): ExportImageCfg {
  return { x: null, y, width, height: null, visible: true };
}

export const DEFAULT_EXPORT_TITLE: ExportTitleCfg = {
  mode: "scroll",
  rect: null,
  showGiaPha: true,
  color: "#ffe14d",
  strokeColor: "#7a0f0f",
  fontId: "",
  // Đo từ mép trên dải đỏ của ảnh cuonthu.png (bán kính ≈ 461px / ô chữ rộng 300px).
  arc: 1.54,
};

export function defaultTreeExportSettings(): TreeExportSettings {
  return {
    // Người dùng mới vào thẳng kiểu "Cung đình đỏ vàng" (xem tree-export-themes).
    themeId: "cung-dinh",
    clanName: "",
    title: { ...DEFAULT_EXPORT_TITLE },
    featuredBgColor: "#9b1c1c",
    featuredTextColor: "#fde68a",
    edgeColor: "#b45309",
    treeSideInset: 3700,
    nodeBgGradient: "#f3d79a",
    nodeShadow: true,
    treeBottomInset: 0,
    backgroundColor: "#f7f0dd",
    borderStyleId: "classic",
    borderColor: GOLD,
    ...scrollHeaderAt(SCROLL_TOP),
    coupletLeft: {
      x: null,
      y: null,
      width: null,
      height: null,
      visible: true,
      text: "Tổ Tiên Công Đức Thiên Niên Thịnh",
    },
    coupletRight: {
      x: null,
      y: null,
      width: null,
      height: null,
      visible: true,
      text: "Tử Hiếu Tôn Hiền Vạn Đại Vinh",
    },
    coupletFontId: "thanhcong",
    coupletColor: COUPLET_COLOR,
    coupletFontSize: null,
    nodeBgColor: "#fffaf0",
    nodeTextColor: "#7f1d1d",
    nodeBorderColor: "#b45309",
    nodeBorderStyleId: "ornate",
    nodeFontSize: 20,
    layers: [],
    treeOffsetX: 0,
    treeOffsetY: 0,
    treeUserScale: 1,
  };
}

// Preset definitions + collection helpers live in tree-export-presets.ts;
// re-exported here so existing import paths keep working.
export {
  getTreeExportPresets,
  normalizeTreeExportPresets,
  serializeTreeExportPresets,
} from "./tree-export-presets";

function normalizeImage(
  partial: Partial<ExportImageCfg> | undefined,
  base: ExportImageCfg,
): ExportImageCfg {
  return { ...base, ...(partial ?? {}) };
}

function normalizeCouplet(
  partial: Partial<ExportCoupletCfg> | undefined,
  base: ExportCoupletCfg,
): ExportCoupletCfg {
  return { ...base, ...(partial ?? {}) };
}

function normalizeLayers(
  partial: Partial<TreeExportSettings> | null | undefined,
  legacy: TreeExportSettings,
): ExportDecorationLayer[] {
  if (partial && Array.isArray(partial.layers)) {
    if (partial.layers.length === 0) return [];
    return partial.layers.map((layer) => {
      const base = {
        ...layer,
        order: layer.order ?? 0,
        tier: (layer.tier ?? "above-tree") as ExportLayerTier,
        locked: layer.locked ?? false,
      };
      if (layer.type === "text") {
        return {
          ...base,
          bold: layer.bold ?? false,
          vertical: layer.vertical ?? false,
          textCurve: layer.textCurve ?? 0,
          textRotation: layer.textRotation ?? 0,
        };
      }
      return base;
    });
  }
  return migrateLegacyDecorations(legacy);
}

function migrateLegacyDecorations(
  settings: TreeExportSettings,
): ExportDecorationLayer[] {
  const layout = resolveExportLayout(
    settings,
    defaultExportHeaderRect(settings.headerHeight),
    defaultExportBorderRect(),
  );
  const layers: ExportDecorationLayer[] = [];
  let order = 0;

  const pushFromLayout = (
    id: string,
    name: string,
    url: string,
    box: (typeof layout)["scroll"],
    aspectRatio: number,
    tier: ExportLayerTier = "above-tree",
  ) => {
    if (!box.visible) return;
    layers.push({
      id,
      type: "image",
      tier,
      order: order++,
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      assetUrl: url,
      assetProvider: "static",
      name,
      aspectRatio,
      locked: false,
    });
  };

  pushFromLayout(
    "legacy-scroll",
    "Cuốn thư",
    EXPORT_IMAGE_SOURCES.scroll,
    layout.scroll,
    SCROLL_ASPECT,
  );
  pushFromLayout(
    "legacy-dragon-left",
    "Rồng trái",
    EXPORT_IMAGE_SOURCES.dragonLeft,
    layout.dragonLeft,
    DRAGON_ASPECT,
  );
  pushFromLayout(
    "legacy-dragon-right",
    "Rồng phải",
    EXPORT_IMAGE_SOURCES.dragonRight,
    layout.dragonRight,
    DRAGON_ASPECT,
  );

  return layers;
}

const LEGACY_COUPLET_COORD_MAX = 6000;
/** Cỡ chữ cũ (pre-A0) hoặc auto quá to (ratio 0.78) → reset về auto. */
const LEGACY_COUPLET_FONT_TOO_SMALL = 200;
const LEGACY_COUPLET_FONT_TOO_LARGE = 1800;

function normalizeCoupletFontSize(
  size: number | null | undefined,
): number | null {
  if (size == null) return null;
  if (size < LEGACY_COUPLET_FONT_TOO_SMALL) return null;
  if (size > LEGACY_COUPLET_FONT_TOO_LARGE) return null;
  return size;
}

function migrateLegacyHeaderImageCfg(
  settings: TreeExportSettings,
): TreeExportSettings {
  const resetIfLegacy = (cfg: ExportImageCfg): ExportImageCfg => {
    if (!isLegacyHeaderImageCfg(cfg)) return cfg;
    return { ...cfg, x: null, y: null, width: null, height: null };
  };

  return {
    ...settings,
    scroll: resetIfLegacy(settings.scroll),
    dragonLeft: resetIfLegacy(settings.dragonLeft),
    dragonRight: resetIfLegacy(settings.dragonRight),
  };
}

function migrateLegacyHeaderLayers(
  settings: TreeExportSettings,
): TreeExportSettings {
  const needsSync = settings.layers.some(
    (layer) => layer.type === "image" && isLegacyHeaderImageLayer(layer),
  );
  if (!needsSync) return settings;

  const layout = resolveExportLayout(
    settings,
    defaultExportHeaderRect(settings.headerHeight),
    defaultExportBorderRect(),
  );
  const patchById: Record<string, { x: number; y: number; width: number; height: number }> =
    {
      "legacy-scroll": layout.scroll,
      "legacy-dragon-left": layout.dragonLeft,
      "legacy-dragon-right": layout.dragonRight,
    };

  return {
    ...settings,
    layers: settings.layers.map((layer) => {
      if (layer.type !== "image" || !isLegacyHeaderImageLayer(layer)) {
        return layer;
      }
      const patch = patchById[layer.id];
      if (!patch) return layer;
      return { ...layer, ...patch };
    }),
  };
}

function migrateLegacyCoupletLayout(
  settings: TreeExportSettings,
): TreeExportSettings {
  const resetIfLegacy = (cfg: ExportCoupletCfg): ExportCoupletCfg => {
    // Toạ độ kéo thả thời khổ nhỏ có cả x lẫn y < 6000. Chỉ x nhỏ là câu đối trái
    // hợp lệ trên A0 (kiểu gia phả đặt x, để y tự động) — không được reset.
    const legacy =
      cfg.x != null &&
      cfg.y != null &&
      cfg.x < LEGACY_COUPLET_COORD_MAX &&
      cfg.y < LEGACY_COUPLET_COORD_MAX;
    if (!legacy) return cfg;
    return { ...cfg, x: null, y: null };
  };

  const coupletFontSize = normalizeCoupletFontSize(settings.coupletFontSize);

  return {
    ...settings,
    coupletLeft: resetIfLegacy(settings.coupletLeft),
    coupletRight: resetIfLegacy(settings.coupletRight),
    coupletFontSize,
  };
}

function migrateLegacyA0Scale(
  settings: TreeExportSettings,
): TreeExportSettings {
  if (!isLegacyExportScale(settings.headerHeight)) {
    return settings;
  }

  const scale = EXPORT_HEADER_HEIGHT_DEFAULT / settings.headerHeight;
  const resetBox = <T extends ExportImageCfg | ExportCoupletCfg>(
    cfg: T,
  ): T => ({
    ...cfg,
    x: null,
    y: null,
    width: null,
    height: null,
  });

  return {
    ...settings,
    headerHeight: EXPORT_HEADER_HEIGHT_DEFAULT,
    scroll: resetBox(settings.scroll),
    dragonLeft: resetBox(settings.dragonLeft),
    dragonRight: resetBox(settings.dragonRight),
    coupletLeft: resetBox(settings.coupletLeft),
    coupletRight: resetBox(settings.coupletRight),
    coupletFontSize: normalizeCoupletFontSize(settings.coupletFontSize),
    layers: settings.layers.map((layer) => {
      if (layer.type !== "text" || layer.fontSize >= 180) return layer;
      return {
        ...layer,
        fontSize: Math.round(layer.fontSize * scale),
        width: Math.round(layer.width * scale),
        height: Math.round(layer.height * scale),
        x: layer.x * scale,
        y: layer.y * scale,
      };
    }),
  };
}

/** Merge an untrusted partial onto defaults and drop a stale border id. */
export function normalizeTreeExportSettings(
  partial: Partial<TreeExportSettings> | null | undefined,
): TreeExportSettings {
  const base = defaultTreeExportSettings();
  const merged: TreeExportSettings = {
    ...base,
    ...(partial ?? {}),
    scroll: normalizeImage(partial?.scroll, base.scroll),
    dragonLeft: normalizeImage(partial?.dragonLeft, base.dragonLeft),
    dragonRight: normalizeImage(partial?.dragonRight, base.dragonRight),
    coupletLeft: normalizeCouplet(partial?.coupletLeft, base.coupletLeft),
    coupletRight: normalizeCouplet(partial?.coupletRight, base.coupletRight),
    title: { ...base.title, ...(partial?.title ?? {}) },
    layers: [],
  };
  merged.layers = normalizeLayers(partial, merged);
  // Bản lưu cũ (trước khi có kiểu gia phả): giữ màu thẻ theo cây, không ép kiểu.
  if (partial && !("themeId" in partial)) {
    merged.themeId = null;
    merged.edgeColor = partial.edgeColor ?? null;
    merged.treeSideInset = partial.treeSideInset ?? 0;
    merged.nodeBgGradient = partial.nodeBgGradient ?? null;
    merged.nodeShadow = partial.nodeShadow ?? false;
  }
  if (!isTreeBorderId(merged.borderStyleId))
    merged.borderStyleId = base.borderStyleId;
  if (!isNodeCardId(merged.nodeBorderStyleId))
    merged.nodeBorderStyleId = base.nodeBorderStyleId;
  merged.treeOffsetX = partial?.treeOffsetX ?? base.treeOffsetX;
  merged.treeOffsetY = partial?.treeOffsetY ?? base.treeOffsetY;
  merged.treeUserScale = partial?.treeUserScale ?? base.treeUserScale;
  const migrated = migrateLegacyA0Scale(merged);
  const headerMigrated = migrateLegacyHeaderImageCfg(migrated);
  const layersMigrated = migrateLegacyHeaderLayers(headerMigrated);
  return migrateLegacyCoupletLayout(layersMigrated);
}

/** Đã có cài đặt xuất ảnh lưu trên máy chưa (người dùng mới → áp kiểu mặc định). */
export function hasSavedTreeExportSettings(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEYS.TREE_EXPORT_SETTINGS) != null;
  } catch {
    return false;
  }
}

export function loadTreeExportSettings(): TreeExportSettings {
  if (typeof window === "undefined") return defaultTreeExportSettings();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.TREE_EXPORT_SETTINGS);
    return normalizeTreeExportSettings(
      raw ? (JSON.parse(raw) as Partial<TreeExportSettings>) : null,
    );
  } catch {
    return defaultTreeExportSettings();
  }
}

export function saveTreeExportSettings(settings: TreeExportSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.TREE_EXPORT_SETTINGS,
      JSON.stringify(settings),
    );
  } catch {
    /* ignore quota / serialization errors */
  }
}
