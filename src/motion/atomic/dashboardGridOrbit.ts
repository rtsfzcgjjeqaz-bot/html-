import { Easing, interpolate } from "remotion";

export type GridMotionInput = {
  frame: number;
  durationInFrames: number;
};

export type GridMotionStyle = {
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

export const gridTrackProgress = (
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

export const gridBackdropParallax = ({ frame, durationInFrames }: GridMotionInput): GridMotionStyle => {
  const p = gridTrackProgress(frame, durationInFrames, 0, 100, balanced);
  return {
    transform: `translate3d(${interpolate(p, [0, 1], [18, -12])}px, ${interpolate(p, [0, 1], [12, -8])}px, 0) scale(${interpolate(p, [0, 1], [1.02, 1.055])})`,
  };
};

export const dashboardFrameOrbit = ({ frame, durationInFrames }: GridMotionInput): GridMotionStyle => {
  const p = gridTrackProgress(frame, durationInFrames, 6, 38, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [70, 0])}px, ${interpolate(p, [0, 1], [40, 0])}px, 0) rotateX(${interpolate(p, [0, 1], [8, 2])}deg) rotateY(${interpolate(p, [0, 1], [-14, -5])}deg) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [4, 0])}px)`,
  };
};

export const gridCellsCascade = ({ frame, durationInFrames }: GridMotionInput, index = 0): GridMotionStyle => {
  const start = Math.min(58, 26 + index * 2);
  const end = Math.min(76, start + 18);
  const p = gridTrackProgress(frame, durationInFrames, start, end, crispOut);
  return {
    opacity: p,
    transform: `translate3d(0, ${interpolate(p, [0, 1], [22, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
  };
};

export const calloutPinsPop = ({ frame, durationInFrames }: GridMotionInput, index = 0): GridMotionStyle => {
  const start = 46 + index * 7;
  const end = Math.min(78, start + 16);
  const p = gridTrackProgress(frame, durationInFrames, start, end, softPop);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [24, 0])}px, ${interpolate(p, [0, 1], [16, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.74, 1])})`,
  };
};

export const columnHighlightSweep = ({ frame, durationInFrames }: GridMotionInput): GridMotionStyle => {
  const p = gridTrackProgress(frame, durationInFrames, 58, 82, balanced);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [-80, 0])}px, 0, 0) scaleX(${interpolate(p, [0, 1], [0.65, 1])})`,
  };
};

export const dashboardSettle = ({ frame, durationInFrames }: GridMotionInput): GridMotionStyle => {
  const p = gridTrackProgress(frame, durationInFrames, 82, 100, balanced);
  return {
    opacity: interpolate(p, [0, 1], [1, 0.98]),
    transform: `translate3d(0, ${interpolate(p, [0, 1], [0, -4])}px, 0) scale(${interpolate(p, [0, 1], [1, 1.004])})`,
  };
};

export const dashboardGridOrbitAtomicMotions = [
  "gridBackdropParallax",
  "dashboardFrameOrbit",
  "gridCellsCascade",
  "calloutPinsPop",
  "columnHighlightSweep",
  "dashboardSettle",
] as const;
