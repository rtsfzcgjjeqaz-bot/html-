import { Easing, interpolate } from "remotion";

export type PriceInsightMotionInput = {
  frame: number;
  durationInFrames: number;
};

export type PriceInsightMotionStyle = {
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
const softPop = Easing.bezier(0.34, 1.22, 0.64, 1);

const pct = (durationInFrames: number, percent: number) => Math.round(durationInFrames * (percent / 100));

export const priceTrackProgress = (
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

export const commerceBackdropDrift = ({ frame, durationInFrames }: PriceInsightMotionInput): PriceInsightMotionStyle => {
  const p = priceTrackProgress(frame, durationInFrames, 0, 100, balanced);
  return {
    transform: `translate3d(${interpolate(p, [0, 1], [14, -9])}px, ${interpolate(p, [0, 1], [8, -7])}px, 0) scale(${interpolate(p, [0, 1], [1.02, 1.045])})`,
  };
};

export const deviceShelfPush = ({ frame, durationInFrames }: PriceInsightMotionInput): PriceInsightMotionStyle => {
  const p = priceTrackProgress(frame, durationInFrames, 5, 34, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [46, 0])}px, ${interpolate(p, [0, 1], [28, 0])}px, 0) rotateY(${interpolate(p, [0, 1], [-7, -2])}deg) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [4, 0])}px)`,
  };
};

export const priceBadgePop = ({ frame, durationInFrames }: PriceInsightMotionInput): PriceInsightMotionStyle => {
  const p = priceTrackProgress(frame, durationInFrames, 18, 46, softPop);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [-34, 0])}px, ${interpolate(p, [0, 1], [22, 0])}px, 0) rotate(${interpolate(p, [0, 1], [-8, -2])}deg) scale(${interpolate(p, [0, 1], [0.72, 1])})`,
  };
};

export const insightPanelSlide = ({ frame, durationInFrames }: PriceInsightMotionInput): PriceInsightMotionStyle => {
  const p = priceTrackProgress(frame, durationInFrames, 34, 66, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [54, 0])}px, ${interpolate(p, [0, 1], [12, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [3, 0])}px)`,
  };
};

export const valueRowsReveal = ({ frame, durationInFrames }: PriceInsightMotionInput, index = 0): PriceInsightMotionStyle => {
  const start = 52 + index * 5;
  const end = Math.min(82, start + 16);
  const p = priceTrackProgress(frame, durationInFrames, start, end, crispOut);
  return {
    opacity: p,
    transform: `translate3d(0, ${interpolate(p, [0, 1], [14, 0])}px, 0) scaleX(${interpolate(p, [0, 1], [0.72, 1])})`,
  };
};

export const savingsEmphasisPulse = ({ frame, durationInFrames }: PriceInsightMotionInput): PriceInsightMotionStyle => {
  const p = priceTrackProgress(frame, durationInFrames, 68, 88, softPop);
  const pulse = interpolate(p, [0, 0.55, 1], [1, 1.08, 1.02]);
  return {
    opacity: p,
    transform: `scale(${pulse})`,
  };
};

export const priceInsightSettle = ({ frame, durationInFrames }: PriceInsightMotionInput): PriceInsightMotionStyle => {
  const p = priceTrackProgress(frame, durationInFrames, 86, 100, balanced);
  return {
    opacity: interpolate(p, [0, 1], [1, 0.985]),
    transform: `translate3d(0, ${interpolate(p, [0, 1], [0, -3])}px, 0) scale(${interpolate(p, [0, 1], [1, 1.003])})`,
  };
};

export const priceInsightSnapAtomicMotions = [
  "commerceBackdropDrift",
  "deviceShelfPush",
  "priceBadgePop",
  "insightPanelSlide",
  "valueRowsReveal",
  "savingsEmphasisPulse",
  "priceInsightSettle",
] as const;
