import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";
import type { TreeExportPreset } from "@/lib/family-tree/tree-export-settings";

export const exportPreset = {
  getMine: () =>
    axiosClient
      .get<TreeExportPreset[]>(API_ROUTES.EXPORT_PRESET)
      .then((r) => r.data),
  replaceMine: (presets: TreeExportPreset[]) =>
    axiosClient
      .put<TreeExportPreset[]>(API_ROUTES.EXPORT_PRESET, presets)
      .then((r) => r.data),
};
