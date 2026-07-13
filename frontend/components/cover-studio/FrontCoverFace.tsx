"use client";

import type { CoverFrontContent } from "./cover-studio-settings";
import {
  resolveCoverLayout,
  type CoverPaletteId,
  type CoverStyleId,
} from "./cover-templates";
import CenteredFrontFace from "./CenteredFrontFace";
import HeritageFrontFace from "./HeritageFrontFace";
import ImperialFrontFace from "./ImperialFrontFace";

type FrontCoverFaceProps = {
  styleId: CoverStyleId;
  paletteId: CoverPaletteId;
  fontFamily: string;
  content: CoverFrontContent;
};

/** Bìa trước — layout theo loại bố cục + màu. */
export default function FrontCoverFace(props: FrontCoverFaceProps) {
  const layout = resolveCoverLayout(props.styleId, props.paletteId);
  if (layout === "scroll") {
    return (
      <HeritageFrontFace
        paletteId={props.paletteId}
        fontFamily={props.fontFamily}
        content={props.content}
      />
    );
  }
  if (layout === "imperial") {
    return (
      <ImperialFrontFace
        paletteId={props.paletteId}
        fontFamily={props.fontFamily}
        content={props.content}
      />
    );
  }
  return (
    <CenteredFrontFace
      paletteId={props.paletteId}
      fontFamily={props.fontFamily}
      content={props.content}
    />
  );
}
