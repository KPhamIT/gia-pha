import type { SystemAssetProvider } from "./export-system-assets";

export type ExportLayerTier = "behind-tree" | "above-tree" | "above-text";

export type ExportImageLayer = {
  id: string;
  type: "image";
  tier: ExportLayerTier;
  order: number;
  x: number;
  y: number;
  width: number;
  height: number;
  assetUrl: string;
  assetKey?: string;
  assetDbId?: number;
  assetProvider: SystemAssetProvider;
  name: string;
  aspectRatio: number;
};

export type ExportTextLayer = {
  id: string;
  type: "text";
  tier: ExportLayerTier;
  order: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  /** Id font thư pháp; rỗng = font thường. */
  fontId: string;
  color: string;
  fontSize: number;
  vertical: boolean;
  /** -100…100; 0 = thẳng. Cung elip, chỉ chữ ngang. */
  textCurve: number;
  /** Độ xoay quanh tâm chữ (-180…180). */
  textRotation: number;
};

export type ExportDecorationLayer = ExportImageLayer | ExportTextLayer;

export const EXPORT_LAYER_TIERS: ExportLayerTier[] = [
  "behind-tree",
  "above-tree",
  "above-text",
];

export function createLayerId(): string {
  return `layer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sortExportLayers(
  layers: ExportDecorationLayer[],
): ExportDecorationLayer[] {
  const tierRank: Record<ExportLayerTier, number> = {
    "behind-tree": 0,
    "above-tree": 1,
    "above-text": 2,
  };
  return [...layers].sort((a, b) => {
    const tierDiff = tierRank[a.tier] - tierRank[b.tier];
    if (tierDiff !== 0) return tierDiff;
    return a.order - b.order;
  });
}

export function nextLayerOrder(
  layers: ExportDecorationLayer[],
  tier: ExportLayerTier,
): number {
  const max = layers
    .filter((layer) => layer.tier === tier)
    .reduce((acc, layer) => Math.max(acc, layer.order), -1);
  return max + 1;
}

export function layerBounds(layer: ExportDecorationLayer) {
  return {
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
  };
}

export function bringLayerForward(
  layers: ExportDecorationLayer[],
  id: string,
): ExportDecorationLayer[] {
  const index = layers.findIndex((layer) => layer.id === id);
  if (index < 0) return layers;
  const current = layers[index];
  const tierIndex = EXPORT_LAYER_TIERS.indexOf(current.tier);
  if (tierIndex < EXPORT_LAYER_TIERS.length - 1) {
    const nextTier = EXPORT_LAYER_TIERS[tierIndex + 1];
    return layers.map((layer) =>
      layer.id === id
        ? { ...layer, tier: nextTier, order: nextLayerOrder(layers, nextTier) }
        : layer,
    );
  }
  return layers.map((layer) =>
    layer.id === id ? { ...layer, order: layer.order + 1 } : layer,
  );
}

export function sendLayerBackward(
  layers: ExportDecorationLayer[],
  id: string,
): ExportDecorationLayer[] {
  const index = layers.findIndex((layer) => layer.id === id);
  if (index < 0) return layers;
  const current = layers[index];
  const tierIndex = EXPORT_LAYER_TIERS.indexOf(current.tier);
  if (tierIndex > 0) {
    const prevTier = EXPORT_LAYER_TIERS[tierIndex - 1];
    return layers.map((layer) =>
      layer.id === id
        ? { ...layer, tier: prevTier, order: nextLayerOrder(layers, prevTier) }
        : layer,
    );
  }
  return layers.map((layer) =>
    layer.id === id ? { ...layer, order: Math.max(0, layer.order - 1) } : layer,
  );
}
