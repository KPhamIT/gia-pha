import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";

import type {
  LevelNodeStyle,
  NodeFontWeight,
  NodeTextCase,
  NodeTextDirection,
} from "@/components/types/family-tree-types";

export type UserSettings = {
  theme?: string;
  horizontalGap?: number;
  verticalStep?: number;
  edgeColor?: string;
  showSpouses?: boolean;
  nodeWidth?: number;
  nodeHeight?: number;
  nodeBgColor?: string;
  nodeTextColor?: string;
  nodeFontSize?: number;
  nodeFontWeight?: NodeFontWeight;
  nodeTextDirection?: NodeTextDirection;
  nodeTextCase?: NodeTextCase;
  levelStyles?: Record<string, LevelNodeStyle>;
  nodeStyles?: Record<string, LevelNodeStyle>;
  [key: string]: unknown;
};

export const settings = {
  getMine: () =>
    axiosClient
      .get<UserSettings | null>(API_ROUTES.SETTINGS)
      .then((r) => r.data),
  upsert: (data: UserSettings) =>
    axiosClient
      .put<UserSettings>(API_ROUTES.SETTINGS, data)
      .then((r) => r.data),
};
