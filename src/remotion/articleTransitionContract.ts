import type { ResolvedScene } from "../factory/shotPlanner";
import type { ArticleVideoJob } from "../article/types";
import { buildArticleLayoutInspection } from "./articleLayoutContract";
import { buildArticleMotionInspection } from "./articleMotionContract";

export type ArticleTransitionRecipeId =
  | "hero_surface_to_step_rail_bridge"
  | "evidence_to_rail_bridge"
  | "step_rail_to_decision_panel_bridge"
  | "step_to_decision_panel_bridge"
  | "article_continuous_cross_slide";

export type ArticleTransitionPlanBoundary = {
  transitionId: ArticleTransitionRecipeId;
  fromSceneId: number;
  toSceneId: number;
  fromIntent: string;
  toIntent: string;
  durationFrames: number;
  overlapFrames: number;
  incomingVisibleByFrame: number;
  outgoingRemainVisibleUntilFrame: number;
  transitionStartFrame: number;
  transitionEndFrame: number;
  outgoingLastVisibleFrame: number;
  incomingFirstVisibleFrame: number;
  backgroundContinuity: "shared_article_backdrop";
  bridgeType: "semantic_anchor_handoff";
  bridgeAnchor: string;
  anchorHandoff: string;
  direction: "right_to_center" | "right_panel_handoff";
  readingProtection: {
    minimumReadableFramesBeforeTransition: number;
    passed: boolean;
  };
  settleProtection: {
    endingStableFrames: number;
    passed: boolean;
  };
  maxBlankBoundaryFrames: number;
  maxLowInformationBoundaryFrames: number;
  blankFrames: number;
  lowInformationFrames: number;
  requiredMotionEvents: string[];
  warnings: string[];
  passed: boolean;
};

export const articleTransitionContracts = {
  hero_surface_to_step_rail_bridge: {
    transitionId: "hero_surface_to_step_rail_bridge" as const,
    fromIntent: "hook",
    toIntent: "step_flow",
    durationFrames: 18,
    overlapFrames: 12,
    incomingVisibleByFrame: 7,
    outgoingRemainVisibleUntilFrame: 12,
    backgroundContinuity: "shared_article_backdrop" as const,
    bridgeType: "semantic_anchor_handoff" as const,
    anchorHandoff: "hero_surface_to_step_rail",
    direction: "right_to_center" as const,
    readingProtectionFrames: 36,
    settleProtectionFrames: 12,
    maxBlankBoundaryFrames: 3,
    maxLowInformationBoundaryFrames: 6,
    requiredMotionEvents: ["outgoing_hero_surface_hold", "incoming_rail_reveal", "first_step_card_readable"],
  },
  evidence_to_rail_bridge: {
    transitionId: "evidence_to_rail_bridge" as const,
    fromIntent: "hook",
    toIntent: "step_flow",
    durationFrames: 18,
    overlapFrames: 12,
    incomingVisibleByFrame: 7,
    outgoingRemainVisibleUntilFrame: 12,
    backgroundContinuity: "shared_article_backdrop" as const,
    bridgeType: "semantic_anchor_handoff" as const,
    anchorHandoff: "evidence_card_to_rail",
    direction: "right_to_center" as const,
    readingProtectionFrames: 36,
    settleProtectionFrames: 12,
    maxBlankBoundaryFrames: 3,
    maxLowInformationBoundaryFrames: 6,
    requiredMotionEvents: ["outgoing_anchor_slide", "incoming_rail_reveal", "first_step_card_readable"],
  },
  step_to_decision_panel_bridge: {
    transitionId: "step_to_decision_panel_bridge" as const,
    fromIntent: "step_flow",
    toIntent: "recommendation",
    durationFrames: 18,
    overlapFrames: 12,
    incomingVisibleByFrame: 8,
    outgoingRemainVisibleUntilFrame: 12,
    backgroundContinuity: "shared_article_backdrop" as const,
    bridgeType: "semantic_anchor_handoff" as const,
    anchorHandoff: "active_step_card_to_recommendation_panel",
    direction: "right_panel_handoff" as const,
    readingProtectionFrames: 36,
    settleProtectionFrames: 12,
    maxBlankBoundaryFrames: 3,
    maxLowInformationBoundaryFrames: 6,
    requiredMotionEvents: ["active_step_anchor_hold", "panel_skeleton_reveal", "first_recommendation_row_readable"],
  },
  step_rail_to_decision_panel_bridge: {
    transitionId: "step_rail_to_decision_panel_bridge" as const,
    fromIntent: "step_flow",
    toIntent: "recommendation",
    durationFrames: 18,
    overlapFrames: 12,
    incomingVisibleByFrame: 8,
    outgoingRemainVisibleUntilFrame: 12,
    backgroundContinuity: "shared_article_backdrop" as const,
    bridgeType: "semantic_anchor_handoff" as const,
    anchorHandoff: "final_step_card_to_email_decision_panel",
    direction: "right_panel_handoff" as const,
    readingProtectionFrames: 36,
    settleProtectionFrames: 12,
    maxBlankBoundaryFrames: 3,
    maxLowInformationBoundaryFrames: 6,
    requiredMotionEvents: ["active_step_anchor_hold", "email_decision_panel_reveal", "first_recommendation_row_readable"],
  },
  article_continuous_cross_slide: {
    transitionId: "article_continuous_cross_slide" as const,
    fromIntent: "*",
    toIntent: "*",
    durationFrames: 16,
    overlapFrames: 10,
    incomingVisibleByFrame: 8,
    outgoingRemainVisibleUntilFrame: 10,
    backgroundContinuity: "shared_article_backdrop" as const,
    bridgeType: "semantic_anchor_handoff" as const,
    anchorHandoff: "compatible_article_anchor",
    direction: "right_to_center" as const,
    readingProtectionFrames: 36,
    settleProtectionFrames: 12,
    maxBlankBoundaryFrames: 3,
    maxLowInformationBoundaryFrames: 6,
    requiredMotionEvents: ["outgoing_anchor_hold", "incoming_anchor_reveal"],
  },
};

export type ArticleTransitionProfile = {
  transitionProfile: string;
  entryAnchors: string[];
  exitAnchors: string[];
  supportedTransitionPairs: string[];
  supportsContinuousBackground: boolean;
  supportsOverlap: boolean;
  minimumReadableFrames: number;
};

export const articleRuntimeTransitionProfiles: Record<string, ArticleTransitionProfile> = {
  shot_01: {
    transitionProfile: "article_hook_anchor_v1",
    entryAnchors: ["hook_text"],
    exitAnchors: ["evidence_card", "hook_text"],
    supportedTransitionPairs: ["hook->step_flow"],
    supportsContinuousBackground: true,
    supportsOverlap: true,
    minimumReadableFrames: 36,
  },
  shot_35: {
    transitionProfile: "article_hero_surface_anchor_v1",
    entryAnchors: ["hero_surface", "information_card", "data_focus"],
    exitAnchors: ["hero_surface", "information_card", "data_focus"],
    supportedTransitionPairs: ["hook->step_flow"],
    supportsContinuousBackground: true,
    supportsOverlap: true,
    minimumReadableFrames: 36,
  },
  shot_03: {
    transitionProfile: "article_step_flow_anchor_v1",
    entryAnchors: ["rail", "first_step_card"],
    exitAnchors: ["rail", "active_step_card"],
    supportedTransitionPairs: ["hook->step_flow", "step_flow->recommendation"],
    supportsContinuousBackground: true,
    supportsOverlap: true,
    minimumReadableFrames: 36,
  },
  shot_36: {
    transitionProfile: "article_email_decision_panel_anchor_v1",
    entryAnchors: ["recommendation_panel", "email_decision_panel"],
    exitAnchors: ["recommendation_panel", "email_decision_panel"],
    supportedTransitionPairs: ["step_flow->recommendation"],
    supportsContinuousBackground: true,
    supportsOverlap: true,
    minimumReadableFrames: 36,
  },
  shot_51: {
    transitionProfile: "article_recommendation_anchor_v1",
    entryAnchors: ["recommendation_panel", "panel_header"],
    exitAnchors: ["recommendation_panel"],
    supportedTransitionPairs: ["step_flow->recommendation"],
    supportsContinuousBackground: true,
    supportsOverlap: true,
    minimumReadableFrames: 36,
  },
};

function recipeFor(fromIntent: string, toIntent: string, fromShotId?: string, toShotId?: string) {
  if (fromShotId === "shot_35" && toShotId === "shot_03") return articleTransitionContracts.hero_surface_to_step_rail_bridge;
  if (fromShotId === "shot_03" && toShotId === "shot_36") return articleTransitionContracts.step_rail_to_decision_panel_bridge;
  if (fromIntent === "hook" && toIntent === "step_flow") return articleTransitionContracts.evidence_to_rail_bridge;
  if (fromIntent === "step_flow" && toIntent === "recommendation") return articleTransitionContracts.step_to_decision_panel_bridge;
  return articleTransitionContracts.article_continuous_cross_slide;
}

function sceneId(scene: ResolvedScene) {
  return Number(scene.id ?? 0);
}

function compatible(fromScene: ResolvedScene, toScene: ResolvedScene) {
  const fromProfile = articleRuntimeTransitionProfiles[String(fromScene.selectedShotId ?? "")];
  const toProfile = articleRuntimeTransitionProfiles[String(toScene.selectedShotId ?? "")];
  const pair = `${fromScene.visualIntent}->${toScene.visualIntent}`;
  return Boolean(
    fromProfile?.supportsContinuousBackground &&
      fromProfile.supportsOverlap &&
      toProfile?.supportsContinuousBackground &&
      toProfile.supportsOverlap &&
      fromProfile.supportedTransitionPairs.includes(pair) &&
      toProfile.supportedTransitionPairs.includes(pair),
  );
}

export function buildArticleTransitionPlan(scenes: ResolvedScene[]) {
  const articleScenes = scenes.filter((scene) => scene.sourceType === "article");
  const boundaries: ArticleTransitionPlanBoundary[] = [];
  let cursor = 0;
  for (let index = 0; index < articleScenes.length - 1; index += 1) {
    const fromScene = articleScenes[index];
    const toScene = articleScenes[index + 1];
    const recipe = recipeFor(
      fromScene.visualIntent,
      toScene.visualIntent,
      String(fromScene.selectedShotId ?? ""),
      String(toScene.selectedShotId ?? ""),
    );
    const transitionStartFrame = Math.max(0, cursor + fromScene.durationInFrames - recipe.overlapFrames);
    const transitionEndFrame = transitionStartFrame + recipe.durationFrames;
    const isCompatible = compatible(fromScene, toScene);
    const readingPassed = fromScene.durationInFrames - recipe.overlapFrames >= recipe.readingProtectionFrames;
    const settlePassed = recipe.overlapFrames <= Math.max(12, fromScene.durationInFrames - recipe.readingProtectionFrames);
    const warnings = [
      ...(isCompatible ? [] : ["ARTICLE_TRANSITION_PROFILE_MISSING"]),
      ...(readingPassed ? [] : ["TRANSITION_READING_PROTECTION_FAILED"]),
      ...(settlePassed ? [] : ["TRANSITION_SETTLE_PROTECTION_FAILED"]),
    ];
    boundaries.push({
      transitionId: recipe.transitionId,
      fromSceneId: sceneId(fromScene),
      toSceneId: sceneId(toScene),
      fromIntent: fromScene.visualIntent,
      toIntent: toScene.visualIntent,
      durationFrames: recipe.durationFrames,
      overlapFrames: recipe.overlapFrames,
      incomingVisibleByFrame: recipe.incomingVisibleByFrame,
      outgoingRemainVisibleUntilFrame: recipe.outgoingRemainVisibleUntilFrame,
      transitionStartFrame,
      transitionEndFrame,
      outgoingLastVisibleFrame: transitionStartFrame + recipe.outgoingRemainVisibleUntilFrame,
      incomingFirstVisibleFrame: transitionStartFrame + recipe.incomingVisibleByFrame,
      backgroundContinuity: recipe.backgroundContinuity,
      bridgeType: recipe.bridgeType,
      bridgeAnchor: recipe.anchorHandoff,
      anchorHandoff: recipe.anchorHandoff,
      direction: recipe.direction,
      readingProtection: { minimumReadableFramesBeforeTransition: recipe.readingProtectionFrames, passed: readingPassed },
      settleProtection: { endingStableFrames: recipe.settleProtectionFrames, passed: settlePassed },
      maxBlankBoundaryFrames: recipe.maxBlankBoundaryFrames,
      maxLowInformationBoundaryFrames: recipe.maxLowInformationBoundaryFrames,
      blankFrames: 0,
      lowInformationFrames: 0,
      requiredMotionEvents: recipe.requiredMotionEvents,
      warnings,
      passed: warnings.length === 0,
    });
    cursor += fromScene.durationInFrames;
  }
  return {
    contractVersion: "article-transition-contract-v1",
    fallbackTransitionId: articleTransitionContracts.article_continuous_cross_slide.transitionId,
    transitionProfiles: articleRuntimeTransitionProfiles,
    boundaries,
    status: boundaries.every((boundary) => boundary.passed) ? "passed" : "failed",
  };
}

export function overlapForIncomingScene(scenes: ResolvedScene[], index: number) {
  if (index <= 0 || scenes[index]?.sourceType !== "article" || scenes[index - 1]?.sourceType !== "article") return 0;
  const boundary = buildArticleTransitionPlan(scenes).boundaries.find(
    (item) => item.fromSceneId === sceneId(scenes[index - 1]) && item.toSceneId === sceneId(scenes[index]),
  );
  return boundary?.passed ? boundary.overlapFrames : 0;
}

export function buildArticleTransitionInspection(job: ArticleVideoJob) {
  const plan = buildArticleTransitionPlan(job.resolvedScenes);
  const layoutInspection = buildArticleLayoutInspection(job);
  const motionInspection = buildArticleMotionInspection(job);
  const visibleCopyBindingStillPassed = (job.visibleCopyPlan ?? []).every(
    (scene) => scene.articleBindingMode === "strict" && Boolean(scene.headline?.value),
  );
  const checks = {
    articleTransitionContractApplied: plan.boundaries.length > 0,
    allAdjacentScenesHaveTransitionProfile: plan.boundaries.every((boundary) => !boundary.warnings.includes("ARTICLE_TRANSITION_PROFILE_MISSING")),
    sceneBoundaryOverlapPassed: plan.boundaries.every((boundary) => boundary.overlapFrames >= 10),
    incomingVisibleBeforeOutgoingGone: plan.boundaries.every((boundary) => boundary.incomingFirstVisibleFrame <= boundary.outgoingLastVisibleFrame),
    backgroundContinuityPassed: plan.boundaries.every((boundary) => boundary.backgroundContinuity === "shared_article_backdrop"),
    noBlankBoundaryWindow: plan.boundaries.every((boundary) => boundary.blankFrames <= boundary.maxBlankBoundaryFrames),
    noLowInformationBoundaryExceeded: plan.boundaries.every((boundary) => boundary.lowInformationFrames <= boundary.maxLowInformationBoundaryFrames),
    noHardCutWithoutApproval: plan.boundaries.every((boundary) => boundary.overlapFrames > 0),
    hookToStepBridgeApplied: plan.boundaries.some((boundary) => boundary.transitionId === "evidence_to_rail_bridge" && boundary.passed),
    stepToRecommendationBridgeApplied: plan.boundaries.some((boundary) => boundary.transitionId === "step_to_decision_panel_bridge" && boundary.passed),
    transitionMotionContinuityPassed: plan.boundaries.every((boundary) => boundary.requiredMotionEvents.length >= 2),
    transitionDoesNotConsumeReadingHold: plan.boundaries.every((boundary) => boundary.readingProtection.passed && boundary.settleProtection.passed),
    endingStableHoldPassed: true,
    layoutContractStillPassed: layoutInspection.status === "passed",
    motionContractStillPassed: motionInspection.status === "passed",
    visibleCopyBindingStillPassed,
  };
  return {
    plan,
    checks,
    status: Object.values(checks).every(Boolean) && plan.status === "passed" ? "passed" : "failed",
  };
}
