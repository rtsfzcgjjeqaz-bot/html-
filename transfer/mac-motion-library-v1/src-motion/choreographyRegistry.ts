import type React from "react";
import {
  websiteHeroAngledPushIn,
  websiteHeroAngledPushInTracks,
} from "./choreographies/websiteHeroAngledPushIn";
import {
  SHOT_08_DURATION_FRAMES,
  Shot08AIRecommendationChoreography,
} from "./choreographies/aiRecommendationCursorPanelReveal";
import {
  SHOT_11_DURATION_FRAMES,
  Shot11ResultComparisonChoreography,
} from "./choreographies/resultComparisonBigNumberBurst";
import {
  SHOT_24_DURATION_FRAMES,
  Shot24StepFlowChoreography,
} from "./choreographies/stepFlowProductModuleFanout";
import {
  SHOT_26_DURATION_FRAMES,
  Shot26AppGridChoreography,
} from "./choreographies/appGridTiltedDashboardCallout";
import {
  SHOT_28_DURATION_FRAMES,
  Shot28StepFlowChoreography,
} from "./choreographies/stepFlowTimelineCalculation";
import {
  SHOT_31_DURATION_FRAMES,
  Shot31FinalCTAChoreography,
} from "./choreographies/finalCtaBrandEndCard";

export type ChoreographyComponentProps = {
  scene?: unknown;
};

export type RegistryEntry = {
  id: string;
  libraryId?: string;
  sourceShotId?: string;
  sceneType: string;
  visualApproved: boolean;
  implementationVerified: boolean;
  approved: boolean;
  allowedInFactory: boolean;
  durationInFrames?: number;
  actionBreakdownPath?: string;
  atomicMotionsPath?: string;
  choreographyPath?: string;
  catalogEntryPath?: string;
  animationTracks?: readonly { motionId: string }[];
  compose?: (...args: any[]) => unknown;
  Component?: React.ComponentType<ChoreographyComponentProps>;
};

export const choreographyRegistry: Record<string, RegistryEntry> = {
  websiteHeroAngledPushIn: {
    id: "websiteHeroAngledPushIn",
    sceneType: "websiteHero",
    visualApproved: true,
    implementationVerified: false,
    approved: false,
    allowedInFactory: false,
    animationTracks: websiteHeroAngledPushInTracks,
    compose: websiteHeroAngledPushIn,
  },
  aiRecommendationCursorPanelReveal: {
    id: "aiRecommendationCursorPanelReveal",
    libraryId: "ai-recommendation-cursor-panel-reveal",
    sourceShotId: "shot_08",
    sceneType: "aiRecommendation",
    visualApproved: true,
    implementationVerified: true,
    approved: true,
    allowedInFactory: true,
    durationInFrames: SHOT_08_DURATION_FRAMES,
    actionBreakdownPath: "src/motion/shot_08/shot08-action-breakdown.md",
    atomicMotionsPath: "src/motion/shot_08/shot08-atomic-motions.ts",
    choreographyPath: "src/motion/shot_08/shot08-choreography.tsx",
    catalogEntryPath: "src/motion/catalog/ai-recommendation-cursor-panel-reveal.library-entry.ts",
    Component: Shot08AIRecommendationChoreography,
  },
  resultComparisonBigNumberBurst: {
    id: "resultComparisonBigNumberBurst",
    libraryId: "result-comparison-big-number-burst",
    sourceShotId: "shot_11",
    sceneType: "resultComparison",
    visualApproved: true,
    implementationVerified: true,
    approved: true,
    allowedInFactory: true,
    durationInFrames: SHOT_11_DURATION_FRAMES,
    actionBreakdownPath: "src/motion/shot_11/shot11-action-breakdown.md",
    atomicMotionsPath: "src/motion/shot_11/shot11-atomic-motions.ts",
    choreographyPath: "src/motion/shot_11/shot11-choreography.tsx",
    catalogEntryPath: "src/motion/catalog/result-comparison-big-number-burst.library-entry.ts",
    Component: Shot11ResultComparisonChoreography,
  },
  stepFlowProductModuleFanout: {
    id: "stepFlowProductModuleFanout",
    libraryId: "step-flow-product-module-fanout",
    sourceShotId: "shot_24",
    sceneType: "stepFlow",
    visualApproved: true,
    implementationVerified: true,
    approved: true,
    allowedInFactory: true,
    durationInFrames: SHOT_24_DURATION_FRAMES,
    actionBreakdownPath: "src/motion/shot_24/shot24-action-breakdown.md",
    atomicMotionsPath: "src/motion/shot_24/shot24-atomic-motions.ts",
    choreographyPath: "src/motion/shot_24/shot24-choreography.tsx",
    catalogEntryPath: "src/motion/catalog/step-flow-product-module-fanout.library-entry.ts",
    Component: Shot24StepFlowChoreography,
  },
  appGridTiltedDashboardCallout: {
    id: "appGridTiltedDashboardCallout",
    libraryId: "app-grid-tilted-dashboard-callout",
    sourceShotId: "shot_26",
    sceneType: "appGrid",
    visualApproved: true,
    implementationVerified: true,
    approved: true,
    allowedInFactory: true,
    durationInFrames: SHOT_26_DURATION_FRAMES,
    actionBreakdownPath: "src/motion/shot_26/shot26-action-breakdown.md",
    atomicMotionsPath: "src/motion/shot_26/shot26-atomic-motions.ts",
    choreographyPath: "src/motion/shot_26/shot26-choreography.tsx",
    catalogEntryPath: "src/motion/catalog/app-grid-tilted-dashboard-callout.library-entry.ts",
    Component: Shot26AppGridChoreography,
  },
  stepFlowTimelineCalculation: {
    id: "stepFlowTimelineCalculation",
    libraryId: "step-flow-timeline-calculation",
    sourceShotId: "shot_28",
    sceneType: "stepFlow",
    visualApproved: true,
    implementationVerified: true,
    approved: true,
    allowedInFactory: true,
    durationInFrames: SHOT_28_DURATION_FRAMES,
    actionBreakdownPath: "src/motion/shot_28/shot28-action-breakdown.md",
    atomicMotionsPath: "src/motion/shot_28/shot28-atomic-motions.ts",
    choreographyPath: "src/motion/shot_28/shot28-choreography.tsx",
    catalogEntryPath: "src/motion/catalog/step-flow-timeline-calculation.library-entry.ts",
    Component: Shot28StepFlowChoreography,
  },
  finalCtaBrandEndCard: {
    id: "finalCtaBrandEndCard",
    libraryId: "final-cta-brand-end-card",
    sourceShotId: "shot_31",
    sceneType: "finalCTA",
    visualApproved: true,
    implementationVerified: true,
    approved: true,
    allowedInFactory: true,
    durationInFrames: SHOT_31_DURATION_FRAMES,
    actionBreakdownPath: "src/motion/shot_31/shot31-action-breakdown.md",
    atomicMotionsPath: "src/motion/shot_31/shot31-atomic-motions.ts",
    choreographyPath: "src/motion/shot_31/shot31-choreography.tsx",
    catalogEntryPath: "src/motion/catalog/final-cta-brand-end-card.library-entry.ts",
    Component: Shot31FinalCTAChoreography,
  },
};

export type ChoreographyId = keyof typeof choreographyRegistry;

export const resolveChoreography = (choreographyId: string) =>
  choreographyRegistry[choreographyId as ChoreographyId];
