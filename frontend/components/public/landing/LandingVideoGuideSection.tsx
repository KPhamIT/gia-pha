import JsonLd from "@/components/seo/JsonLd";
import YouTubeLite from "@/components/public/YouTubeLite";
import { UI } from "@/lib/constants/ui-strings";
import { generateVideoSchema } from "@/lib/schema";

/** Các video hướng dẫn đăng trên YouTube, hiện trên trang chủ theo thứ tự. */
const GUIDE_VIDEOS = [
  {
    // Tạo gia phả từ file Excel.
    youtubeId: "y4oqFL9OWt4",
    poster: "/images/landing/video-huong-dan-excel.jpg",
    duration: "1:42",
    isoDuration: "PT1M42S",
    uploadDate: "2026-10-14",
    eyebrow: UI.LANDING_VIDEO_EYEBROW,
    title: UI.LANDING_VIDEO_TITLE,
    desc: UI.LANDING_VIDEO_DESC,
    steps: UI.LANDING_VIDEO_STEPS,
  },
  {
    // In gia phả khổ A0 theo kiểu chọn sẵn.
    youtubeId: "-RPjICib4a4",
    poster: "/images/landing/video-in-gia-pha-a0.jpg",
    duration: "1:42",
    isoDuration: "PT1M42S",
    uploadDate: "2026-10-15",
    eyebrow: UI.LANDING_VIDEO_A0_EYEBROW,
    title: UI.LANDING_VIDEO_A0_TITLE,
    desc: UI.LANDING_VIDEO_A0_DESC,
    steps: UI.LANDING_VIDEO_A0_STEPS,
  },
];

/** Khu "Xem hướng dẫn" trên trang chủ: mỗi video + các bước, xen kẽ trái/phải. */
export default function LandingVideoGuideSection() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 px-4 pb-20 md:px-6">
      {GUIDE_VIDEOS.map((video, index) => {
        const flipped = index % 2 === 1;
        return (
          <div key={video.youtubeId}>
            <JsonLd
              id={`schema-home-video-guide-${index + 1}`}
              data={generateVideoSchema({
                name: video.title,
                description: video.desc,
                youtubeId: video.youtubeId,
                thumbnail: video.poster,
                uploadDate: video.uploadDate,
                duration: video.isoDuration,
              })}
            />
            <div
              className={`grid items-center gap-8 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-8 lg:gap-10 ${
                flipped ? "lg:grid-cols-[2fr_3fr]" : "lg:grid-cols-[3fr_2fr]"
              }`}
            >
              <div className={flipped ? "lg:order-2" : undefined}>
                <YouTubeLite
                  videoId={video.youtubeId}
                  title={video.title}
                  poster={video.poster}
                  duration={video.duration}
                  playLabel={UI.LANDING_VIDEO_PLAY}
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#944a00]">{video.eyebrow}</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-[#321716] md:text-3xl">{video.title}</h2>
                <p className="mt-3 text-[#504443]">{video.desc}</p>
                <ol className="mt-5 space-y-3">
                  {video.steps.map((step, i) => (
                    <li key={step} className="flex items-center gap-3 text-[#3d2b29]">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#4a2c2a] font-serif text-sm font-bold text-[#f3d9a4]">
                        {i + 1}
                      </span>
                      <span className="font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
