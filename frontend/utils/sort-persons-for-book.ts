import type { Person } from "@/components/types/family-tree-types";

export function sortPersonsForBook(persons: Person[]): Person[] {
  return [...persons].sort((a, b) => {
    const branchA = a.branch ?? 1;
    const branchB = b.branch ?? 1;
    if (branchA !== branchB) return branchA - branchB;

    const genA = a.generation ?? Number.MAX_SAFE_INTEGER;
    const genB = b.generation ?? Number.MAX_SAFE_INTEGER;
    if (genA !== genB) return genA - genB;

    return a.fullName.localeCompare(b.fullName, "vi");
  });
}
