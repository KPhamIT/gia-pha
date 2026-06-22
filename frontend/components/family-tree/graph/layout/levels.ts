import type { Person } from "@/components/types/family-tree-types";

/** BFS from the root assigning each relevant person a signed generation level. */
export function computeLevels(
  rootId: number,
  childMap: Map<number, number[]>,
  parentMap: Map<number, number[]>,
  relevantPersonIds: Set<number>,
) {
  const levels = new Map<number, number>();
  const levelQueue = [rootId];
  levels.set(rootId, 0);

  while (levelQueue.length > 0) {
    const current = levelQueue.shift()!;
    const currentLevel = levels.get(current) ?? 0;

    const children = childMap.get(current) ?? [];
    for (const childId of children) {
      if (relevantPersonIds.has(childId) && !levels.has(childId)) {
        levels.set(childId, currentLevel + 1);
        levelQueue.push(childId);
      }
    }

    const parents = parentMap.get(current) ?? [];
    for (const parentId of parents) {
      if (relevantPersonIds.has(parentId) && !levels.has(parentId)) {
        levels.set(parentId, currentLevel - 1);
        levelQueue.push(parentId);
      }
    }
  }

  return levels;
}

/** Prefer each person's explicit `generation`, falling back to the BFS level. */
export function buildGenerationMap(
  persons: Person[],
  levels: Map<number, number>,
) {
  const generationMap = new Map<number, number>();

  persons.forEach((person) => {
    if (person.generation != null) {
      const generation = Number(person.generation);
      if (!Number.isNaN(generation)) {
        generationMap.set(person.id, generation);
      }
    }
  });

  persons.forEach((person) => {
    if (!generationMap.has(person.id)) {
      generationMap.set(person.id, levels.get(person.id) ?? 0);
    }
  });

  return generationMap;
}
