import JsonLd from "@/components/seo/JsonLd";
import YouTubeLite from "@/components/public/YouTubeLite";
import { UI } from "@/lib/constants/ui-strings";
import { generateVideoSchema } from "@/lib/schema";

/** Video hướng dẫn tạo gia phả từ file Excel (đăng trên YouTube). */
const GUIDE_VIDEO = {
  youtubeId: "y4oqFL9OWt4",
  poster: "/images/landing/video-huong-dan-excel.jpg",
  duration: "1:42",
  isoDuration: "PT1M42S",
  uploadDate: "2026-10-14",
};

/** Khu "Xem hướng dẫn" trên trang chủ: video + 4 bước. */
export default function LandingVideoGuideSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
      <JsonLd
        id="schema-home-video-guide"
        data={generateVideoSchema({
          name: UI.LANDING_VIDEO_TITLE,
          description: UI.LANDING_VIDEO_DESC,
          youtubeId: GUIDE_VIDEO.youtubeId,
          thumbnail: GUIDE_VIDEO.poster,
          uploadDate: GUIDE_VIDEO.uploadDate,
          duration: GUIDE_VIDEO.isoDuration,
        })}
      />
      <div className="grid items-center gap-8 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm md:p-8 lg:grid-cols-[3fr_2fr] lg:gap-10">
        <YouTubeLite
          videoId={GUIDE_VIDEO.youtubeId}
          title={UI.LANDING_VIDEO_TITLE}
          poster={GUIDE_VIDEO.poster}
          duration={GUIDE_VIDEO.duration}
          playLabel={UI.LANDING_VIDEO_PLAY}
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#944a00]">{UI.LANDING_VIDEO_EYEBROW}</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-[#321716] md:text-3xl">{UI.LANDING_VIDEO_TITLE}</h2>
          <p className="mt-3 text-[#504443]">{UI.LANDING_VIDEO_DESC}</p>
          <ol className="mt-5 space-y-3">
            {UI.LANDING_VIDEO_STEPS.map((step, i) => (
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
    </section>
  );
}
