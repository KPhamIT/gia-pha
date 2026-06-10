export type Person = {
  id: number;
  fullName: string;
  gender?: string | null;
  birthDate?: string | null;
  avatar?: string | null;
  generation?: number | null;
  branch?: number | null;
  userId?: number | null;
  organizationId?: number | null;
};

export type RelationshipType = 'FATHER' | 'MOTHER' | 'SPOUSE' | 'CHILD';

export type Relationship = {
  id: number;
  fromId: number;
  toId: number;
  type: RelationshipType;
  from: Person;
  to: Person;
};

export type FamilyTreeData = {
  root: Person;
  persons: Person[];
  relationships: Relationship[];
};

export type AuthResponse = {
  accessToken: string;
  user: { id: number; email: string | null; provider: string };
  person: Person;
};

export type ThemeMode = 'light' | 'dark';

export type LayoutConfig = {
  horizontalGap: number;
  verticalStep: number;
  nodeBgColor: string;
  nodeTextColor: string;
};

export type CreateChildInput = {
  fullName: string;
  gender?: string;
  birthDate?: string;
  avatar?: string;
  generation?: number | null;
  branch?: number | null;
};

export type CreateChildFormInput = {
  fullName: string;
  gender: string;
  birthDate: string;
  avatar: string;
  generation?: number;
  branch?: string;
  parentId: number;
};

export type FamilyTreeEdgeData = {
  relationshipId?: number;
  onRelationshipRemoved?: (relationshipId: number) => void;
};
