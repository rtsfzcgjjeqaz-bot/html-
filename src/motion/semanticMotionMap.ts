export type SemanticMotionBinding = "websiteScreenshot" | "appIcon" | "countryData" | "priceSignal" | "aiDecision" | "chart" | "stepFlow";

export type SemanticMotionSpec = {
  template: string;
  bindings: SemanticMotionBinding[];
  events: string[];
};

const specs: SemanticMotionSpec[] = [
  { template: "websiteHero", bindings: ["websiteScreenshot", "priceSignal"], events: ["websiteFrameReveal", "proofCardLift", "valueLock", "stageSettle"] },
  { template: "appGrid", bindings: ["appIcon"], events: ["iconCascade", "serviceGroupSettle", "labelResolve", "gridLock"] },
  { template: "searchFlow", bindings: ["stepFlow", "aiDecision"], events: ["stepBuild", "queryTrace", "routeConfirm", "stepLock"] },
  { template: "comparisonPanel", bindings: ["countryData", "priceSignal", "chart"], events: ["barGrow", "countrySort", "deltaHighlight", "comparisonLock"] },
  { template: "recommendationPanel", bindings: ["aiDecision", "priceSignal"], events: ["decisionScan", "confidenceFill", "routeLock", "recommendationSettle"] },
  { template: "dynamicChart", bindings: ["chart", "countryData", "priceSignal"], events: ["chartSweep", "axisResolve", "summaryPullback", "systemSettle"] },
  { template: "iconRail", bindings: ["appIcon"], events: ["iconRailEnter", "iconFocus", "brandSettle", "railLock"] },
  { template: "signalBoard", bindings: ["priceSignal", "countryData", "aiDecision"], events: ["signalCardsBuild", "signalCompare", "systemLock", "boardSettle"] },
];

export function semanticMotionForTemplate(template: string): SemanticMotionSpec {
  return specs.find((spec) => spec.template === template) ?? { template, bindings: ["priceSignal"], events: ["componentEnter", "dataResolve", "focusSettle", "safeSettle"] };
}

export function isForbiddenMotionName(value: string) {
  return /decorativeHud|floatingLabel|randomScanLine|unboundShape|meaninglessArrow|random/i.test(value);
}
