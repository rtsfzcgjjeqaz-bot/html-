import { dashboardGridOrbit } from "./choreographies/dashboardGridOrbit";
import { coverHookImpact } from "./choreographies/coverHookImpact";
import { finalCtaCardsConverge } from "./choreographies/finalCtaCardsConverge";
import { priceInsightSnap } from "./choreographies/priceInsightSnap";
import { searchTypingThenRows } from "./choreographies/searchTypingThenRows";
import { splitCompareCards } from "./choreographies/splitCompareCards";
import { stepFlowRail } from "./choreographies/stepFlowRail";
import { websiteHeroAngledPushIn } from "./choreographies/websiteHeroAngledPushIn";
import { websiteHeroCenterStage } from "./choreographies/websiteHeroCenterStage";
import type { ChoreographyAnimationTrack, ChoreographyRegistryEntry } from "./choreographyTypes";

export const choreographyRegistry: ChoreographyRegistryEntry[] = [
  {
    choreographyId: "websiteHeroAngledPushIn",
    sceneType: "websiteHero",
    approved: true,
    allowedInFactory: true,
    compatibleProfiles: ["ai-tool-promo", "saas-product-promo", "default-promo"],
    compatibleNarratives: ["pain_attack", "comparison", "aesthetic", "curiosity", "trust", "desire", "urgency"],
    compatibleLayouts: ["websiteHero", "browserHero", "landingHero"],
    visualStyle: ["clean", "premium", "angled", "browser", "light"],
    riskLevel: "low",
    atomicMotions: [
      "backgroundParallax",
      "cameraPushIn",
      "websiteTiltIn",
      "titleReveal",
      "highlightBoxReveal",
      "featureCardReveal",
      "softSettle",
    ],
    durationFrames: {
      min: 120,
      preferred: 135,
      max: 150,
    },
  },
  {
    choreographyId: "searchTypingThenRows",
    sceneType: "searchDemo",
    approved: true,
    allowedInFactory: true,
    compatibleProfiles: ["ai-tool-promo", "saas-product-promo", "default-promo"],
    compatibleNarratives: ["pain_attack", "comparison", "aesthetic", "curiosity", "trust", "desire", "urgency"],
    compatibleLayouts: ["searchDemo", "searchFlow", "browserSearch"],
    visualStyle: ["clean", "search", "input", "results", "light"],
    riskLevel: "low",
    atomicMotions: [
      "searchBackdropDrift",
      "searchBarReveal",
      "queryTypeReveal",
      "submitPulse",
      "resultRowsReveal",
      "searchFocusSettle",
    ],
    durationFrames: {
      min: 120,
      preferred: 144,
      max: 160,
    },
  },
  {
    choreographyId: "splitCompareCards",
    sceneType: "resultComparison",
    approved: true,
    allowedInFactory: true,
    compatibleProfiles: ["ai-tool-promo", "saas-product-promo", "ecommerce-product-promo", "default-promo"],
    compatibleNarratives: ["pain_attack", "comparison", "aesthetic", "curiosity", "trust", "desire", "urgency"],
    compatibleLayouts: ["resultComparison", "comparisonPanel", "beforeAfter", "splitCompare"],
    visualStyle: ["clean", "comparison", "proof", "cards", "light"],
    riskLevel: "low",
    atomicMotions: [
      "comparisonBackdropDrift",
      "splitPanelsReveal",
      "leftResultSlide",
      "rightResultSlide",
      "comparisonDividerSweep",
      "winnerCardLift",
      "comparisonSettle",
    ],
    durationFrames: {
      min: 120,
      preferred: 144,
      max: 170,
    },
  },
  {
    choreographyId: "dashboardGridOrbit",
    sceneType: "appGrid",
    approved: true,
    allowedInFactory: true,
    compatibleProfiles: ["ai-tool-promo", "saas-product-promo", "default-promo"],
    compatibleNarratives: ["pain_attack", "comparison", "aesthetic", "curiosity", "trust", "desire", "urgency"],
    compatibleLayouts: ["appGrid", "dashboardGrid", "kanbanGrid", "dataBoard"],
    visualStyle: ["clean", "dashboard", "grid", "data", "light"],
    riskLevel: "low",
    atomicMotions: [
      "gridBackdropParallax",
      "dashboardFrameOrbit",
      "gridCellsCascade",
      "calloutPinsPop",
      "columnHighlightSweep",
      "dashboardSettle",
    ],
    durationFrames: {
      min: 120,
      preferred: 144,
      max: 170,
    },
  },
  {
    choreographyId: "priceInsightSnap",
    sceneType: "priceInsight",
    approved: true,
    allowedInFactory: true,
    compatibleProfiles: ["ai-tool-promo", "saas-product-promo", "ecommerce-product-promo", "default-promo"],
    compatibleNarratives: ["pain_attack", "comparison", "aesthetic", "curiosity", "trust", "desire", "urgency"],
    compatibleLayouts: ["priceInsight", "commerceInsight", "pricingCard", "offerPanel"],
    visualStyle: ["clean", "commerce", "price", "proof", "light"],
    riskLevel: "low",
    atomicMotions: [
      "commerceBackdropDrift",
      "deviceShelfPush",
      "priceBadgePop",
      "insightPanelSlide",
      "valueRowsReveal",
      "savingsEmphasisPulse",
      "priceInsightSettle",
    ],
    durationFrames: {
      min: 110,
      preferred: 132,
      max: 150,
    },
  },
  {
    choreographyId: "stepFlowRail",
    sceneType: "stepFlow",
    approved: true,
    allowedInFactory: true,
    compatibleProfiles: ["ai-tool-promo", "saas-product-promo", "default-promo"],
    compatibleNarratives: ["pain_attack", "comparison", "aesthetic", "curiosity", "trust", "desire", "urgency"],
    compatibleLayouts: ["stepFlow", "processRail", "workflowSteps", "onboardingFlow"],
    visualStyle: ["clean", "workflow", "steps", "process", "light"],
    riskLevel: "low",
    atomicMotions: [
      "stepBackdropDrift",
      "processLineDraw",
      "stepCardsCascade",
      "activeStepFocus",
      "toolIconLift",
      "progressMeterReveal",
      "stepFlowSettle",
    ],
    durationFrames: {
      min: 120,
      preferred: 144,
      max: 170,
    },
  },
  {
    choreographyId: "websiteHeroCenterStage",
    sceneType: "websiteHero",
    approved: true,
    allowedInFactory: true,
    compatibleProfiles: ["ai-tool-promo", "saas-product-promo", "ecommerce-product-promo", "default-promo"],
    compatibleNarratives: ["pain_attack", "comparison", "aesthetic", "curiosity", "trust", "desire", "urgency"],
    compatibleLayouts: ["websiteHero", "centerHero", "productHero", "landingHero"],
    visualStyle: ["clean", "centered", "browser", "product", "light"],
    riskLevel: "low",
    atomicMotions: [
      "heroDeskBackdropDrift",
      "laptopFrameRise",
      "browserContentWipe",
      "titlePillReveal",
      "ctaSpotlightPulse",
      "heroHoldSettle",
    ],
    durationFrames: {
      min: 110,
      preferred: 126,
      max: 145,
    },
  },
  {
    choreographyId: "finalCtaCardsConverge",
    sceneType: "finalCTA",
    approved: true,
    allowedInFactory: true,
    compatibleProfiles: ["ai-tool-promo", "saas-product-promo", "ecommerce-product-promo", "default-promo"],
    compatibleNarratives: ["pain_attack", "comparison", "aesthetic", "curiosity", "trust", "desire", "urgency"],
    compatibleLayouts: ["finalCTA", "ctaCards", "endCard", "conversionPanel"],
    visualStyle: ["clean", "cta", "cards", "conversion", "light"],
    riskLevel: "low",
    atomicMotions: [
      "ctaBackdropGlow",
      "ctaCardsConverge",
      "finalTitleReveal",
      "primaryButtonPop",
      "proofChipsOrbitIn",
      "finalCtaSettle",
    ],
    durationFrames: {
      min: 110,
      preferred: 132,
      max: 150,
    },
  },
  {
    choreographyId: "coverHookImpact",
    sceneType: "coverHook",
    approved: true,
    allowedInFactory: true,
    compatibleProfiles: ["ai-tool-promo", "saas-product-promo", "ecommerce-product-promo", "default-promo"],
    compatibleNarratives: ["pain_attack", "comparison", "aesthetic", "curiosity", "trust", "desire", "urgency"],
    compatibleLayouts: ["coverHook", "heroHook", "openingHook", "productHook"],
    visualStyle: ["bold", "clean", "hook", "impact", "light"],
    riskLevel: "medium",
    atomicMotions: [
      "hookBackdropSurge",
      "hookTitleSmashIn",
      "productSlabRise",
      "accentChipsSnap",
      "hookUnderlineSweep",
      "coverHookSettle",
    ],
    durationFrames: {
      min: 100,
      preferred: 126,
      max: 145,
    },
  },
];

const trackDefinitionsByChoreographyId = {
  websiteHeroAngledPushIn: websiteHeroAngledPushIn.animationTracks,
  searchTypingThenRows: searchTypingThenRows.animationTracks,
  splitCompareCards: splitCompareCards.animationTracks,
  dashboardGridOrbit: dashboardGridOrbit.animationTracks,
  priceInsightSnap: priceInsightSnap.animationTracks,
  stepFlowRail: stepFlowRail.animationTracks,
  websiteHeroCenterStage: websiteHeroCenterStage.animationTracks,
  finalCtaCardsConverge: finalCtaCardsConverge.animationTracks,
  coverHookImpact: coverHookImpact.animationTracks,
} as const;

export function getChoreographyEntry(choreographyId: string) {
  return choreographyRegistry.find((entry) => entry.choreographyId === choreographyId);
}

export function getApprovedFactoryChoreographies() {
  return choreographyRegistry.filter((entry) => entry.approved && entry.allowedInFactory);
}

export function getChoreographyTrackDefinitions(choreographyId: string) {
  return trackDefinitionsByChoreographyId[choreographyId as keyof typeof trackDefinitionsByChoreographyId] ?? [];
}

export function materializeAnimationTracks(choreographyId: string, durationFrames: number): ChoreographyAnimationTrack[] {
  return getChoreographyTrackDefinitions(choreographyId).map((track) => ({
    ...track,
    startFrame: Math.round(durationFrames * (track.startPercent / 100)),
    endFrame: Math.round(durationFrames * (track.endPercent / 100)),
  }));
}
