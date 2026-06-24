import {
  backgroundParallax,
  cameraPushIn,
  featureCardReveal,
  getHighlightBoxRevealStyle,
  softSettle,
  titleReveal,
  websiteTiltIn,
  type MotionRange,
  type SafeArea,
} from "../presets";
import type { HighlightBounds } from "../presets/highlightBoxReveal";

export type AnimationTrack = {
  motionId:
    | "backgroundParallax"
    | "cameraPushIn"
    | "websiteTiltIn"
    | "titleReveal"
    | "highlightBoxReveal"
    | "featureCardReveal"
    | "softSettle";
  startPct: number;
  endPct: number;
  target: "background" | "camera" | "website" | "title" | "highlight" | "featureCard" | "stage";
};

export const websiteHeroAngledPushInTracks: AnimationTrack[] = [
  { motionId: "backgroundParallax", startPct: 0, endPct: 15, target: "background" },
  { motionId: "cameraPushIn", startPct: 0, endPct: 100, target: "camera" },
  { motionId: "websiteTiltIn", startPct: 5, endPct: 38, target: "website" },
  { motionId: "titleReveal", startPct: 18, endPct: 45, target: "title" },
  { motionId: "highlightBoxReveal", startPct: 40, endPct: 62, target: "highlight" },
  { motionId: "featureCardReveal", startPct: 55, endPct: 85, target: "featureCard" },
  { motionId: "softSettle", startPct: 85, endPct: 100, target: "stage" },
];

const rangeFor = (
  track: AnimationTrack,
  args: MotionRange & { totalFrames: number },
): MotionRange => ({
  frame: args.frame,
  fps: args.fps,
  startFrame: Math.round((track.startPct / 100) * args.totalFrames),
  endFrame: Math.round((track.endPct / 100) * args.totalFrames),
});

const byId = (motionId: AnimationTrack["motionId"]) =>
  websiteHeroAngledPushInTracks.find((track) => track.motionId === motionId)!;

export const websiteHeroAngledPushIn = (
  args: MotionRange & {
    totalFrames: number;
    safeArea: SafeArea;
    highlightBounds: HighlightBounds;
  },
) => {
  const background = backgroundParallax({
    ...rangeFor(byId("backgroundParallax"), args),
    distanceX: 18,
    distanceY: -8,
    safeArea: args.safeArea,
  });
  const camera = cameraPushIn({
    ...rangeFor(byId("cameraPushIn"), args),
    fromScale: 0.965,
    toScale: 1.035,
    distanceX: 16,
    distanceY: 10,
    rotateY: -1.4,
    safeArea: args.safeArea,
  });
  const website = websiteTiltIn({
    ...rangeFor(byId("websiteTiltIn"), args),
    distanceX: 70,
    distanceY: 28,
    rotateX: 2,
    rotateY: -9,
    rotateZ: -1.4,
    safeArea: args.safeArea,
  });
  const title = titleReveal({
    ...rangeFor(byId("titleReveal"), args),
    distanceY: 22,
    distanceX: -18,
    safeArea: args.safeArea,
  });
  const highlight = getHighlightBoxRevealStyle({
    ...rangeFor(byId("highlightBoxReveal"), args),
    bounds: args.highlightBounds,
    safeArea: args.safeArea,
  });
  const featureCard = (index: number) =>
    featureCardReveal({
      ...rangeFor(byId("featureCardReveal"), args),
      index,
      staggerFrames: 5,
      safeArea: args.safeArea,
    });
  const settle = softSettle({
    ...rangeFor(byId("softSettle"), args),
  });

  return { background, camera, website, title, highlight, featureCard, settle };
};
