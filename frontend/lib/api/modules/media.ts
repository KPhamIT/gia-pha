import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type UploadedImage = {
  provider: "cloudinary" | "local";
  key: string;
  url: string;
  width?: number;
  height?: number;
  bytes?: number;
};

export type DeleteImageInput = {
  provider: "cloudinary" | "local";
  key: string;
};

export type SystemAssetItem = {
  id: number;
  name: string;
  category: "background" | "scroll" | "couplet" | "other";
  access: "free" | "paid";
  provider: "cloudinary" | "local";
  key: string;
  url: string;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  sortOrder: number;
  createdAt: string;
};

export type DeleteSystemAssetInput = {
  id: number;
};

export const media = {
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return axiosClient
      .post<UploadedImage>(API_ROUTES.MEDIA_IMAGE_UPLOAD, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  deleteImage: (body: DeleteImageInput) =>
    axiosClient
      .delete<{ ok: boolean }>(API_ROUTES.MEDIA_IMAGE_DELETE, { data: body })
      .then((r) => r.data),
  listSystemAssets: () =>
    axiosClient
      .get<SystemAssetItem[]>(API_ROUTES.MEDIA_SYSTEM_ASSETS)
      .then((r) => r.data),
  uploadSystemAsset: (file: File, meta?: { name?: string; category?: string }) => {
    const form = new FormData();
    form.append("file", file);
    if (meta?.name) form.append("name", meta.name);
    if (meta?.category) form.append("category", meta.category);
    return axiosClient
      .post<SystemAssetItem>(API_ROUTES.MEDIA_SYSTEM_ASSETS, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  deleteSystemAsset: (body: DeleteSystemAssetInput) =>
    axiosClient
      .delete<{ ok: boolean }>(API_ROUTES.MEDIA_SYSTEM_ASSETS, { data: body })
      .then((r) => r.data),
};
