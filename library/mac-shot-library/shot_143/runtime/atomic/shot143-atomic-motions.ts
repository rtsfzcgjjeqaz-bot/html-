import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export type Shot143MotionArgs = {
  frame: number;
  startFrame: number;
  endFrame: number;
};

export const shot143Ease = ({ frame, startFrame, endFrame }: Shot143MotionArgs) =>
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

export const shot143AtomicMotions: AtomicMotion[] = [
  { id: "nodeMapLineDraw", label: "Node Map Line Draw", frameRange: [0, 56], purpose: "Reveal the workflow frame and draw the branch connectors.", reusable: true, reviewRisk: "Lines must stay easy to follow." },
  { id: "activeChipPop", label: "Active Chip Pop", frameRange: [26, 72], purpose: "Emphasize a selected branch or task node.", reusable: true, reviewRisk: "The active node should not overpower the map." },
  { id: "branchPanSettle", label: "Branch Pan Settle", frameRange: [40, 96], purpose: "Settle the graph with a subtle lateral focus shift.", reusable: true, reviewRisk: "Pan drift should not crop the graph." },
  { id: "workflowMapHold", label: "Workflow Map Hold", frameRange: [90, 114], purpose: "Hold the completed branch map in a readable end state.", reusable: true, reviewRisk: "Avoid late motion that turns semantic structure into decoration." },
];

export const shot143AtomicMotionIds = shot143AtomicMotions.map((motion) => motion.id);

export const shot143MotionPackageStatus = {
  shotId: "shot_143",
  libraryId: "branching-workflow-map-reveal",
  choreographyId: "branchingWorkflowMapReveal",
  sceneType: "stepFlow",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;

