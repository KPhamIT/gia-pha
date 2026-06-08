import axiosClient from '@/lib/axiosClient';
import type { Relationship, RelationshipType } from '@/components/types/family-tree-types';

type CreateRelationshipDto = {
  fromId: number;
  toId: number;
  type: RelationshipType;
};

export const relationship = {
  list: () => axiosClient.get<Relationship[]>('/relationship').then((r) => r.data),
  create: (data: CreateRelationshipDto) =>
    axiosClient.post<Relationship>('/relationship', data).then((r) => r.data),
  delete: (id: number) => axiosClient.delete(`/relationship/${id}`).then((r) => r.data),
};
