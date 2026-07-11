import type { Coordinates } from "./types";
import type { SpouseSideExtras } from "./spouse-layout";
import { coupleSpanWidth, widthForCenteredCouple } from "./spouse-layout";
import { buildYMap, computeSubtreeWidth, shiftSubtree } from "./metrics";

/**
 * Tidy-tree placement: each subtree is laid out left-to-right and centred over
 * its children. Disconnected people are appended to the right of the main tree.
 * `skipPersonIds` are placed later (e.g. spouses beside partners).
 * `spouseExtras` reserves horizontal room so siblings do not cover spouses.
 */
export function computeCoordinates(
  generationMap: Map<number, number>,
  childMap: Map<number, number[]>,
  relevantPersonIds: Set<number>,
  rootId: number,
  horizontalGap: number,
  verticalStep: number,
  nodeWidthFor: (personId: number) => number,
  skipPersonIds: Set<number> = new Set(),
  spouseExtras: Map<number, SpouseSideExtras> = new Map(),
) {
  const yMap = buildYMap(generationMap, verticalStep);
  const coordinates: Coordinates = new Map();
  const assigned = new Set<number>();
  const subtreeWidthMap = new Map<number, number>();
  const layoutComputing = new Set<number>();
  const widthCtx = {
    childMap,
    relevantPersonIds,
    nodeWidthFor,
    horizontalGap,
    widthMemo: subtreeWidthMap,
    computing: new Set<number>(),
    skipPersonIds,
    spouseExtras,
  };

  const layoutNode = (personId: number, left: number): number => {
    const selfWidth = coupleSpanWidth(personId, nodeWidthFor, spouseExtras);
    const extras = spouseExtras.get(personId) ?? { left: 0, right: 0 };
    if (assigned.has(personId)) {
      const width = subtreeWidthMap.get(personId) ?? selfWidth;
      const oldX = coordinates.get(personId)?.x ?? 0;
      const desiredX = left + extras.left;
      if (oldX !== desiredX) {
        shiftSubtree(
          coordinates,
          childMap,
          relevantPersonIds,
          personId,
          desiredX - oldX,
        );
      }
      return width;
    }
    if (layoutComputing.has(personId)) {
      return subtreeWidthMap.get(personId) ?? selfWidth;
    }

    const children = Array.from(new Set(childMap.get(personId) ?? []))
      .filter(
        (childId) =>
          relevantPersonIds.has(childId) && !skipPersonIds.has(childId),
      )
      .sort((a, b) => a - b);
    layoutComputing.add(personId);
    const y = yMap.get(personId) ?? 0;
    if (children.length === 0) {
      coordinates.set(personId, { x: left + extras.left, y });
      assigned.add(personId);
      subtreeWidthMap.set(personId, selfWidth);
      layoutComputing.delete(personId);
      return selfWidth;
    }

    let currentLeft = left;
    const childXPositions: number[] = [];
    let childrenSpan = 0;
    const childWidths = children.map((childId) =>
      computeSubtreeWidth(childId, widthCtx),
    );

    for (let i = 0; i < children.length; i++) {
      const childId = children[i];
      const plannedWidth = childWidths[i];
      layoutNode(childId, currentLeft);
      const childExtras = spouseExtras.get(childId) ?? { left: 0, right: 0 };
      const childX = coordinates.get(childId)?.x ?? currentLeft;
      childXPositions.push(childX - childExtras.left);
      currentLeft += plannedWidth + horizontalGap;
      childrenSpan += plannedWidth;
    }

    if (children.length > 1) {
      childrenSpan += horizontalGap * (children.length - 1);
    }

    const minChildX = Math.min(...childXPositions);
    const maxChildX = Math.max(
      ...children.map((childId) => {
        const childExtras = spouseExtras.get(childId) ?? { left: 0, right: 0 };
        const childX = coordinates.get(childId)?.x ?? 0;
        return childX + nodeWidthFor(childId) + childExtras.right;
      }),
    );
    const nodeW = nodeWidthFor(personId);
    let x = minChildX + (maxChildX - minChildX) / 2 - nodeW / 2;
    if (x - extras.left < left) {
      x = left + extras.left;
    }
    coordinates.set(personId, { x, y });
    assigned.add(personId);
    const width = widthForCenteredCouple(
      childrenSpan,
      personId,
      nodeWidthFor,
      spouseExtras,
    );
    subtreeWidthMap.set(personId, width);
    layoutComputing.delete(personId);
    return width;
  };

  const totalWidth = layoutNode(rootId, 0);
  let nextLeft = totalWidth + horizontalGap;

  Array.from(generationMap.keys()).forEach((personId) => {
    if (assigned.has(personId) || skipPersonIds.has(personId)) return;
    const width = layoutNode(personId, nextLeft);
    nextLeft += width + horizontalGap;
  });

  return coordinates;
}
