import { stepFlowRailAtomicMotions } from "../../atomic/stepFlowRail";

export type StepFlowRailTrack = {
  trackId: string;
  motionId: (typeof stepFlowRailAtomicMotions)[number];
  target: string;
  layer: "background" | "flow" | "semantic" | "icon" | "progress" | "camera";
  startPercent: number;
  endPercent: number;
  role: string;
  purpose: string;
  semanticTarget?: string;
};

export const stepFlowRailTracks: StepFlowRailTrack[] = [
  { trackId: "track-stepBackdropDrift", motionId: "stepBackdropDrift", target: "stepBackdrop", layer: "background", startPercent: 0, endPercent: 100, role: "depth-establish", purpose: "Create a restrained workflow-stage background." },
  { trackId: "track-processLineDraw", motionId: "processLineDraw", target: "processRail", layer: "flow", startPercent: 5, endPercent: 30, role: "flow-structure", purpose: "Draw the process rail left-to-right.", semanticTarget: "stepFlow.rail" },
  { trackId: "track-stepCardsCascade", motionId: "stepCardsCascade", target: "stepCards", layer: "flow", startPercent: 18, endPercent: 56, role: "step-sequence-build", purpose: "Cascade reusable step cards along the rail.", semanticTarget: "stepFlow.cards" },
  { trackId: "track-activeStepFocus", motionId: "activeStepFocus", target: "activeStep", layer: "semantic", startPercent: 38, endPercent: 68, role: "semantic-step-focus", purpose: "Lift and focus the active workflow step.", semanticTarget: "stepFlow.activeStep" },
  { trackId: "track-toolIconLift", motionId: "toolIconLift", target: "toolModule", layer: "icon", startPercent: 52, endPercent: 78, role: "capability-proof", purpose: "Lift a generic capability module near the active step.", semanticTarget: "stepFlow.toolModule" },
  { trackId: "track-progressMeterReveal", motionId: "progressMeterReveal", target: "progressMeter", layer: "progress", startPercent: 66, endPercent: 88, role: "outcome-proof", purpose: "Reveal a compact progress or status proof card.", semanticTarget: "stepFlow.progress" },
  { trackId: "track-stepFlowSettle", motionId: "stepFlowSettle", target: "fullComposition", layer: "camera", startPercent: 86, endPercent: 100, role: "readability-hold", purpose: "Settle the workflow scene for review." },
];
