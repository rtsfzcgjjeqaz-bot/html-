export type MotionGrammarId = "hero_depth_reveal" | "tile_cascade" | "step_trace" | "data_sweep" | "decision_lock" | "system_pullback" | "map_orbit" | "feed_stream" | "shock_cut" | "minimal_hold";

export type MotionGrammar = {
  id: MotionGrammarId;
  animationEvents: [string, string, string, ...string[]];
  usesDepth: boolean;
  allowFadeOnly: false;
};

export const motionGrammars: MotionGrammar[] = [
  { id: "hero_depth_reveal", animationEvents: ["cameraPush", "websiteFrameReveal", "focusMarkerLock"], usesDepth: true, allowFadeOnly: false },
  { id: "tile_cascade", animationEvents: ["tileStagger", "panelLift", "labelTrace"], usesDepth: true, allowFadeOnly: false },
  { id: "step_trace", animationEvents: ["stepBuild", "connectorTrace", "resultLift"], usesDepth: false, allowFadeOnly: false },
  { id: "data_sweep", animationEvents: ["barGrow", "guideSweep", "deltaArrow"], usesDepth: false, allowFadeOnly: false },
  { id: "decision_lock", animationEvents: ["panelResolve", "confidenceFill", "highlightLock"], usesDepth: true, allowFadeOnly: false },
  { id: "system_pullback", animationEvents: ["cameraPullback", "chartSynchronize", "summaryLock"], usesDepth: true, allowFadeOnly: false },
  { id: "map_orbit", animationEvents: ["regionPin", "orbitPan", "routeConnect"], usesDepth: true, allowFadeOnly: false },
  { id: "feed_stream", animationEvents: ["feedScroll", "anomalyPause", "signalHighlight"], usesDepth: false, allowFadeOnly: false },
  { id: "shock_cut", animationEvents: ["hardCut", "contrastSnap", "priceWarningPulse"], usesDepth: false, allowFadeOnly: false },
  { id: "minimal_hold", animationEvents: ["slowPush", "singleFocus", "quietResolve"], usesDepth: false, allowFadeOnly: false },
];

export function motionGrammarFor(index: number) {
  return motionGrammars[index % motionGrammars.length];
}
