import { backgroundParallax } from "./backgroundParallax";
import { cameraPushIn } from "./cameraPushIn";
import { featureCardReveal } from "./featureCardReveal";
import { highlightBoxReveal } from "./highlightBoxReveal";
import { softSettle } from "./softSettle";
import { titleReveal } from "./titleReveal";
import { websiteTiltIn } from "./websiteTiltIn";

export { backgroundParallax } from "./backgroundParallax";
export { cameraPushIn } from "./cameraPushIn";
export { featureCardReveal } from "./featureCardReveal";
export { HighlightBoxReveal, getHighlightBoxRevealStyle, highlightBoxReveal } from "./highlightBoxReveal";
export { softSettle } from "./softSettle";
export { titleReveal } from "./titleReveal";
export { websiteTiltIn } from "./websiteTiltIn";
export type { MotionRange, MotionStyle, SafeArea } from "./types";

export const motionPresetRegistry = {
  backgroundParallax,
  cameraPushIn,
  websiteTiltIn,
  titleReveal,
  highlightBoxReveal,
  featureCardReveal,
  softSettle,
};

export type MotionPresetId = keyof typeof motionPresetRegistry;

export const resolveMotionPreset = (motionId: string) =>
  motionPresetRegistry[motionId as MotionPresetId];
