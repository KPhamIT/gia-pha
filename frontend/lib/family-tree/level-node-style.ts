import type { Person } from "@/components/types/family-tree-types";
import {
  patchLevelAppearance,
  parseAppearanceMap,
  resolvePersonNodeAppearance,
  type NodeAppearanceConfig,
  type ResolvedNodeAppearance,
} from "@/lib/family-tree/node-appearance";

export type ResolvedNodeStyle = ResolvedNodeAppearance;

export {
  DEFAULT_NODE_APPEARANCE,
  resolvePersonNodeAppearance,
  resolveLevelNodeAppearance,
} from "@/lib/family-tree/node-appearance";

export const DEFAULT_NODE_FONT_SIZE = 18;
export const DEFAULT_NODE_FONT_WEIGHT = "semibold" as const;
export const DEFAULT_NODE_TEXT_DIRECTION = "vertical" as const;

export function resolveNodeStyle(
  generation: number | undefined | null,
  config: NodeAppearanceConfig,
  personId = 0,
): ResolvedNodeStyle {
  return resolvePersonNodeAppearance(personId, generation, config);
}

export function collectTreeGenerations(persons: Person[]): number[] {
  const gens = new Set<number>();
  for (const person of persons) {
    if (person.generation == null) continue;
    const g = Number(person.generation);
    if (!Number.isNaN(g) && g >= 1) gens.add(g);
  }
  if (gens.size === 0) return [1, 2, 3, 4, 5];
  const sorted = Array.from(gens).sort((a, b) => a - b);
  const max = sorted[sorted.length - 1]!;
  const min = sorted[0]!;
  const result: number[] = [];
  for (let g = min; g <= Math.max(max, min + 2); g += 1) result.push(g);
  return result;
}

export const parseLevelStyles = parseAppearanceMap;

export const patchLevelStyle = patchLevelAppearance;

export function clearLevelStyle(
  config: import("@/components/types/family-tree-types").LayoutConfig,
  generation: number,
) {
  const key = String(generation);
  if (!config.levelStyles?.[key]) return config;
  const next = { ...config.levelStyles };
  delete next[key];
  return {
    ...config,
    levelStyles: Object.keys(next).length > 0 ? next : undefined,
  };
}
