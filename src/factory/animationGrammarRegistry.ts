export type AnimationGrammarId = "burstStackIn" | "softMaskReveal" | "mapPinDrop" | "scanLineClassify" | "shockSnapIn" | "panelLoadIn" | "depthFloatIn" | "caseUnfold" | "feedStreamIn" | "stepTraceIn" | "multiStreamTicker" | "singleMetricLift" | "routeArcDraw" | "logicNodePulse" | "contrastBarJump" | "dashboardCountUp" | "parallaxLayerShift" | "storyBeatSlide" | "anomalyHighlight" | "progressStepper" | "focusSnap" | "quietUnderline" | "regionPulse" | "confidenceLock" | "priceDeltaPop" | "moduleGlow" | "depthRackFocus" | "problemMarker" | "signalFreeze" | "checkmarkLock" | "compressCut" | "fadeToWhiteSoft" | "mapZoomOut" | "nodeCollapse" | "hardCutSafe" | "gridResolve" | "spacePullback" | "pageTurn" | "feedPushAway" | "stepComplete";

export type AnimationPlan = {
  entrance: AnimationGrammarId;
  dataMotion: AnimationGrammarId;
  emphasis: AnimationGrammarId;
  exit: AnimationGrammarId;
};

const entrances: AnimationGrammarId[] = ["burstStackIn", "softMaskReveal", "mapPinDrop", "scanLineClassify", "shockSnapIn", "panelLoadIn", "depthFloatIn", "caseUnfold", "feedStreamIn", "stepTraceIn"];
const dataMotions: AnimationGrammarId[] = ["multiStreamTicker", "singleMetricLift", "routeArcDraw", "logicNodePulse", "contrastBarJump", "dashboardCountUp", "parallaxLayerShift", "storyBeatSlide", "anomalyHighlight", "progressStepper"];
const emphases: AnimationGrammarId[] = ["focusSnap", "quietUnderline", "regionPulse", "confidenceLock", "priceDeltaPop", "moduleGlow", "depthRackFocus", "problemMarker", "signalFreeze", "checkmarkLock"];
const exits: AnimationGrammarId[] = ["compressCut", "fadeToWhiteSoft", "mapZoomOut", "nodeCollapse", "hardCutSafe", "gridResolve", "spacePullback", "pageTurn", "feedPushAway", "stepComplete"];

export function animationPlanFor(videoIndex: number, sceneIndex: number): AnimationPlan {
  const offset = (videoIndex - 1) % entrances.length;
  return {
    entrance: entrances[(offset + sceneIndex) % entrances.length],
    dataMotion: dataMotions[(offset + sceneIndex) % dataMotions.length],
    emphasis: emphases[(offset + sceneIndex) % emphases.length],
    exit: exits[(offset + sceneIndex) % exits.length],
  };
}
