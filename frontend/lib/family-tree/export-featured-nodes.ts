import type {
  FamilyTreeData,
  LevelNodeStyle,
} from "@/components/types/family-tree-types";
import type { FamilyTreeLayoutConfig } from "@/components/family-tree/graph/layout";
import {
  buildRelationMaps,
  getEffectiveRelationships,
  getTreeEdges,
  normalizeParentChildEdges,
} from "@/components/family-tree/graph/layout/edges";
import { resolveGlobalNodeAppearance } from "@/lib/family-tree/node-appearance";
import { getRootPerson } from "@/utils/family-tree-utils";
import { featuredMaxFont, featuredWidthForName } from "./export-featured-node-text";

/** 0 = thủy tổ, 1 = các con, 2 = các cháu của thủy tổ. */
export type FeaturedRank = 0 | 1 | 2;

/** Đời 2 / đời 3 chỉ được vẽ ngang khi ít người — đủ chỗ trên khổ in. */
export const FEATURED_SECOND_GEN_MAX = 6;
export const FEATURED_THIRD_GEN_MAX = 8;

/** Khung nền đặc màu nhấn (thủy tổ, đời 2); đời 3 dùng nền thẻ thường. */
export function isSolidFeatured(rank: FeaturedRank | null | undefined): boolean {
  return rank === 0 || rank === 1;
}

const uniqueChildren = (childMap: Map<number, number[]>, ids: number[]) =>
  Array.from(new Set(ids.flatMap((id) => childMap.get(id) ?? [])));

/** Thủy tổ + con (và vợ/chồng của họ) được vẽ khung ngang lớn trên bản in. */
export function computeFeaturedRanks(
  treeData: FamilyTreeData,
): Map<number, FeaturedRank> {
  const { persons, relationships, root } = treeData;
  const rootId = getRootPerson(persons)?.id ?? root.id;
  const effective = getEffectiveRelationships(relationships);
  const { childMap } = buildRelationMaps(
    normalizeParentChildEdges(getTreeEdges(effective)),
  );

  const ranks = new Map<number, FeaturedRank>([[rootId, 0]]);
  const children = uniqueChildren(childMap, [rootId]);
  if (children.length <= FEATURED_SECOND_GEN_MAX) {
    for (const id of children) if (!ranks.has(id)) ranks.set(id, 1);
    const grandchildren = uniqueChildren(childMap, children).filter((id) => !ranks.has(id));
    if (grandchildren.length <= FEATURED_THIRD_GEN_MAX) {
      for (const id of grandchildren) ranks.set(id, 2);
    }
  }

  for (const rel of effective) {
    if (rel.type !== "SPOUSE") continue;
    const a = ranks.get(rel.fromId);
    const b = ranks.get(rel.toId);
    if (a !== undefined && b === undefined) ranks.set(rel.toId, a);
    if (b !== undefined && a === undefined) ranks.set(rel.fromId, b);
  }
  return ranks;
}

/**
 * Kích thước khung ngang theo hạng. Bề rộng giãn theo độ dài tên để tên luôn
 * nằm một dòng ở cỡ chữ chuẩn (trong khoảng min–max của hạng).
 */
export function featuredNodeStyle(
  rank: FeaturedRank,
  config: FamilyTreeLayoutConfig,
  name = "",
): LevelNodeStyle {
  const base = resolveGlobalNodeAppearance(config);
  // Đời 3: ngang nhưng nhỏ hơn đời 2 (thấp hơn 15%).
  const minRatio = [2.6, 2.2, 1.75][rank]!;
  const maxRatio = [4, 3.4, 2.6][rank]!;
  const fontRatio = [1.6, 1.3, 1.15][rank]!;
  const height = Math.round(base.nodeHeight * (rank === 2 ? 0.85 : 1));
  const fontSize = Math.round(base.nodeFontSize * fontRatio);
  const needed = featuredWidthForName(name, height, featuredMaxFont(rank, height, fontSize));
  const width = Math.min(Math.max(needed, base.nodeHeight * minRatio), base.nodeHeight * maxRatio);
  return {
    nodeWidth: Math.round(width),
    nodeHeight: height,
    nodeFontSize: fontSize,
    nodeTextDirection: "horizontal",
  };
}

export type FeaturedColors = { nodeBgColor: string; nodeTextColor: string };

/**
 * Gộp kiểu khung lớn vào `nodeStyles` để bố cục cây chừa đủ bề ngang.
 * Kiểu riêng người dùng đã đặt cho từng thành viên vẫn được ưu tiên.
 */
export function withFeaturedNodeStyles(
  config: FamilyTreeLayoutConfig,
  ranks: Map<number, FeaturedRank>,
  colors?: FeaturedColors,
  names?: Map<number, string>,
): FamilyTreeLayoutConfig {
  const nodeStyles: Record<string, LevelNodeStyle> = { ...config.nodeStyles };
  for (const [id, rank] of ranks) {
    const key = String(id);
    nodeStyles[key] = {
      ...featuredNodeStyle(rank, config, names?.get(id)),
      ...(isSolidFeatured(rank) ? colors : undefined),
      ...nodeStyles[key],
    };
  }
  return { ...config, nodeStyles };
}
