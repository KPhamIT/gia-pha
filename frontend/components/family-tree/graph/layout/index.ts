import type {

  FamilyTreeData,

  LevelNodeStyle,

  NodeFontWeight,

  NodeTextCase,

  NodeTextDirection,

} from "@/components/types/family-tree-types";

import { resolvePersonNodeAppearance } from "@/lib/family-tree/node-appearance";

import { getRootPerson } from "@/utils/family-tree-utils";

import {

  buildRelationMaps,

  getEffectiveRelationships,

  getTreeEdges,

  normalizeParentChildEdges,

} from "./edges";

import { buildGenerationMap, computeLevels } from "./levels";

import { computeCoordinates } from "./positions";

import { buildFlowEdges, buildFlowNodes } from "./flow";

import {

  buildSpousePairs,

  buildSpousePlacements,

  buildSpouseSideExtras,

  placeSpousesBesidePartners,

  spouseSatelliteIds,

} from "./spouse-layout";

import { NODE_HEIGHT, NODE_WIDTH } from "./constants";



export { NODE_HEIGHT, NODE_WIDTH } from "./constants";

export { SPOUSE_GAP } from "./spouse-layout";



export const DEFAULT_EDGE_COLOR = "#94a3b8";

export const SELECTED_EDGE_COLOR = "#d97706";



export type FamilyTreeLayoutConfig = {

  horizontalGap?: number;

  verticalStep?: number;

  edgeColor?: string;

  /** Hiện vợ/chồng cạnh chồng/vợ. Mặc định true. */

  showSpouses?: boolean;

  nodeWidth?: number;

  nodeHeight?: number;

  nodeBgColor?: string;

  nodeTextColor?: string;

  nodeFontSize?: number;

  nodeFontWeight?: NodeFontWeight;

  nodeTextDirection?: NodeTextDirection;

  nodeTextCase?: NodeTextCase;

  levelStyles?: Record<string, LevelNodeStyle>;

  nodeStyles?: Record<string, LevelNodeStyle>;

};



const DEFAULT_HORIZONTAL_GAP = 20;

const DEFAULT_VERTICAL_STEP = 200;



function bloodlinePersonIds(

  childMap: Map<number, number[]>,

  parentMap: Map<number, number[]>,

): Set<number> {

  const ids = new Set<number>();

  for (const [parentId, children] of childMap) {

    ids.add(parentId);

    for (const childId of children) ids.add(childId);

  }

  for (const [childId, parents] of parentMap) {

    ids.add(childId);

    for (const parentId of parents) ids.add(parentId);

  }

  return ids;

}



/** Married-in spouses with no parent/child link on this tree. */

function marriedInOnlyIds(

  placements: ReturnType<typeof buildSpousePlacements>,

  bloodline: Set<number>,

): Set<number> {

  return new Set(

    placements

      .map((p) => p.satelliteId)

      .filter((id) => !bloodline.has(id)),

  );

}



/** Build positioned react-flow nodes + edges from raw family tree data. */

export function buildFamilyTreeGraph(

  treeData: FamilyTreeData,

  config: FamilyTreeLayoutConfig = {},

) {

  const { root, persons, relationships } = treeData;

  const layoutRootId = getRootPerson(persons)?.id ?? root.id;

  const personById = new Map(persons.map((p) => [p.id, p]));

  const effectiveRelationships = getEffectiveRelationships(relationships);

  const treeEdges = getTreeEdges(effectiveRelationships);

  const normalizedEdges = normalizeParentChildEdges(treeEdges);

  const { childMap, parentMap } = buildRelationMaps(normalizedEdges);

  const bloodline = bloodlinePersonIds(childMap, parentMap);

  const spousePairs = buildSpousePairs(effectiveRelationships, personById);

  const spousePlacements = buildSpousePlacements(

    spousePairs,

    bloodline,

    new Set([layoutRootId]),

  );

  const showSpouses = config.showSpouses !== false;

  const skipSpouseIds = showSpouses

    ? spouseSatelliteIds(spousePlacements)

    : new Set<number>();

  const hiddenIds = showSpouses

    ? new Set<number>()

    : marriedInOnlyIds(spousePlacements, bloodline);

  const layoutPersons = persons.filter((p) => !hiddenIds.has(p.id));

  const relevantPersonIds = new Set(layoutPersons.map((p) => p.id));

  const layoutRelationships = effectiveRelationships.filter(

    (rel) =>

      !hiddenIds.has(rel.fromId) &&

      !hiddenIds.has(rel.toId) &&

      (showSpouses || rel.type !== "SPOUSE"),

  );

  const visibleSpousePairs = showSpouses ? spousePairs : [];

  const visiblePlacements = showSpouses ? spousePlacements : [];



  const levels = computeLevels(

    layoutRootId,

    childMap,

    parentMap,

    relevantPersonIds,

  );

  const generationMap = buildGenerationMap(layoutPersons, levels);

  const horizontalGap = config.horizontalGap ?? DEFAULT_HORIZONTAL_GAP;

  const verticalStep = config.verticalStep ?? DEFAULT_VERTICAL_STEP;

  const nodeWidthFor = (personId: number) =>

    resolvePersonNodeAppearance(

      personId,

      generationMap.get(personId),

      config,

    ).nodeWidth;

  const spouseExtras = showSpouses

    ? buildSpouseSideExtras(visiblePlacements, nodeWidthFor)

    : new Map();

  const coordinates = computeCoordinates(

    generationMap,

    childMap,

    relevantPersonIds,

    layoutRootId,

    horizontalGap,

    verticalStep,

    nodeWidthFor,

    skipSpouseIds,

    spouseExtras,

  );

  if (showSpouses) {

    placeSpousesBesidePartners(coordinates, visiblePlacements, nodeWidthFor);

  }

  const nodes = buildFlowNodes(
    layoutPersons,
    layoutRootId,
    coordinates,
    generationMap,
    config,
    visibleSpousePairs,
    childMap,
    parentMap,
  );
  const edges = buildFlowEdges(layoutRelationships, visibleSpousePairs);

  return { nodes, edges };
}


