"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { UI } from "@/lib/constants/ui-strings";
import ShowcaseLightbox from "./ShowcaseLightbox";
import ShowcaseThumb from "./ShowcaseThumb";
import type { ShowcaseItem, ShowcaseTexts } from "./showcase-types";

type Props = {
  serviceKey: string;
  title: string;
  description: string;
  image: { src: string; width: number; height: number };
  alt: string;
};

const TEXTS: Omit<ShowcaseTexts, "dialog"> = {
  order: UI.SHOP_SERVICE_ORDER,
  hint: UI.SHOP_SERVICE_VIEW_HINT,
  hintTouch: UI.SHOP_SERVICE_VIEW_HINT_TOUCH,
};

/** Ảnh mẫu dịch vụ — bấm để xem lớn trong popup 3D như mẫu bìa. */
export default function ServiceImageViewer({ serviceKey, title, description, image, alt }: Props) {
  const [open, setOpen] = useState(false);
  const thumbRef = useRef<HTMLButtonElement | null>(null);
  const ratio = image.height / image.width;

  const item: ShowcaseItem = {
    key: serviceKey,
    label: title,
    description,
    ratio,
    orderRef: serviceKey,
    renderFront: (width) => (
      <Image
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={`${Math.round(width)}px`}
        style={{ width, height: width * ratio }}
        draggable={false}
      />
    ),
  };

  const getThumbRect = useCallback(() => thumbRef.current?.getBoundingClientRect() ?? null, []);
  const handleClose = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => thumbRef.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <>
      <ShowcaseThumb
        buttonRef={(el) => {
          thumbRef.current = el;
        }}
        ariaLabel={UI.SHOP_SERVICE_OPEN(title)}
        hidden={open}
        onOpen={() => setOpen(true)}
        fill
      >
        <Image
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 768px) 45vw, 100vw"
          className="h-full w-full object-cover"
        />
      </ShowcaseThumb>

      {open ? (
        <ShowcaseLightbox
          items={[item]}
          index={0}
          texts={{ ...TEXTS, dialog: title }}
          getThumbRect={getThumbRect}
          onIndexChange={() => {}}
          onClose={handleClose}
        />
      ) : null}
    </>
  );
}
