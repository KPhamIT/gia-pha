import type { Coordinates } from './types';
import { buildYMap, computeSubtreeWidth, shiftSubtree } from './metrics';

/**
 * Tidy-tree placement: each subtree is laid out left-to-right and centred over
 * its children. Disconnected people are appended to the right of the main tree.
 */
export function computeCoordinates(
  generationMap: Map<number, number>,
  childMap: Map<number, number[]>,
  relevantPersonIds: Set<number>,
  rootId: number,
  horizontalGap: number,
  verticalStep: number,
  nodeWidth: number,
) {
  const yMap = buildYMap(generationMap, verticalStep);
  const coordinates: Coordinates = new Map();
  const assigned = new Set<number>();
  const subtreeWidthMap = new Map<number, number>();
  const layoutComputing = new Set<number>();
  const widthCtx = {
    childMap,
    relevantPersonIds,
    nodeWidth,
    horizontalGap,
    widthMemo: subtreeWidthMap,
    computing: new Set<number>(),
  };

  const layoutNode = (personId: number, left: number): number => {
    if (assigned.has(personId)) {
      const width = subtreeWidthMap.get(personId) ?? nodeWidth;
      const oldX = coordinates.get(personId)?.x ?? 0;
      if (oldX !== left) {
        shiftSubtree(coordinates, childMap, relevantPersonIds, personId, left - oldX);
      }
      return width;
    }
    if (layoutComputing.has(personId)) {
      return subtreeWidthMap.get(personId) ?? nodeWidth;
    }

    const children = Array.from(new Set(childMap.get(personId) ?? []))
      .filter((childId) => relevantPersonIds.has(childId))
      .sort((a, b) => a - b);
    layoutComputing.add(personId);
    const y = yMap.get(personId) ?? 0;
    if (children.length === 0) {
      coordinates.set(personId, { x: left, y });
      assigned.add(personId);
      subtreeWidthMap.set(personId, nodeWidth);
      layoutComputing.delete(personId);
      return nodeWidth;
    }

    let currentLeft = left;
    const childXPositions: number[] = [];
    let subtreeWidth = 0;
    const childWidths = children.map((childId) => computeSubtreeWidth(childId, widthCtx));

    for (let i = 0; i < children.length; i++) {
      const childId = children[i];
      const plannedWidth = childWidths[i];
      layoutNode(childId, currentLeft);
      const childX = coordinates.get(childId)?.x ?? currentLeft;

      childXPositions.push(childX);
      currentLeft += plannedWidth + horizontalGap;
      subtreeWidth += plannedWidth;
    }

    if (children.length > 1) {
      subtreeWidth += horizontalGap * (children.length - 1);
    }

    const minChildX = Math.min(...childXPositions);
    const maxChildX = Math.max(...childXPositions) + nodeWidth;
    const x = minChildX + (maxChildX - minChildX) / 2 - nodeWidth / 2;
    coordinates.set(personId, { x, y });
    assigned.add(personId);
    const width = Math.max(subtreeWidth, nodeWidth);
    subtreeWidthMap.set(personId, width);
    layoutComputing.delete(personId);
    return width;
  };

  const totalWidth = layoutNode(rootId, 0);
  let nextLeft = totalWidth + horizontalGap;

  Array.from(generationMap.keys()).forEach((personId) => {
    if (!assigned.has(personId)) {
      const width = layoutNode(personId, nextLeft);
      nextLeft += width + horizontalGap;
    }
  });

  return coordinates;
}
