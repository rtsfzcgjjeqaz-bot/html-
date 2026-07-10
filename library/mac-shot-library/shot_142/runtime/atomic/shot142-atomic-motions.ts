import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export type Shot142MotionArgs = {
  frame: number;
  startFrame: number;
  endFrame: number;
};

export const shot142Ease = ({ frame, startFrame, endFrame }: Shot142MotionArgs) =>
  interpolate(frame, [startFrame, endFrame], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot142AtomicMotions: AtomicMotion[] = [
  { id: "headlineWordBuild", label: "Headline Word Build", frameRange: [0, 34], purpose: "Reveal the main value statement with staggered word timing.", reusable: true, reviewRisk: "Copy must remain short enough to fit." },
  { id: "aiWordColorPop", label: "AI Word Color Pop", frameRange: [18, 46], purpose: "Emphasize the AI keyword with color and slight scale.", reusable: true, reviewRisk: "The emphasis should not overpower the rest of the line." },
  { id: "softGlowPush", label: "Soft Glow Push", frameRange: [0, 62], purpose: "Carry a restrained background glow and soft camera push.", reusable: true, reviewRisk: "Glow must not wash out the text." },
  { id: "statementHold", label: "Statement Hold", frameRange: [52, 75], purpose: "Hold the complete message in a clean readable state.", reusable: true, reviewRisk: "Avoid late drift that makes the shot feel decorative." },
];

export const shot142AtomicMotionIds = shot142AtomicMotions.map((motion) => motion.id);

export const shot142MotionPackageStatus = {
  shotId: "shot_142",
  libraryId: "ai-partner-value-statement",
  choreographyId: "aiPartnerValueStatement",
  sceneType: "featureHighlight",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;

