export type {
  CoverBackContent,
  CoverDesign,
  CoverFrontContent,
  CoverSide,
  CoverStudioStore,
} from "./cover-studio-types";
export {
  cloneDesign,
  createEmptyDesign,
  defaultBackContent,
  defaultFrontContent,
  designsEqual,
} from "./cover-studio-types";
export {
  loadCoverStudioStore,
  persistCoverStudioStore,
  normalizeDesign,
} from "./cover-studio-storage";
