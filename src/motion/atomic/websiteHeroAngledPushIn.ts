import { Easing, interpolate } from "remotion";

export type MotionInput = {
  frame: number;
  durationInFrames: number;
};

export type MotionStyle = {
  opacity?: number;
  transform?: string;
  filter?: string;
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const crispOut = Easing.bezier(0.16, 1, 0.3, 1);
const balanced = Easing.bezier(0.45, 0, 0.55, 1);
const softPop = Easing.bezier(0.34, 1.24, 0.64, 1);

export const percentToFrame = (durationInFrames: number, percent: number) =>
  Math.round(durationInFrames * (percent / 100));

export const trackProgress = (
  frame: number,
  durationInFrames: number,
  startPercent: number,
  endPercent: number,
  easing: (value: number) => number = crispOut,
) =>
  interpolate(
    frame,
    [percentToFrame(durationInFrames, startPercent), percentToFrame(durationInFrames, endPercent)],
    [0, 1],
    { ...clamp, easing },
  );

export const backgroundParallax = ({ frame, durationInFrames }: MotionInput): MotionStyle => {
  const p = trackProgress(frame, durationInFrames, 0, 15, balanced);
  return {
    opacity: interpolate(p, [0, 1], [0.52, 1]),
    transform: `translate3d(${interpolate(p, [0, 1], [18, -8])}px, ${interpolate(
      p,
      [0, 1],
      [14, -6],
    )}px, 0) scale(${interpolate(p, [0, 1], [1.04, 1])})`,
  };
};

export const cameraPushIn = ({ frame, durationInFrames }: MotionInput): MotionStyle => {
  const p = trackProgress(frame, durationInFrames, 0, 100, balanced);
  return {
    transform: `translate3d(${interpolate(p, [0, 1], [18, -10])}px, ${interpolate(
      p,
      [0, 1],
      [10, -8],
    )}px, 0) scale(${interpolate(p, [0, 1], [0.982, 1.035])})`,
  };
};

export const websiteTiltIn = ({ frame, durationInFrames }: MotionInput): MotionStyle => {
  const p = trackProgress(frame, durationInFrames, 5, 38, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [92, 0])}px, ${interpolate(
      p,
      [0, 1],
      [42, 0],
    )}px, 0) rotateX(${interpolate(p, [0, 1], [8, 0])}deg) rotateY(${interpolate(
      p,
      [0, 1],
      [-16, -5],
    )}deg) scale(${interpolate(p, [0, 1], [0.88, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [3, 0])}px)`,
  };
};

export const titleReveal = ({ frame, durationInFrames }: MotionInput): MotionStyle => {
  const p = trackProgress(frame, durationInFrames, 18, 45, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [-36, 0])}px, ${interpolate(
      p,
      [0, 1],
      [30, 0],
    )}px, 0)`,
    filter: `blur(${interpolate(p, [0, 1], [2, 0])}px)`,
  };
};

export const highlightBoxReveal = ({ frame, durationInFrames }: MotionInput): MotionStyle => {
  const p = trackProgress(frame, durationInFrames, 40, 62, softPop);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [28, 0])}px, ${interpolate(
      p,
      [0, 1],
      [12, 0],
    )}px, 0) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
  };
};

export const featureCardReveal = (
  { frame, durationInFrames }: MotionInput,
  index = 0,
): MotionStyle => {
  const start = 55 + index * 5;
  const end = Math.min(85, start + 20);
  const p = trackProgress(frame, durationInFrames, start, end, softPop);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [46, 0])}px, ${interpolate(
      p,
      [0, 1],
      [26, 0],
    )}px, 0) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
  };
};

export const softSettle = ({ frame, durationInFrames }: MotionInput): MotionStyle => {
  const p = trackProgress(frame, durationInFrames, 85, 100, balanced);
  return {
    opacity: interpolate(p, [0, 1], [1, 0.96]),
    transform: `translate3d(0, ${interpolate(p, [0, 1], [0, -4])}px, 0) scale(${interpolate(
      p,
      [0, 1],
      [1,
      1.006],
    )})`,
  };
};

export const websiteHeroAngledPushInAtomicMotions = [
  "backgroundParallax",
  "cameraPushIn",
  "websiteTiltIn",
  "titleReveal",
  "highlightBoxReveal",
  "featureCardReveal",
  "softSettle",
] as const;
