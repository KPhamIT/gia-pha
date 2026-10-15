import type { FamilyTreeData } from "@/components/types/family-tree-types";
import type { ExportDecorationLayer } from "./export-decoration-layers";
import {
  EXPORT_IMAGE_SOURCES,
  resolveHeaderImageLayer,
  type ResolvedLayout,
} from "./export-tree-geometry";
import type { Rect } from "./export-tree-model";
import type { ExportTitleCfg } from "./tree-export-settings";

/** Vùng chữ trên dải đỏ của ảnh cuốn thư (tỉ lệ theo khung ảnh). */
export const SCROLL_TITLE_RECT = { x: 0.35, y: 0.29, width: 0.3, height: 0.36 };

/** Từ đầu tên không phải họ (tên gọi theo ngôi thứ trong cây). */
const NOT_SURNAME = new Set(["thủy", "thuỷ", "đại", "trung", "tiểu", "cụ", "ông", "bà"]);

function capitalize(word: string): string {
  const lower = word.toLocaleLowerCase("vi");
  return lower.charAt(0).toLocaleUpperCase("vi") + lower.slice(1);
}

/** "Họ Phạm — Chi Tây" / "Dòng họ Phạm" → "Phạm". */
function surnameFromOrgName(orgName: string): string | null {
  const match = /^(?:dòng\s+)?họ\s+([^\s—–\-,]+)/iu.exec(orgName.trim());
  return match ? capitalize(match[1]) : null;
}

/** Họ xuất hiện nhiều nhất trong tên thành viên (ưu tiên nam — người trong dòng). */
function majoritySurname(persons: FamilyTreeData["persons"]): string | null {
  const counts = new Map<string, number>();
  for (const person of persons) {
    const first = person.fullName.trim().split(/\s+/)[0];
    if (!first || NOT_SURNAME.has(first.toLocaleLowerCase("vi"))) continue;
    const weight = person.gender?.trim() === "Nam" ? 2 : 1;
    const key = capitalize(first);
    counts.set(key, (counts.get(key) ?? 0) + weight);
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [name, count] of counts) {
    if (count > bestCount) {
      best = name;
      bestCount = count;
    }
  }
  return best;
}

/** Tên dòng họ: người dùng nhập > tên tổ chức "Họ X" > họ phổ biến trong cây. */
export function resolveClanName(
  stored: string,
  treeData: FamilyTreeData,
  orgName?: string | null,
): string {
  const typed = stored.trim().replace(/^(?:dòng\s+)?họ\s+/iu, "");
  if (typed) return typed;
  const fromOrg = orgName ? surnameFromOrgName(orgName) : null;
  return fromOrg ?? majoritySurname(treeData.persons) ?? "";
}

export function clanTitleLines(clanName: string, showGiaPha: boolean): string[] {
  const clan = clanName.trim() ? `HỌ ${clanName.trim().toLocaleUpperCase("vi")}` : "";
  return [showGiaPha ? "GIA PHẢ" : "", clan].filter(Boolean);
}

function isScrollLayer(layer: ExportDecorationLayer): boolean {
  return layer.type === "image" && layer.assetUrl === EXPORT_IMAGE_SOURCES.scroll;
}

function subRect(box: Rect, frac: Rect): Rect {
  return {
    x: box.x + box.width * frac.x,
    y: box.y + box.height * frac.y,
    width: box.width * frac.width,
    height: box.height * frac.height,
  };
}

/** Các ô cần vẽ chữ tiêu đề, theo chế độ của kiểu gia phả. */
export function resolveTitleRects(
  title: ExportTitleCfg,
  layers: ExportDecorationLayer[],
  layout: ResolvedLayout,
  borderRect: Rect,
  headerRect: Rect,
): Rect[] {
  if (title.mode === "frame" && title.rect) return [subRect(borderRect, title.rect)];
  if (title.mode === "header") {
    return [subRect(headerRect, { x: 0.3, y: 0.1, width: 0.4, height: 0.8 })];
  }
  if (title.mode !== "scroll") return [];
  return layers.filter(isScrollLayer).flatMap((layer) => {
    const resolved = resolveHeaderImageLayer(layer, layout);
    // Lớp cuốn thư cũ bị ẩn → không có ảnh để đặt chữ.
    if (layer.id === "legacy-scroll" && !resolved) return [];
    return [subRect(resolved ?? layer, SCROLL_TITLE_RECT)];
  });
}
