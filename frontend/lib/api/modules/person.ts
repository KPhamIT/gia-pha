import axiosClient from "@/lib/axiosClient";
import type {
  FamilyTreeData,
  Person,
  PersonDetail,
  UpdatePersonDetailInput,
} from "@/components/types/family-tree-types";
import { API_ROUTES } from "@/lib/constants/api-routes";

type CreatePersonDto = {
  fullName: string;
  gender?: string;
  birthDate?: string;
  deathDate?: string;
  deceased?: boolean;
  avatar?: string;
  generation?: number | null;
  branch?: number | null;
  organizationId?: number | null;
  birthPlace?: string;
  currentLocation?: string;
  education?: string;
  occupation?: string;
  religion?: string;
  ethnicity?: string;
  achievements?: string;
};

export type { CreatePersonDto };

export const person = {
  list: () =>
    axiosClient.get<Person[]>(API_ROUTES.PERSON_LIST).then((r) => r.data),
  getAllDetails: () =>
    axiosClient
      .get<PersonDetail[]>(API_ROUTES.PERSON_DETAILS)
      .then((r) => r.data),
  detail: (id: number) =>
    axiosClient.get<Person>(API_ROUTES.PERSON(id)).then((r) => r.data),
  getDetail: (id: number) =>
    axiosClient
      .get<PersonDetail>(API_ROUTES.PERSON_DETAIL(id))
      .then((r) => r.data),
  create: (data: CreatePersonDto) =>
    axiosClient.post<Person>(API_ROUTES.PERSON_LIST, data).then((r) => r.data),
  update: (id: number, data: Partial<CreatePersonDto>) =>
    axiosClient.patch<Person>(API_ROUTES.PERSON(id), data).then((r) => r.data),
  updateDetail: (id: number, data: UpdatePersonDetailInput) =>
    axiosClient
      .patch<PersonDetail>(API_ROUTES.PERSON_DETAIL(id), data)
      .then((r) => r.data),
  delete: (id: number) =>
    axiosClient.delete(API_ROUTES.PERSON(id)).then((r) => r.data),
  getTree: (id: number) =>
    axiosClient
      .get<FamilyTreeData>(API_ROUTES.PERSON_TREE(id))
      .then((r) => r.data),
  getDefaultTree: () =>
    axiosClient
      .get<FamilyTreeData>(API_ROUTES.PERSON_ROOT_TREE)
      .then((r) => r.data),
  getDemoTree: () =>
    axiosClient
      .get<FamilyTreeData>(API_ROUTES.PERSON_DEMO_TREE)
      .then((r) => r.data),
};
