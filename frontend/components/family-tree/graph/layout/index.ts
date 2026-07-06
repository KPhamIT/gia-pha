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
import { NODE_HEIGHT, NODE_WIDTH } from "./constants";

export { NODE_HEIGHT, NODE_WIDTH } from "./constants";

export const DEFAULT_EDGE_COLOR = "#94a3b8";
export const SELECTED_EDGE_COLOR = "#d97706";

export type FamilyTreeLayoutConfig = {
  horizontalGap?: number;
  verticalStep?: number;
  edgeColor?: string;
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

/** Build positioned react-flow nodes + edges from raw family tree data. */
export function buildFamilyTreeGraph(
  treeData: FamilyTreeData,
  config: FamilyTreeLayoutConfig = {},
) {
  const { root, persons, relationships } = treeData;
  const layoutRootId = getRootPerson(persons)?.id ?? root.id;
  const relevantPersonIds = new Set(persons.map((person) => person.id));
  const effectiveRelationships = getEffectiveRelationships(relationships);
  const treeEdges = getTreeEdges(effectiveRelationships);
  const normalizedEdges = normalizeParentChildEdges(treeEdges);
  const { childMap, parentMap } = buildRelationMaps(normalizedEdges);
  const levels = computeLevels(
    layoutRootId,
    childMap,
    parentMap,
    relevantPersonIds,
  );
  const generationMap = buildGenerationMap(persons, levels);
  const horizontalGap = config.horizontalGap ?? DEFAULT_HORIZONTAL_GAP;
  const verticalStep = config.verticalStep ?? DEFAULT_VERTICAL_STEP;
  const nodeWidthFor = (personId: number) =>
    resolvePersonNodeAppearance(
      personId,
      generationMap.get(personId),
      config,
    ).nodeWidth;
  const coordinates = computeCoordinates(
    generationMap,
    childMap,
    relevantPersonIds,
    layoutRootId,
    horizontalGap,
    verticalStep,
    nodeWidthFor,
  );
  const nodes = buildFlowNodes(
    persons,
    layoutRootId,
    coordinates,
    generationMap,
    config,
  );
  const edges = buildFlowEdges(effectiveRelationships);

  return { nodes, edges };
}
