import type { Coordinates } from "./types";

/** Move a person and all descendants horizontally by `dx`. */
export function shiftSubtree(
  coordinates: Coordinates,
  childMap: Map<number, number[]>,
  relevantPersonIds: Set<number>,
  personId: number,
  dx: number,
) {
  const pos = coordinates.get(personId);
  if (pos) coordinates.set(personId, { x: pos.x + dx, y: pos.y });
  const children = (childMap.get(personId) ?? []).filter((id) =>
    relevantPersonIds.has(id),
  );
  for (const child of children)
    shiftSubtree(coordinates, childMap, relevantPersonIds, child, dx);
}

/** Vertical position per person: generation index times the row step. */
export function buildYMap(
  generationMap: Map<number, number>,
  verticalStep: number,
) {
  const sortedGenerations = Array.from(generationMap.values()).sort(
    (a, b) => a - b,
  );
  const minGeneration = sortedGenerations[0] ?? 0;
  const yMap = new Map<number, number>();

  generationMap.forEach((generation, personId) => {
    yMap.set(personId, (generation - minGeneration) * verticalStep);
  });

  return yMap;
}

export type SubtreeWidthCtx = {
  childMap: Map<number, number[]>;
  relevantPersonIds: Set<number>;
  nodeWidth: number;
  horizontalGap: number;
  /** Memoised result per person (shared with the placement pass). */
  widthMemo: Map<number, number>;
  /** Guards against cycles during recursion. */
  computing: Set<number>;
};

/** Horizontal space a person's subtree needs, memoised and cycle-safe. */
export function computeSubtreeWidth(
  personId: number,
  ctx: SubtreeWidthCtx,
): number {
  const {
    childMap,
    relevantPersonIds,
    nodeWidth,
    horizontalGap,
    widthMemo,
    computing,
  } = ctx;
  if (widthMemo.has(personId)) return widthMemo.get(personId)!;

  if (computing.has(personId)) {
    widthMemo.set(personId, nodeWidth);
    return nodeWidth;
  }

  const children = Array.from(new Set(childMap.get(personId) ?? []))
    .filter((id) => relevantPersonIds.has(id))
    .sort((a, b) => a - b);
  computing.add(personId);
  if (children.length === 0) {
    widthMemo.set(personId, nodeWidth);
    computing.delete(personId);
    return nodeWidth;
  }

  let total = 0;
  for (const child of children) {
    total += computeSubtreeWidth(child, ctx);
  }
  if (children.length > 1) total += horizontalGap * (children.length - 1);
  const width = Math.max(total, nodeWidth);
  widthMemo.set(personId, width);
  computing.delete(personId);
  return width;
}
