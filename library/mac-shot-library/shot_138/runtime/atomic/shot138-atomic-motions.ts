import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export type Shot138MotionArgs = {
  frame: number;
  startFrame: number;
  endFrame: number;
};

export const shot138Ease = ({ frame, startFrame, endFrame }: Shot138MotionArgs) =>
  interpolate(frame, [startFrame, endFrame], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export const shot138AtomicMotions = {
  shotId: "shot_138",
  libraryId: "agent-builder-panel-focus",
  choreographyId: "agentBuilderPanelFocus",
};

export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot138AtomicMotionsList: AtomicMotion[] = [
  { id: "builderPanelSlide", label: "Builder Panel Slide", frameRange: [0, 22], purpose: "Reveal the main builder workspace shell.", reusable: true, reviewRisk: "Shell should not feel like a blank card." },
  { id: "configRowHighlight", label: "Config Row Highlight", frameRange: [14, 52], purpose: "Stage configuration rows and emphasize one active row.", reusable: true, reviewRisk: "Selected row must stay readable." },
  { id: "sideCardStackIn", label: "Side Card Stack In", frameRange: [34, 70], purpose: "Introduce supporting feature cards on the right side.", reusable: true, reviewRisk: "Cards should not drift into decoration." },
  { id: "selectedControlLift", label: "Selected Control Lift", frameRange: [28, 56], purpose: "Lift the chosen control with focus and pulse.", reusable: true, reviewRisk: "Pulse must remain restrained." },
  { id: "cameraFocusSettle", label: "Camera Focus Settle", frameRange: [0, 74], purpose: "Carry a gentle push-in that settles on the selected configuration.", reusable: true, reviewRisk: "Push should not crop the layout." },
];

export const shot138AtomicMotionIds = shot138AtomicMotionsList.map((motion) => motion.id);

export const shot138MotionPackageStatus = {
  shotId: "shot_138",
  libraryId: "agent-builder-panel-focus",
  choreographyId: "agentBuilderPanelFocus",
  sceneType: "appGrid",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;
