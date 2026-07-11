import type {
  Person,
  Relationship,
} from "@/components/types/family-tree-types";
import type { Coordinates } from "./types";

export const SPOUSE_GAP = 16;

export type SpousePair = {
  /** Person on the left (usually husband / Nam). */
  leftId: number;
  /** Person on the right (usually wife / Nữ). */
  rightId: number;
};

export type SpousePlacement = {
  anchorId: number;
  satelliteId: number;
  /** Where the satellite sits relative to the anchor. */
  side: "left" | "right";
};

function isMale(person: Person | undefined): boolean {
  return person?.gender?.trim() === "Nam";
}

function isFemale(person: Person | undefined): boolean {
  return person?.gender?.trim() === "Nữ";
}

/** Resolve SPOUSE links into left/right pairs for horizontal placement. */
export function buildSpousePairs(
  relationships: Relationship[],
  personById: Map<number, Person>,
): SpousePair[] {
  const pairs: SpousePair[] = [];
  const seen = new Set<string>();

  for (const rel of relationships) {
    if (rel.type !== "SPOUSE") continue;
    const a = rel.fromId;
    const b = rel.toId;
    if (a === b) continue;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const personA = personById.get(a);
    const personB = personById.get(b);
    if (isMale(personA) && !isMale(personB)) {
      pairs.push({ leftId: a, rightId: b });
    } else if (isMale(personB) && !isMale(personA)) {
      pairs.push({ leftId: b, rightId: a });
    } else if (isFemale(personA) && !isFemale(personB)) {
      pairs.push({ leftId: b, rightId: a });
    } else if (isFemale(personB) && !isFemale(personA)) {
      pairs.push({ leftId: a, rightId: b });
    } else {
      pairs.push({ leftId: a, rightId: b });
    }
  }

  return pairs;
}

/**
 * Prefer keeping bloodline members in tidy-tree; the other partner becomes a
 * satellite beside them (wife right of husband when husband is in the line).
 */
export function buildSpousePlacements(
  pairs: SpousePair[],
  bloodlineIds: Set<number>,
  preferredAnchorIds: Set<number> = new Set(),
): SpousePlacement[] {
  return pairs.map(({ leftId, rightId }) => {
    const leftIn = bloodlineIds.has(leftId);
    const rightIn = bloodlineIds.has(rightId);
    if (!leftIn && rightIn) {
      return { anchorId: rightId, satelliteId: leftId, side: "left" };
    }
    if (leftIn && !rightIn) {
      return { anchorId: leftId, satelliteId: rightId, side: "right" };
    }
    if (
      preferredAnchorIds.has(rightId) &&
      !preferredAnchorIds.has(leftId)
    ) {
      return { anchorId: rightId, satelliteId: leftId, side: "left" };
    }
    return { anchorId: leftId, satelliteId: rightId, side: "right" };
  });
}

export function spouseSatelliteIds(
  placements: SpousePlacement[],
): Set<number> {
  return new Set(placements.map((p) => p.satelliteId));
}

/** Extra width on each side of an anchor for spouse satellites. */
export type SpouseSideExtras = { left: number; right: number };

export function buildSpouseSideExtras(
  placements: SpousePlacement[],
  nodeWidthFor: (personId: number) => number,
  spouseGap = SPOUSE_GAP,
): Map<number, SpouseSideExtras> {
  const byAnchor = new Map<number, SpousePlacement[]>();
  for (const placement of placements) {
    const list = byAnchor.get(placement.anchorId) ?? [];
    list.push(placement);
    byAnchor.set(placement.anchorId, list);
  }

  const extras = new Map<number, SpouseSideExtras>();
  for (const [anchorId, group] of byAnchor) {
    let left = 0;
    let right = 0;
    for (const { satelliteId, side } of group) {
      const w = nodeWidthFor(satelliteId) + spouseGap;
      if (side === "left") left += w;
      else right += w;
    }
    extras.set(anchorId, { left, right });
  }
  return extras;
}

/** Full horizontal span of a person plus spouse satellites. */
export function coupleSpanWidth(
  personId: number,
  nodeWidthFor: (personId: number) => number,
  spouseExtras: Map<number, SpouseSideExtras>,
): number {
  const extras = spouseExtras.get(personId) ?? { left: 0, right: 0 };
  return extras.left + nodeWidthFor(personId) + extras.right;
}

/**
 * Subtree width when the person is centred over a children block of `childrenSpan`.
 * Ensures spouses beside the parent do not spill into the next sibling's slot.
 */
export function widthForCenteredCouple(
  childrenSpan: number,
  personId: number,
  nodeWidthFor: (personId: number) => number,
  spouseExtras: Map<number, SpouseSideExtras>,
): number {
  const nodeW = nodeWidthFor(personId);
  const extras = spouseExtras.get(personId) ?? { left: 0, right: 0 };
  const coupleOnly = extras.left + nodeW + extras.right;
  if (childrenSpan <= 0) return coupleOnly;
  const halfKids = childrenSpan / 2;
  const halfNode = nodeW / 2;
  return Math.max(
    childrenSpan,
    coupleOnly,
    halfKids + halfNode + extras.right,
    halfKids + halfNode + extras.left,
  );
}

/**
 * Place satellites beside their anchors (same row).
 * Multiple satellites on the same side stack outward.
 */
export function placeSpousesBesidePartners(
  coordinates: Coordinates,
  placements: SpousePlacement[],
  nodeWidthFor: (personId: number) => number,
  spouseGap = SPOUSE_GAP,
): void {
  const byAnchor = new Map<number, SpousePlacement[]>();
  for (const placement of placements) {
    const list = byAnchor.get(placement.anchorId) ?? [];
    list.push(placement);
    byAnchor.set(placement.anchorId, list);
  }

  for (const [anchorId, group] of byAnchor) {
    const anchor = coordinates.get(anchorId);
    if (!anchor) continue;
    const anchorWidth = nodeWidthFor(anchorId);

    let nextRight = anchor.x + anchorWidth + spouseGap;
    for (const { satelliteId } of group.filter((p) => p.side === "right")) {
      coordinates.set(satelliteId, { x: nextRight, y: anchor.y });
      nextRight += nodeWidthFor(satelliteId) + spouseGap;
    }

    let nextLeft = anchor.x;
    for (const { satelliteId } of group.filter((p) => p.side === "left")) {
      const width = nodeWidthFor(satelliteId);
      nextLeft -= spouseGap + width;
      coordinates.set(satelliteId, { x: nextLeft, y: anchor.y });
    }
  }
}
