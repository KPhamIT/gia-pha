export type Person = {
  id: number;
  fullName: string;
  gender?: string | null;
  birthDate?: string | null;
  deathDate?: string | null;
  deathLunarDay?: number | null;
  deathLunarMonth?: number | null;
  deceased?: boolean | null;
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
  updatedAt?: string | null;
  lastEditedBy?: { id: number; displayName: string } | null;
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

export type PersonEditHistoryEntry = {
  userId: number;
  displayName: string;
  editedAt: string;
};

export type PersonDetail = {
  person: PersonDetailPerson;
  relationships: Relationship[];
  editHistory?: PersonEditHistoryEntry[];
};

export type UpdatePersonDetailInput = {
  fullName?: string;
  gender?: string;
  birthDate?: string;
  deathDate?: string;
  deathLunarDay?: number;
  deathLunarMonth?: number;
  deceased?: boolean;
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

export type RelationshipType = "FATHER" | "MOTHER" | "SPOUSE" | "CHILD";

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

export type UserRole = "SYSTEM" | "ADMIN" | "STANDARD";

export type Organization = {
  id: number;
  name: string;
};

export type AuthUser = {
  id: number;
  email: string | null;
  username: string | null;
  provider: string;
  providerId: string;
  role: UserRole;
  organizationId: number | null;
  organization?: Organization | null;
  person?: { id: number; fullName: string } | null;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
  person: Person | null;
};

export type ThemeMode = "light" | "dark";

export type LayoutConfig = {
  horizontalGap: number;
  verticalStep: number;
  nodeWidth: number;
  nodeHeight: number;
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
  /** Cho phép xóa quan hệ (quyền `editTree`). */
  canEdit?: boolean;
  onRelationshipRemoved?: (relationshipId: number) => void;
};
