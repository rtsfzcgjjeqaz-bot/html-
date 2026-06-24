import { Easing, interpolate } from "remotion";

export type CenterHeroMotionInput = {
  frame: number;
  durationInFrames: number;
};

export type CenterHeroMotionStyle = {
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
const softPop = Easing.bezier(0.34, 1.14, 0.64, 1);

const pct = (durationInFrames: number, percent: number) => Math.round(durationInFrames * (percent / 100));

export const centerHeroProgress = (
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

export const heroDeskBackdropDrift = ({ frame, durationInFrames }: CenterHeroMotionInput): CenterHeroMotionStyle => {
  const p = centerHeroProgress(frame, durationInFrames, 0, 100, balanced);
  return {
    transform: `translate3d(${interpolate(p, [0, 1], [-10, 10])}px, ${interpolate(p, [0, 1], [6, -5])}px, 0) scale(${interpolate(p, [0, 1], [1.015, 1.035])})`,
  };
};

export const laptopFrameRise = ({ frame, durationInFrames }: CenterHeroMotionInput): CenterHeroMotionStyle => {
  const p = centerHeroProgress(frame, durationInFrames, 4, 32, crispOut);
  return {
    opacity: p,
    transform: `translate3d(0, ${interpolate(p, [0, 1], [44, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [4, 0])}px)`,
  };
};

export const browserContentWipe = ({ frame, durationInFrames }: CenterHeroMotionInput): CenterHeroMotionStyle => {
  const p = centerHeroProgress(frame, durationInFrames, 20, 48, crispOut);
  return {
    opacity: p,
    transform: `translate3d(0, ${interpolate(p, [0, 1], [24, 0])}px, 0) scaleY(${interpolate(p, [0, 1], [0.86, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [3, 0])}px)`,
  };
};

export const titlePillReveal = ({ frame, durationInFrames }: CenterHeroMotionInput): CenterHeroMotionStyle => {
  const p = centerHeroProgress(frame, durationInFrames, 34, 60, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [-22, 0])}px, ${interpolate(p, [0, 1], [-12, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
  };
};

export const ctaSpotlightPulse = ({ frame, durationInFrames }: CenterHeroMotionInput): CenterHeroMotionStyle => {
  const p = centerHeroProgress(frame, durationInFrames, 52, 78, softPop);
  return {
    opacity: p,
    transform: `scale(${interpolate(p, [0, 0.56, 1], [0.82, 1.06, 1])})`,
  };
};

export const heroHoldSettle = ({ frame, durationInFrames }: CenterHeroMotionInput): CenterHeroMotionStyle => {
  const p = centerHeroProgress(frame, durationInFrames, 78, 100, balanced);
  return {
    opacity: interpolate(p, [0, 1], [1, 0.988]),
    transform: `translate3d(0, ${interpolate(p, [0, 1], [0, -2])}px, 0) scale(${interpolate(p, [0, 1], [1, 1.004])})`,
  };
};

export const websiteHeroCenterStageAtomicMotions = [
  "heroDeskBackdropDrift",
  "laptopFrameRise",
  "browserContentWipe",
  "titlePillReveal",
  "ctaSpotlightPulse",
  "heroHoldSettle",
] as const;
