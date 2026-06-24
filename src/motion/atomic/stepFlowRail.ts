import { Easing, interpolate } from "remotion";

export type StepFlowMotionInput = {
  frame: number;
  durationInFrames: number;
};

export type StepFlowMotionStyle = {
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
const softPop = Easing.bezier(0.34, 1.18, 0.64, 1);

const pct = (durationInFrames: number, percent: number) => Math.round(durationInFrames * (percent / 100));

export const stepTrackProgress = (
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

export const stepBackdropDrift = ({ frame, durationInFrames }: StepFlowMotionInput): StepFlowMotionStyle => {
  const p = stepTrackProgress(frame, durationInFrames, 0, 100, balanced);
  return {
    transform: `translate3d(${interpolate(p, [0, 1], [18, -12])}px, ${interpolate(p, [0, 1], [9, -8])}px, 0) scale(${interpolate(p, [0, 1], [1.02, 1.045])})`,
  };
};

export const processLineDraw = ({ frame, durationInFrames }: StepFlowMotionInput): StepFlowMotionStyle => {
  const p = stepTrackProgress(frame, durationInFrames, 5, 30, balanced);
  return {
    opacity: p,
    transform: `scaleX(${interpolate(p, [0, 1], [0, 1])})`,
  };
};

export const stepCardsCascade = ({ frame, durationInFrames }: StepFlowMotionInput, index = 0): StepFlowMotionStyle => {
  const start = 18 + index * 7;
  const end = Math.min(62, start + 20);
  const p = stepTrackProgress(frame, durationInFrames, start, end, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [-24, 0])}px, ${interpolate(p, [0, 1], [26, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.92, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [3, 0])}px)`,
  };
};

export const activeStepFocus = ({ frame, durationInFrames }: StepFlowMotionInput): StepFlowMotionStyle => {
  const p = stepTrackProgress(frame, durationInFrames, 38, 68, softPop);
  return {
    opacity: p,
    transform: `translate3d(0, ${interpolate(p, [0, 1], [14, -4])}px, 0) scale(${interpolate(p, [0, 1], [0.94, 1.04])})`,
  };
};

export const toolIconLift = ({ frame, durationInFrames }: StepFlowMotionInput): StepFlowMotionStyle => {
  const p = stepTrackProgress(frame, durationInFrames, 52, 78, softPop);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [34, 0])}px, ${interpolate(p, [0, 1], [42, 0])}px, 0) rotate(${interpolate(p, [0, 1], [5, 0])}deg) scale(${interpolate(p, [0, 1], [0.78, 1])})`,
  };
};

export const progressMeterReveal = ({ frame, durationInFrames }: StepFlowMotionInput): StepFlowMotionStyle => {
  const p = stepTrackProgress(frame, durationInFrames, 66, 88, crispOut);
  return {
    opacity: p,
    transform: `translate3d(0, ${interpolate(p, [0, 1], [18, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
  };
};

export const stepFlowSettle = ({ frame, durationInFrames }: StepFlowMotionInput): StepFlowMotionStyle => {
  const p = stepTrackProgress(frame, durationInFrames, 86, 100, balanced);
  return {
    opacity: interpolate(p, [0, 1], [1, 0.985]),
    transform: `translate3d(0, ${interpolate(p, [0, 1], [0, -3])}px, 0) scale(${interpolate(p, [0, 1], [1, 1.003])})`,
  };
};

export const stepFlowRailAtomicMotions = [
  "stepBackdropDrift",
  "processLineDraw",
  "stepCardsCascade",
  "activeStepFocus",
  "toolIconLift",
  "progressMeterReveal",
  "stepFlowSettle",
] as const;
