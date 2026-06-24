import { Easing, interpolate } from "remotion";

export type SearchMotionInput = {
  frame: number;
  durationInFrames: number;
};

export type SearchMotionStyle = {
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

export const searchPercentToFrame = (durationInFrames: number, percent: number) =>
  Math.round(durationInFrames * (percent / 100));

export const searchTrackProgress = (
  frame: number,
  durationInFrames: number,
  startPercent: number,
  endPercent: number,
  easing: (value: number) => number = crispOut,
) =>
  interpolate(
    frame,
    [searchPercentToFrame(durationInFrames, startPercent), searchPercentToFrame(durationInFrames, endPercent)],
    [0, 1],
    { ...clamp, easing },
  );

export const searchBackdropDrift = ({ frame, durationInFrames }: SearchMotionInput): SearchMotionStyle => {
  const p = searchTrackProgress(frame, durationInFrames, 0, 100, balanced);
  return {
    transform: `translate3d(${interpolate(p, [0, 1], [18, -12])}px, ${interpolate(p, [0, 1], [10, -8])}px, 0) scale(${interpolate(p, [0, 1], [1.02, 1.06])})`,
  };
};

export const searchBarReveal = ({ frame, durationInFrames }: SearchMotionInput): SearchMotionStyle => {
  const p = searchTrackProgress(frame, durationInFrames, 8, 28, softPop);
  return {
    opacity: p,
    transform: `translate3d(0, ${interpolate(p, [0, 1], [34, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [4, 0])}px)`,
  };
};

export const queryTypeReveal = ({ frame, durationInFrames }: SearchMotionInput): SearchMotionStyle => {
  const p = searchTrackProgress(frame, durationInFrames, 28, 48, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [-10, 0])}px, 0, 0)`,
  };
};

export const submitPulse = ({ frame, durationInFrames }: SearchMotionInput): SearchMotionStyle => {
  const p = searchTrackProgress(frame, durationInFrames, 46, 58, softPop);
  return {
    opacity: interpolate(p, [0, 1], [0.45, 1]),
    transform: `scale(${interpolate(p, [0, 0.55, 1], [0.9, 1.08, 1])})`,
  };
};

export const resultRowsReveal = (
  { frame, durationInFrames }: SearchMotionInput,
  index = 0,
): SearchMotionStyle => {
  const start = 55 + index * 5;
  const end = Math.min(84, start + 16);
  const p = searchTrackProgress(frame, durationInFrames, start, end, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [42, 0])}px, ${interpolate(p, [0, 1], [16, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
  };
};

export const searchFocusSettle = ({ frame, durationInFrames }: SearchMotionInput): SearchMotionStyle => {
  const p = searchTrackProgress(frame, durationInFrames, 84, 100, balanced);
  return {
    opacity: interpolate(p, [0, 1], [1, 0.98]),
    transform: `translate3d(0, ${interpolate(p, [0, 1], [0, -3])}px, 0) scale(${interpolate(p, [0, 1], [1, 1.004])})`,
  };
};

export const searchTypingThenRowsAtomicMotions = [
  "searchBackdropDrift",
  "searchBarReveal",
  "queryTypeReveal",
  "submitPulse",
  "resultRowsReveal",
  "searchFocusSettle",
] as const;
