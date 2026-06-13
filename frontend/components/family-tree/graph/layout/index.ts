import type { FamilyTreeData } from '@/components/types/family-tree-types';
import { buildRelationMaps, getEffectiveRelationships, getTreeEdges, normalizeParentChildEdges } from './edges';
import { buildGenerationMap, computeLevels } from './levels';
import { computeCoordinates } from './positions';
import { buildFlowEdges, buildFlowNodes } from './flow';

export type FamilyTreeLayoutConfig = {
  horizontalGap?: number;
  verticalStep?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  nodeBgColor?: string;
  nodeTextColor?: string;
};

export const NODE_WIDTH = 90;
export const NODE_HEIGHT = 120;
const DEFAULT_HORIZONTAL_GAP = 20;
const DEFAULT_VERTICAL_STEP = 200;

/** Build positioned react-flow nodes + edges from raw family tree data. */
export function buildFamilyTreeGraph(treeData: FamilyTreeData, config: FamilyTreeLayoutConfig = {}) {
  const { root, persons, relationships } = treeData;
  const relevantPersonIds = new Set(persons.map((person) => person.id));
  const effectiveRelationships = getEffectiveRelationships(relationships);
  const treeEdges = getTreeEdges(effectiveRelationships);
  const normalizedEdges = normalizeParentChildEdges(treeEdges);
  const { childMap, parentMap } = buildRelationMaps(normalizedEdges);
  const levels = computeLevels(root.id, childMap, parentMap, relevantPersonIds);
  const generationMap = buildGenerationMap(persons, levels);
  const horizontalGap = config.horizontalGap ?? DEFAULT_HORIZONTAL_GAP;
  const verticalStep = config.verticalStep ?? DEFAULT_VERTICAL_STEP;
  const nodeWidth = config.nodeWidth ?? NODE_WIDTH;
  const nodeHeight = config.nodeHeight ?? NODE_HEIGHT;
  const coordinates = computeCoordinates(
    generationMap,
    childMap,
    relevantPersonIds,
    root.id,
    horizontalGap,
    verticalStep,
    nodeWidth,
  );
  const nodes = buildFlowNodes(persons, root.id, coordinates, config.nodeBgColor, config.nodeTextColor, nodeWidth, nodeHeight);
  const edges = buildFlowEdges(effectiveRelationships);

  return { nodes, edges };
}
