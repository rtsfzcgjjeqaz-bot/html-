import { Easing, interpolate } from "remotion";

export type CompareMotionInput = {
  frame: number;
  durationInFrames: number;
};

export type CompareMotionStyle = {
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

const pct = (durationInFrames: number, percent: number) => Math.round(durationInFrames * (percent / 100));

export const compareTrackProgress = (
  frame: number,
  durationInFrames: number,
  startPercent: number,
  endPercent: number,
  easing: (value: number) => number = crispOut,
) =>
  interpolate(frame, [pct(durationInFrames, startPercent), pct(durationInFrames, endPercent)], [0, 1], {
    ...clamp,
    easing,
  });

export const comparisonBackdropDrift = ({ frame, durationInFrames }: CompareMotionInput): CompareMotionStyle => {
  const p = compareTrackProgress(frame, durationInFrames, 0, 100, balanced);
  return {
    transform: `translate3d(${interpolate(p, [0, 1], [16, -10])}px, ${interpolate(p, [0, 1], [10, -8])}px, 0) scale(${interpolate(p, [0, 1], [1.02, 1.05])})`,
  };
};

export const splitPanelsReveal = ({ frame, durationInFrames }: CompareMotionInput): CompareMotionStyle => {
  const p = compareTrackProgress(frame, durationInFrames, 8, 34, crispOut);
  return {
    opacity: p,
    transform: `translate3d(0, ${interpolate(p, [0, 1], [40, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [4, 0])}px)`,
  };
};

export const leftResultSlide = ({ frame, durationInFrames }: CompareMotionInput): CompareMotionStyle => {
  const p = compareTrackProgress(frame, durationInFrames, 18, 46, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [-70, 0])}px, ${interpolate(p, [0, 1], [20, 0])}px, 0)`,
  };
};

export const rightResultSlide = ({ frame, durationInFrames }: CompareMotionInput): CompareMotionStyle => {
  const p = compareTrackProgress(frame, durationInFrames, 24, 52, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [70, 0])}px, ${interpolate(p, [0, 1], [20, 0])}px, 0)`,
  };
};

export const comparisonDividerSweep = ({ frame, durationInFrames }: CompareMotionInput): CompareMotionStyle => {
  const p = compareTrackProgress(frame, durationInFrames, 42, 60, balanced);
  return {
    opacity: p,
    transform: `scaleY(${interpolate(p, [0, 1], [0, 1])})`,
  };
};

export const winnerCardLift = ({ frame, durationInFrames }: CompareMotionInput): CompareMotionStyle => {
  const p = compareTrackProgress(frame, durationInFrames, 58, 82, softPop);
  return {
    opacity: p,
    transform: `translate3d(0, ${interpolate(p, [0, 1], [28, -10])}px, 0) scale(${interpolate(p, [0, 1], [0.94, 1.03])})`,
  };
};

export const comparisonSettle = ({ frame, durationInFrames }: CompareMotionInput): CompareMotionStyle => {
  const p = compareTrackProgress(frame, durationInFrames, 82, 100, balanced);
  return {
    opacity: interpolate(p, [0, 1], [1, 0.98]),
    transform: `translate3d(0, ${interpolate(p, [0, 1], [0, -3])}px, 0) scale(${interpolate(p, [0, 1], [1, 1.004])})`,
  };
};

export const splitCompareCardsAtomicMotions = [
  "comparisonBackdropDrift",
  "splitPanelsReveal",
  "leftResultSlide",
  "rightResultSlide",
  "comparisonDividerSweep",
  "winnerCardLift",
  "comparisonSettle",
] as const;
