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
};
