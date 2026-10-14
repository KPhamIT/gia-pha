"use client";

import { COVER_SAMPLES, ScaledCover, coverLabel, type CoverContent, type CoverSample, type CoverVariant } from "@/components/shop/cover-samples";

type CoverPickerProps = {
  variant: CoverVariant;
  content: CoverContent;
  fontFamily: string;
  value: number;
  onChange: (index: number) => void;
};

/** 6 mẫu bìa (Cover Studio) với tên dòng họ của khách — bấm để chọn. */
export default function CoverPicker({ variant, content, fontFamily, value, onChange }: CoverPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {COVER_SAMPLES.map((sample: CoverSample, index) => {
        const active = index === value;
        return (
          <button
            key={`${sample.styleId}-${sample.paletteId}`}
            type="button"
            onClick={() => onChange(index)}
            aria-pressed={active}
            className={`flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition ${
              active ? "bg-[#fdf1e2] ring-2 ring-[#944a00]" : "hover:bg-[#f6f3ee]"
            }`}
          >
            <span className="overflow-hidden rounded shadow-md">
              <ScaledCover {...sample} width={96} variant={variant} fontFamily={fontFamily} content={content} />
            </span>
            <span className={`text-xs ${active ? "font-semibold text-[#944a00]" : "text-[#504443]"}`}>
              {coverLabel(sample)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
