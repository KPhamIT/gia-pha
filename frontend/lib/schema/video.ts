import { SITE, buildAbsoluteUrl } from "@/config/site";

type VideoInput = {
  name: string;
  description: string;
  youtubeId: string;
  /** Ảnh bìa (tương đối hoặc tuyệt đối). */
  thumbnail: string;
  /** Ngày đăng, ISO 8601 (vd. 2026-10-14). */
  uploadDate: string;
  /** Thời lượng ISO 8601 (vd. PT1M42S). */
  duration: string;
};

/** VideoObject cho video YouTube nhúng trên trang — giúp Google hiện video trong kết quả tìm kiếm. */
export function generateVideoSchema(input: VideoInput) {
  return {
    "@type": "VideoObject",
    name: input.name,
    description: input.description,
    thumbnailUrl: [buildAbsoluteUrl(input.thumbnail)],
    uploadDate: input.uploadDate,
    duration: input.duration,
    contentUrl: `https://www.youtube.com/watch?v=${input.youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${input.youtubeId}`,
    inLanguage: SITE.language,
  };
}
