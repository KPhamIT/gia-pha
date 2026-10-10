import { genderKind } from './person-excel.values.js';

type Rel = { id: number; fromId: number; toId: number; type: string };
type PersonLite = { id: number; gender: string | null };

export type ParentLink = {
  parentId: number;
  /** Các dòng Relationship nối cặp cha/mẹ–con này (CHILD và/hoặc FATHER/MOTHER). */
  relationshipIds: number[];
  role: 'father' | 'mother' | null;
};

export type FamilyIndex = {
  parentsOf: Map<number, ParentLink[]>;
  spousesOf: Map<number, Set<number>>;
};

/**
 * Gom quan hệ cha mẹ – con và vợ chồng. Giống `extractPersonRelationships`
 * ở frontend: FATHER/MOTHER lưu cha→con, CHILD lưu con→cha (vai trò theo giới tính).
 */
export function buildFamilyIndex(
  persons: PersonLite[],
  relationships: Rel[],
): FamilyIndex {
  const genderById = new Map(persons.map((p) => [p.id, genderKind(p.gender)]));
  const parentsOf = new Map<number, ParentLink[]>();
  const spousesOf = new Map<number, Set<number>>();

  const addParent = (
    childId: number,
    parentId: number,
    relId: number,
    role: ParentLink['role'],
  ) => {
    const links = parentsOf.get(childId) ?? [];
    let link = links.find((l) => l.parentId === parentId);
    if (!link) {
      link = { parentId, relationshipIds: [], role: null };
      links.push(link);
      parentsOf.set(childId, links);
    }
    link.relationshipIds.push(relId);
    if (role) link.role = role;
  };

  const addSpouse = (a: number, b: number) => {
    if (!spousesOf.has(a)) spousesOf.set(a, new Set());
    spousesOf.get(a)!.add(b);
  };

  for (const rel of relationships) {
    if (rel.fromId === rel.toId) continue;
    if (rel.type === 'FATHER')
      addParent(rel.toId, rel.fromId, rel.id, 'father');
    else if (rel.type === 'MOTHER')
      addParent(rel.toId, rel.fromId, rel.id, 'mother');
    else if (rel.type === 'CHILD')
      addParent(rel.fromId, rel.toId, rel.id, null);
    else if (rel.type === 'SPOUSE') {
      addSpouse(rel.fromId, rel.toId);
      addSpouse(rel.toId, rel.fromId);
    }
  }

  // CHILD không ghi vai trò: suy ra từ giới tính, rồi lấp chỗ còn trống.
  for (const links of parentsOf.values()) {
    for (const link of links) {
      if (link.role) continue;
      const kind = genderById.get(link.parentId);
      const taken = (role: 'father' | 'mother') =>
        links.some((l) => l.role === role);
      if (kind === 'male' && !taken('father')) link.role = 'father';
      else if (kind === 'female' && !taken('mother')) link.role = 'mother';
      else if (!taken('father')) link.role = 'father';
      else if (!taken('mother')) link.role = 'mother';
    }
  }

  return { parentsOf, spousesOf };
}

export function findParent(
  index: FamilyIndex,
  childId: number,
  role: 'father' | 'mother',
): ParentLink | undefined {
  return index.parentsOf.get(childId)?.find((l) => l.role === role);
}
