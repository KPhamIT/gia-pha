import type {
  NodeFontWeight,
  NodeTextCase,
  NodeTextDirection,
} from "@/components/types/family-tree-types";

/** Giá trị đầy đủ của một kiểu thẻ node (mặc định toàn cây). */
export type NodeAppearanceValues = {
  nodeWidth: number;
  nodeHeight: number;
  nodeBgColor: string;
  nodeTextColor: string;
  nodeFontSize: number;
  nodeFontWeight: NodeFontWeight;
  nodeTextDirection: NodeTextDirection;
  nodeTextCase: NodeTextCase;
};

export type NodeAppearanceKey = keyof NodeAppearanceValues;

/** Ghi đè một phần — dùng cho node / đời / mặc định. */
export type NodeAppearancePatch = Partial<NodeAppearanceValues>;

export type ResolvedNodeAppearance = NodeAppearanceValues;
