import axiosClient from '@/lib/axiosClient';
import type { FamilyTreeData, Person } from '@/components/types/family-tree-types';

type CreatePersonDto = {
  fullName: string;
  gender?: string;
  birthDate?: string;
  avatar?: string;
  generation?: number;
  branch?: number;
};

export const person = {
  list: () => axiosClient.get<Person[]>('/person').then((r) => r.data),
  detail: (id: number) => axiosClient.get<Person>(`/person/${id}`).then((r) => r.data),
  create: (data: CreatePersonDto) => axiosClient.post<Person>('/person', data).then((r) => r.data),
  update: (id: number, data: Partial<CreatePersonDto>) =>
    axiosClient.patch<Person>(`/person/${id}`, data).then((r) => r.data),
  delete: (id: number) => axiosClient.delete(`/person/${id}`).then((r) => r.data),
  getTree: (id: number) => axiosClient.get<FamilyTreeData>(`/person/${id}/tree`).then((r) => r.data),
};
