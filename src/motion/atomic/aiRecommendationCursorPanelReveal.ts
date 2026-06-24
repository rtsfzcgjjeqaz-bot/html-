import { Easing, interpolate } from "remotion";

export type AiRecommendationMotionInput = {
  frame: number;
  durationInFrames: number;
};

export type AiRecommendationMotionStyle = {
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

export const aiBackdropFloat = ({ frame, durationInFrames }: AiRecommendationMotionInput): AiRecommendationMotionStyle => {
  const p = aiTrackProgress(frame, durationInFrames, 0, 100, balanced);
  return {
    opacity: interpolate(p, [0, 1], [0.9, 1]),
    transform: `translate3d(${interpolate(p, [0, 1], [18, -8])}px, ${interpolate(p, [0, 1], [14, -6])}px, 0) scale(${interpolate(p, [0, 1], [1.03, 1.01])})`,
  };
};

export const cursorTriggerPanel = ({ frame, durationInFrames }: AiRecommendationMotionInput): AiRecommendationMotionStyle => {
  const p = aiTrackProgress(frame, durationInFrames, 18, 74, crispOut);
  return {
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translate3d(${interpolate(p, [0, 1], [-128, 0])}px, ${interpolate(p, [0, 1], [76, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [2, 0])}px)`,
  };
};

export const aiPillPop = ({ frame, durationInFrames }: AiRecommendationMotionInput): AiRecommendationMotionStyle => {
  const p = aiTrackProgress(frame, durationInFrames, 42, 78, softPop);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [18, 0])}px, ${interpolate(p, [0, 1], [10, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
  };
};

export const aiCardSlideIn = ({ frame, durationInFrames }: AiRecommendationMotionInput): AiRecommendationMotionStyle => {
  const p = aiTrackProgress(frame, durationInFrames, 56, 84, crispOut);
  return {
    opacity: interpolate(p, [0, 0.22, 1], [0, 1, 1]),
    transform: `translate3d(${interpolate(p, [0, 1], [92, 0])}px, ${interpolate(p, [0, 1], [20, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.97, 1])})`,
    filter: `blur(${interpolate(p, [0, 1], [4, 0])}px)`,
  };
};

export const aiRecommendationRowsReveal = (
  { frame, durationInFrames }: AiRecommendationMotionInput,
  index = 0,
): AiRecommendationMotionStyle => {
  const start = 72 + index * 4;
  const end = Math.min(94, start + 18);
  const p = aiTrackProgress(frame, durationInFrames, start, end, balanced);
  return {
    opacity: p,
    transform: `translate3d(${interpolate(p, [0, 1], [26, 0])}px, ${interpolate(p, [0, 1], [12, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
  };
};

export const aiRecommendationSettle = ({ frame, durationInFrames }: AiRecommendationMotionInput): AiRecommendationMotionStyle => {
  const p = aiTrackProgress(frame, durationInFrames, 86, 100, balanced);
  return {
    opacity: interpolate(p, [0, 1], [1, 0.985]),
    transform: `translate3d(0, ${interpolate(p, [0, 1], [0, -3])}px, 0) scale(${interpolate(p, [0, 1], [1, 1.004])})`,
  };
};

export const aiRecommendationCursorPanelRevealAtomicMotions = [
  "aiBackdropFloat",
  "cursorTriggerPanel",
  "aiPillPop",
  "aiCardSlideIn",
  "aiRecommendationRowsReveal",
  "aiRecommendationSettle",
] as const;
