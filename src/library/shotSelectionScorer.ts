import type { UnifiedShotCandidate, ShotScoreBreakdown, ShotSelectionSceneInput } from "./shotSelectionTypes";

const levelScore = { low: 1, medium: 2, high: 3, unverified: 0 };

function overlap(a: string[], b: string[]) {
  const bSet = new Set(b);
  return a.filter((item) => bSet.has(item));
}

function requiredCapacityPass(candidate: UnifiedShotCandidate, field: keyof UnifiedShotCandidate["textCapacityContract"]) {
  return levelScore[candidate.textCapacityContract[field]] >= 2;
}

export function textCapacityCompatible(candidate: UnifiedShotCandidate, scene: ShotSelectionSceneInput) {
  return scene.requiredTextFields.every((field) => requiredCapacityPass(candidate, field));
}

export function durationCompatible(candidate: UnifiedShotCandidate, scene: ShotSelectionSceneInput) {
  return scene.targetDurationFrames >= candidate.durationRangeFrames.minFrames && scene.targetDurationFrames <= candidate.durationRangeFrames.maxFrames;
}

export function evidenceCompatible(candidate: UnifiedShotCandidate, scene: ShotSelectionSceneInput) {
  if (!scene.sourceEvidenceTypes.length || !candidate.supportedEvidenceTypes.length) return true;
  return overlap(candidate.supportedEvidenceTypes, scene.sourceEvidenceTypes).length > 0;
}

export function scoreShotCandidate(input: {
  candidate: UnifiedShotCandidate;
  scene: ShotSelectionSceneInput;
  alreadySelectedShotIds: string[];
  recentShotIds?: string[];
  previousShot?: UnifiedShotCandidate;
}): ShotScoreBreakdown {
  const { candidate, scene } = input;
  const matchedTags = overlap(candidate.semanticTags, scene.semanticKeywords);
  const visualIntentMatch = candidate.intents.includes(scene.visualIntent) ? 50 : 0;
  const semanticTagMatch = matchedTags.length * 10;
  const sceneRoleMatch = candidate.sceneRoles.includes(scene.sceneRole) ? 12 : 0;
  const evidenceTypeMatch = overlap(candidate.supportedEvidenceTypes, scene.sourceEvidenceTypes).length * 8;
  const textCapacityCompatibility = textCapacityCompatible(candidate, scene) ? 10 : 0;
  const durationCompatibility = durationCompatible(candidate, scene) ? 8 : 0;
  const selectionPriority = candidate.selectionPriority / 10;
  const transitionCompatibility = candidate.transitionCompatibility.compatible ? 6 : 0;
  const duplicateUsePenalty =
    candidate.duplicateUsePolicy !== "allow_repeat" && input.alreadySelectedShotIds.includes(candidate.runtimeKey) ? -100 : 0;
  const recentUsePenalty = input.recentShotIds?.includes(candidate.shotId) ? -12 : 0;
  const visualSimilarityPenalty =
    input.previousShot && overlap(candidate.motionLanguage, input.previousShot.motionLanguage).length >= 3 ? -8 : 0;
  const total =
    visualIntentMatch +
    semanticTagMatch +
    sceneRoleMatch +
    evidenceTypeMatch +
    textCapacityCompatibility +
    durationCompatibility +
    selectionPriority +
    transitionCompatibility +
    duplicateUsePenalty +
    recentUsePenalty +
    visualSimilarityPenalty;
  return {
    visualIntentMatch,
    semanticTagMatch,
    sceneRoleMatch,
    evidenceTypeMatch,
    textCapacityCompatibility,
    durationCompatibility,
    selectionPriority,
    transitionCompatibility,
    duplicateUsePenalty,
    recentUsePenalty,
    visualSimilarityPenalty,
    total,
  };
}

export function matchedSemanticTags(candidate: UnifiedShotCandidate, scene: ShotSelectionSceneInput) {
  return overlap(candidate.semanticTags, scene.semanticKeywords);
}
