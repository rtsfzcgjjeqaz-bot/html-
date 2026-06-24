import { stepFlowRailTracks } from "./tracks";

export type StepFlowRailChoreography = {
  choreographyId: "stepFlowRail";
  shotId: "shot_03";
  sceneType: "stepFlow";
  approved: false;
  allowedInFactory: false;
  durationSeconds: number;
  animationTracks: typeof stepFlowRailTracks;
};

export const stepFlowRail: StepFlowRailChoreography = {
  choreographyId: "stepFlowRail",
  shotId: "shot_03",
  sceneType: "stepFlow",
  approved: false,
  allowedInFactory: false,
  durationSeconds: 4.8,
  animationTracks: stepFlowRailTracks,
};
