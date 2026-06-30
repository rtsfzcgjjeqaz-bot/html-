import type { RuntimeVisualIntent } from "../factory/runtimeShotCatalog";
import type { RuntimeSourceKind } from "./runtimeIdentity";
import type { SourceEnvironment } from "./assetLibraryTypes";

export type ShotSelectionFixture = "ai-recommendation" | "price-comparison" | "step-flow";

export type ShotSelectionStatus = "selected" | "safe_fallback" | "optional_skipped" | "blocked";

export type ShotSceneRequiredness = "required" | "optional";

export type ShotFallbackType = "none" | "legacy_runtime_fallback" | "safe_static_fallback" | "explicit_scene_skip";

export type ShotSelectionBlockedCode = "REQUIRED_SCENE_NO_RUNTIME_SHOT" | "OPTIONAL_SCENE_SKIPPED" | "SAFE_FALLBACK_SELECTED" | "LEGACY_SHOT_SELECTION_FALLBACK";

export type TextCapacityLevel = "low" | "medium" | "high" | "unverified";

export type SelectionRuntimeReadiness = "runtime_validated" | "runtime_validation_pending" | "runtime_incompatible" | "source_incomplete" | "rejected";

export type UnifiedShotSelectionContract = {
  assetId: string;
  shotId: string;
  logicalShotId: string;
  runtimeKey: string;
  runtimeSourceKind: RuntimeSourceKind;
  displayName: string;
  sourceEnvironment: SourceEnvironment;
  sourceLibrary: string;
  runtimeReadiness: SelectionRuntimeReadiness;
  selectionAllowed: boolean;
  intents: RuntimeVisualIntent[];
  excludedIntents: RuntimeVisualIntent[];
  semanticTags: string[];
  sceneRoles: string[];
  supportedEvidenceTypes: string[];
  durationRangeFrames: { minFrames: number; preferredFrames: number; maxFrames: number };
  aspectRatio: "16:9" | "9:16" | "1:1" | "unverified";
  textCapacityContract: {
    headline: TextCapacityLevel;
    supportingText: TextCapacityLevel;
    structuredItems: TextCapacityLevel;
  };
  selectionPriority: number;
  duplicateUsePolicy: "avoid_repeat" | "allow_repeat";
  transitionCompatibility: {
    compatible: boolean;
    profileId?: string;
    supportedTransitionPairs: string[];
    supportsOverlap: boolean;
  };
  runtimeEntry: string;
  runtimeExport: string;
  choreographyEntry: string;
  choreographyExport: string;
  requiredAssets: string[];
  visualEnergy: "low" | "medium" | "high";
  compositionType: string;
  motionLanguage: string[];
  provenance: {
    sourceBranch?: string;
    sourcePath?: string;
    sourceShotId?: string;
    macShotSourceBranch?: string;
    macShotSourceCommit?: string;
    macShotPackageHash?: string;
    libraryEntryHash?: string;
    selectionContractHash?: string;
    generatedRuntimeRegistryHash?: string;
  };
  contractHash: string;
  selectionCatalogVersion: string;
  rejectionReason?: string;
};

export type UnifiedShotCandidate = UnifiedShotSelectionContract;

export type ShotSelectionSceneInput = {
  sceneId: number;
  visualIntent: RuntimeVisualIntent;
  sceneRole: string;
  sourceEvidenceTypes: string[];
  semanticKeywords: string[];
  requiredTextFields: Array<"headline" | "supportingText" | "structuredItems">;
  targetDurationFrames: number;
  aspectRatio: "16:9";
  sceneRequiredness?: ShotSceneRequiredness;
};

export type ShotScoreBreakdown = {
  visualIntentMatch: number;
  semanticTagMatch: number;
  sceneRoleMatch: number;
  evidenceTypeMatch: number;
  textCapacityCompatibility: number;
  durationCompatibility: number;
  selectionPriority: number;
  transitionCompatibility: number;
  duplicateUsePenalty: number;
  recentUsePenalty: number;
  visualSimilarityPenalty: number;
  total: number;
};

export type ShotSelectionDecision = {
  sceneId: number;
  visualIntent: RuntimeVisualIntent;
  sceneRole: string;
  semanticKeywords: string[];
  evidenceTypes: string[];
  candidateShotIds: string[];
  candidateRuntimeKeys: string[];
  hardFilteredOutShotIds: string[];
  hardFilteredOutRuntimeKeys: string[];
  topRankedShotIds: string[];
  topRankedRuntimeKeys: string[];
  selectionStatus: ShotSelectionStatus;
  sceneRequiredness: ShotSceneRequiredness;
  selectedShotId?: string;
  logicalShotId?: string;
  selectedRuntimeKey?: string;
  runtimeSourceKind?: RuntimeSourceKind;
  selectedAssetId?: string;
  selectedChoreographyId?: string;
  scoreBreakdown?: ShotScoreBreakdown;
  matchedTags: string[];
  fallbackUsed: boolean;
  fallbackType: ShotFallbackType;
  fallbackReason?: string;
  blockedCode?: ShotSelectionBlockedCode;
  selectedSourceEnvironment?: SourceEnvironment;
  selectedShotScore?: number;
  selectionContractHash?: string;
  selectionCatalogVersion?: string;
  macShotSourceCommit?: string;
  macShotSourceBranch?: string;
  macShotPackageHash?: string;
  libraryEntryHash?: string;
  generatedRuntimeRegistryHash?: string;
};

export type ShotSelectionPlan = {
  fixture?: ShotSelectionFixture;
  runtimeSelectionPlanHash: string;
  selectionCatalogVersion: string;
  selectorCallCount: number;
  decisions: ShotSelectionDecision[];
  debug: {
    sourceEnvironmentNeutral: boolean;
    rejectedMacShotIdsExcluded: string[];
    referenceShotIdsExcluded: string[];
  };
};

export type ShotSelectionQaSummary = {
  status: "passed" | "failed";
  checks: Record<string, boolean>;
  failures: string[];
};
