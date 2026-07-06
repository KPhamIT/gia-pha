"use client";

import Image from "next/image";
import { useState } from "react";
import type { InstallPlatform } from "@/lib/constants/ui-strings/install-page";
import {
  INSTALL_VISUAL_SRC,
} from "@/lib/constants/ui-strings/install-page";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  platform: InstallPlatform;
};

export default function InstallVisualRef({ platform }: Props) {
  const src = INSTALL_VISUAL_SRC[platform];
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return (
      <figure>
        <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-[#d4c3c1] bg-[#f6f3ee] px-6 text-center shadow-sm">
          <p className="text-sm text-[#827472]">
            {UI.INSTALL_VISUAL_PLACEHOLDER}
          </p>
        </div>
        <figcaption className="mt-4 text-center text-xs italic text-[#827472]">
          {UI.INSTALL_VISUAL_CAPTION}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure>
      <div className="relative aspect-square overflow-hidden rounded-xl border border-[#d4c3c1] bg-white shadow-sm">
        <Image
          src={src}
          alt={UI.INSTALL_VISUAL_CAPTION}
          fill
          className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          sizes="(max-width: 1024px) 100vw, 40vw"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <figcaption className="mt-4 text-center text-xs italic text-[#827472]">
        {UI.INSTALL_VISUAL_CAPTION}
      </figcaption>
    </figure>
  );
}
