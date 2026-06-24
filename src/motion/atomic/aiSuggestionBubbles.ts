import { Easing, interpolate } from "remotion";

export type AiMotionInput = {
  frame: number;
  durationInFrames: number;
};

export type AiMotionStyle = {
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

export const aiTrackProgress = (
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

export const aiBackdropFloat = ({ frame, durationInFrames }: AiMotionInput): AiMotionStyle => {
  const p = aiTrackProgress(frame, durationInFrames, 0, 100, balanced);
  return {
    transform: `translate3d(${interpolate(p, [0, 1], [16, -10])}px, ${interpolate(p, [0, 1], [10, -8])}px, 0) scale(${interpolate(p, [0, 1], [1.02, 1.05])})`,
  };
};

export const contextPanelReveal = ({ frame, durationInFrames }: AiMotionInput): AiMotionStyle => {
  const p = aiTrackProgress(frame, durationInFrames, 8, 34, crispOut);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [-54, 0])}px, ${interpolate(p, [0, 1], [24, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [4, 0])}px)`,
  };
};

export const suggestionBubbleFloat = ({ frame, durationInFrames }: AiMotionInput, index = 0): AiMotionStyle => {
  const start = 28 + index * 8;
  const end = Math.min(74, start + 22);
  const p = aiTrackProgress(frame, durationInFrames, start, end, softPop);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [54, 0])}px, ${interpolate(p, [0, 1], [30, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.82, 1])})`,
  };
};

export const connectionLineDraw = ({ frame, durationInFrames }: AiMotionInput): AiMotionStyle => {
  const p = aiTrackProgress(frame, durationInFrames, 48, 70, balanced);
  return {
    opacity: p,
    transform: `scaleX(${interpolate(p, [0, 1], [0, 1])})`,
  };
};

export const recommendationEmphasis = ({ frame, durationInFrames }: AiMotionInput): AiMotionStyle => {
  const p = aiTrackProgress(frame, durationInFrames, 66, 86, softPop);
  return {
    opacity: p,
    transform: `translate3d(0, ${interpolate(p, [0, 1], [20, -6])}px, 0) scale(${interpolate(p, [0, 1], [0.92, 1.04])})`,
  };
};

export const aiSuggestionSettle = ({ frame, durationInFrames }: AiMotionInput): AiMotionStyle => {
  const p = aiTrackProgress(frame, durationInFrames, 86, 100, balanced);
  return {
    opacity: interpolate(p, [0, 1], [1, 0.98]),
    transform: `translate3d(0, ${interpolate(p, [0, 1], [0, -3])}px, 0) scale(${interpolate(p, [0, 1], [1, 1.004])})`,
  };
};

export const aiSuggestionBubblesAtomicMotions = [
  "aiBackdropFloat",
  "contextPanelReveal",
  "suggestionBubbleFloat",
  "connectionLineDraw",
  "recommendationEmphasis",
  "aiSuggestionSettle",
] as const;
