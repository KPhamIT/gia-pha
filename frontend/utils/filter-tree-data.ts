import type { FamilyTreeData } from "@/components/types/family-tree-types";
import { getRootPerson } from "@/utils/family-tree-utils";

export type TreeFilter = {
  /** A specific branch (1/2/3) or 'all' to show every branch. */
  branch: number | "all";
  /** Show people up to this generation, or 'all' for no limit. */
  maxGeneration: number | "all";
};

/**
 * Narrows the tree to the chosen branch and generation depth. The root is
 * always kept as an anchor so each branch stays connected to the common
 * ancestor, and edges are pruned to the surviving people.
 */
export function filterTreeData(
  treeData: FamilyTreeData,
  { branch, maxGeneration }: TreeFilter,
): FamilyTreeData {
  const rootId = getRootPerson(treeData.persons)?.id ?? treeData.root.id;
  const withinGeneration = (g?: number | null) =>
    maxGeneration === "all" || g == null || g <= maxGeneration;
  const matchesBranch = (b?: number | null) => branch === "all" || b === branch;

  const persons = treeData.persons.filter(
    (person) =>
      person.id === rootId ||
      (matchesBranch(person.branch) && withinGeneration(person.generation)),
  );
  const keptIds = new Set(persons.map((person) => person.id));
  const relationships = treeData.relationships.filter(
    (rel) => keptIds.has(rel.fromId) && keptIds.has(rel.toId),
  );

  return { ...treeData, persons, relationships };
}
