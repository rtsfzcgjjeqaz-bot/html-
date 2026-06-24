export type ExpressionSystemId = "info_explosion" | "apple_minimal" | "global_map" | "ai_decision" | "price_shock" | "dashboard" | "parallax_space" | "narrative_case" | "realtime_feed" | "walkthrough";

export type ExpressionSystem = {
  id: ExpressionSystemId;
  layoutPhilosophy: string;
  cameraGrammar: string;
  motionGrammar: string;
  narrativeLogic: string;
  visualTone: string;
  templateOffset: number;
};

export const expressionSystems: ExpressionSystem[] = [
  { id: "info_explosion", layoutPhilosophy: "multi-stream information UI", cameraGrammar: "impact zoom with snap refocus", motionGrammar: "burst collision resolve", narrativeLogic: "many signals to clarity", visualTone: "bright editorial data burst", templateOffset: 0 },
  { id: "apple_minimal", layoutPhilosophy: "single focal static system", cameraGrammar: "slow push with negative space", motionGrammar: "quiet precision reveal", narrativeLogic: "one insight per scene", visualTone: "premium white minimal", templateOffset: 1 },
  { id: "global_map", layoutPhilosophy: "spatial geography system", cameraGrammar: "regional pan and route flyover", motionGrammar: "pin arc pulse", narrativeLogic: "world to decision", visualTone: "clean cartographic intelligence", templateOffset: 2 },
  { id: "ai_decision", layoutPhilosophy: "input analysis output pipeline", cameraGrammar: "node to node tracking", motionGrammar: "scan classify lock", narrativeLogic: "input to recommendation", visualTone: "calm AI console", templateOffset: 3 },
  { id: "price_shock", layoutPhilosophy: "contrast-first disruption frame", cameraGrammar: "jump cut with hard reframing", motionGrammar: "snap contrast cut", narrativeLogic: "baseline disruption reveal", visualTone: "balanced contrast", templateOffset: 4 },
  { id: "dashboard", layoutPhilosophy: "rigid enterprise grid", cameraGrammar: "orthographic panel build", motionGrammar: "module load synchronize", narrativeLogic: "system loading to overview", visualTone: "enterprise glass dashboard", templateOffset: 5 },
  { id: "parallax_space", layoutPhilosophy: "depth based spatial layers", cameraGrammar: "slow orbit through layers", motionGrammar: "foreground midground drift", narrativeLogic: "entry depth orbit reveal", visualTone: "soft 2.5D space", templateOffset: 0 },
  { id: "narrative_case", layoutPhilosophy: "sequential case story", cameraGrammar: "guided scene-to-scene dolly", motionGrammar: "case card unfold", narrativeLogic: "problem discovery resolution", visualTone: "editorial case film", templateOffset: 1 },
  { id: "realtime_feed", layoutPhilosophy: "continuous streaming updates", cameraGrammar: "feed follow with anomaly pause", motionGrammar: "ticker stream highlight", narrativeLogic: "stream anomaly insight", visualTone: "clean realtime operations", templateOffset: 2 },
  { id: "walkthrough", layoutPhilosophy: "step-by-step UI onboarding", cameraGrammar: "cursorless guided push", motionGrammar: "step trace confirm", narrativeLogic: "onboarding progression", visualTone: "friendly product tour", templateOffset: 3 },
];
