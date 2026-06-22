import axiosClient from "@/lib/axiosClient";
import type {
  Relationship,
  RelationshipType,
} from "@/components/types/family-tree-types";
import { API_ROUTES } from "@/lib/constants/api-routes";

type CreateRelationshipDto = {
  fromId: number;
  toId: number;
  type: RelationshipType;
};

export const relationship = {
  list: () =>
    axiosClient
      .get<Relationship[]>(API_ROUTES.RELATIONSHIP_LIST)
      .then((r) => r.data),
  create: (data: CreateRelationshipDto) =>
    axiosClient
      .post<Relationship>(API_ROUTES.RELATIONSHIP_LIST, data)
      .then((r) => r.data),
  delete: (id: number) =>
    axiosClient.delete(API_ROUTES.RELATIONSHIP(id)).then((r) => r.data),
};
