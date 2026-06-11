export type Person = {
  id: number;
  fullName: string;
  gender?: string | null;
  birthDate?: string | null;
  deathDate?: string | null;
  avatar?: string | null;
  generation?: number | null;
  branch?: number | null;
  birthPlace?: string | null;
  currentLocation?: string | null;
  education?: string | null;
  occupation?: string | null;
  religion?: string | null;
  ethnicity?: string | null;
  achievements?: string | null;
  userId?: number | null;
  organizationId?: number | null;
};

export type Biography = {
  id: number;
  personId: number;
  content: string;
  updatedAt?: string;
};

export type GraveInfo = {
  id: number;
  personId: number;
  cemetery?: string | null;
  address?: string | null;
  notes?: string | null;
  updatedAt?: string;
};

export type PersonDetailPerson = Person & {
  biography?: Biography | null;
  graveInfo?: GraveInfo | null;
};

export type PersonRelationships = {
  father: Person | null;
  mother: Person | null;
  spouses: Person[];
  children: Person[];
};

export type PersonDetail = {
  person: PersonDetailPerson;
  relationships: Relationship[];
};

export type UpdatePersonDetailInput = {
  fullName?: string;
  gender?: string;
  birthDate?: string;
  deathDate?: string;
  avatar?: string;
  generation?: number | null;
  branch?: number | null;
  birthPlace?: string;
  currentLocation?: string;
  education?: string;
  occupation?: string;
  religion?: string;
  ethnicity?: string;
  achievements?: string;
  biography?: string;
  graveInfo?: {
    cemetery?: string;
    address?: string;
    notes?: string;
  };
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
