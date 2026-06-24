import { Easing, interpolate } from "remotion";

export type FinalCtaInput = { frame: number; durationInFrames: number };
export type FinalCtaStyle = { opacity?: number; transform?: string; filter?: string };

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const crispOut = Easing.bezier(0.16, 1, 0.3, 1);
const balanced = Easing.bezier(0.45, 0, 0.55, 1);
const softPop = Easing.bezier(0.34, 1.18, 0.64, 1);
const pct = (durationInFrames: number, percent: number) => Math.round(durationInFrames * (percent / 100));
export const finalCtaProgress = (frame: number, durationInFrames: number, startPercent: number, endPercent: number, easing: (value: number) => number = crispOut) =>
  interpolate(frame, [pct(durationInFrames, startPercent), pct(durationInFrames, endPercent)], [0, 1], { ...clamp, easing });

export const ctaBackdropGlow = ({ frame, durationInFrames }: FinalCtaInput): FinalCtaStyle => {
  const p = finalCtaProgress(frame, durationInFrames, 0, 100, balanced);
  return { transform: `translate3d(${interpolate(p, [0, 1], [12, -10])}px, ${interpolate(p, [0, 1], [8, -7])}px, 0) scale(${interpolate(p, [0, 1], [1.02, 1.045])})` };
};
export const ctaCardsConverge = ({ frame, durationInFrames }: FinalCtaInput, index = 0): FinalCtaStyle => {
  const p = finalCtaProgress(frame, durationInFrames, 6 + index * 5, 36 + index * 5, crispOut);
  const x = [-68, 68, 0][index] ?? 0;
  const y = [28, 28, 64][index] ?? 24;
  return { opacity: p, transform: `translate3d(${interpolate(p, [0, 1], [x, 0])}px, ${interpolate(p, [0, 1], [y, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.9, 1])})`, filter: `blur(${interpolate(p, [0, 1], [4, 0])}px)` };
};
export const finalTitleReveal = ({ frame, durationInFrames }: FinalCtaInput): FinalCtaStyle => {
  const p = finalCtaProgress(frame, durationInFrames, 28, 56, crispOut);
  return { opacity: p, transform: `translate3d(0, ${interpolate(p, [0, 1], [24, 0])}px, 0)` };
};
export const primaryButtonPop = ({ frame, durationInFrames }: FinalCtaInput): FinalCtaStyle => {
  const p = finalCtaProgress(frame, durationInFrames, 48, 72, softPop);
  return { opacity: p, transform: `scale(${interpolate(p, [0, 0.58, 1], [0.82, 1.06, 1])})` };
};
export const proofChipsOrbitIn = ({ frame, durationInFrames }: FinalCtaInput, index = 0): FinalCtaStyle => {
  const p = finalCtaProgress(frame, durationInFrames, 62 + index * 4, 84 + index * 4, crispOut);
  return { opacity: p, transform: `translate3d(${interpolate(p, [0, 1], [index % 2 ? 24 : -24, 0])}px, ${interpolate(p, [0, 1], [20, 0])}px, 0) scale(${interpolate(p, [0, 1], [0.86, 1])})` };
};
export const finalCtaSettle = ({ frame, durationInFrames }: FinalCtaInput): FinalCtaStyle => {
  const p = finalCtaProgress(frame, durationInFrames, 84, 100, balanced);
  return { opacity: interpolate(p, [0, 1], [1, 0.99]), transform: `translate3d(0, ${interpolate(p, [0, 1], [0, -2])}px, 0) scale(${interpolate(p, [0, 1], [1, 1.003])})` };
};
export const finalCtaCardsConvergeAtomicMotions = ["ctaBackdropGlow", "ctaCardsConverge", "finalTitleReveal", "primaryButtonPop", "proofChipsOrbitIn", "finalCtaSettle"] as const;
