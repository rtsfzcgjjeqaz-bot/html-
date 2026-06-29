import type { RuntimeVisualIntent } from "../factory/runtimeShotCatalog";

export type AssetKind = "shot" | "visual_asset" | "ui_asset" | "brand_asset";

export type AssetAvailability = "runtime_callable" | "candidate_only" | "needs_adaptation" | "deprecated";

export type SourceEnvironment = "windows_runtime" | "mac_source" | "transfer_library";

export type AssetSourceLibrary = "windows_runtime_catalog" | "mac_approved_shots" | "transfer_mac_motion_library_v1";

export type PackageStatus =
  | "runtime_validated"
  | "runtime_validation_pending"
  | "runtime_incompatible"
  | "source_incomplete";

export type ChineseTextRisk = "low" | "medium" | "high" | "unverified";

export type DependencyStatus = "verified" | "unverified" | "missing" | "not_integrated";

export type PreviewStatus = "passed" | "pending" | "unverified" | "not_required";

export type AdaptationDifficulty = "low" | "medium" | "high" | "unverified";

export type PackageValidationResults = {
  sourceReadable: boolean;
  sourcePathExists: boolean;
  metadataValid: boolean;
  componentEntryResolvable: boolean;
  choreographyResolvable: boolean;
  propsContractValid: boolean;
  aspectRatioCompatible: boolean;
  chineseTextCapacityValid: boolean;
  evidenceRequirementsValid: boolean;
  dependencyResolvable: boolean;
  previewOrTestAvailable: boolean;
};

export type EvidenceRequirement = {
  requiresTraceableEvidence: boolean;
  allowedValueTypes?: string[];
  minimumEvidenceCount?: number;
  notes: string[];
};

export type ComponentPropsContract = {
  required: string[];
  optional: string[];
};

export type DurationRange = {
  minFrames: number;
  preferredFrames: number;
  maxFrames: number;
};

export type AssetLibraryEntry = {
  assetId: string;
  assetKind: AssetKind;
  availability: AssetAvailability;
  packageStatus: PackageStatus;
  selectionAllowed: boolean;
  validationResults: PackageValidationResults;
  displayName: string;
  sourceEnvironment: SourceEnvironment;
  sourceLibrary: AssetSourceLibrary;
  sourceBranch: string;
  sourcePath: string;
  sourceShotId: string;
  runtimeShotId?: string;
  choreographyId: string;
  supportedVisualIntents: RuntimeVisualIntent[];
  allowedAspectRatios: Array<"16:9" | "9:16" | "1:1" | "unverified">;
  recommendedDurationRange: DurationRange;
  chineseTextRisk: ChineseTextRisk;
  evidenceRequirements: EvidenceRequirement;
  componentPropsContract: ComponentPropsContract;
  dependencyStatus: DependencyStatus;
  previewStatus: PreviewStatus;
  approvedInFactory: boolean;
  suitableForArticle: boolean;
  selectionPriority: number;
  adaptationDifficulty?: AdaptationDifficulty;
  notDirectlyCallableReason?: string;
  notes: string[];
};

export type AssetLibraryValidationCheck = {
  checkId: string;
  passed: boolean;
  details: string[];
};

export type AssetLibraryValidationResult = {
  status: "passed" | "failed";
  checks: Record<string, boolean>;
  checkDetails: AssetLibraryValidationCheck[];
};

export type VisualIntentCoverage = {
  visualIntent: RuntimeVisualIntent;
  selectableAssets: Array<{
    assetId: string;
    sourceEnvironment: SourceEnvironment;
    selectionPriority: number;
    allowedAspectRatios: string[];
    chineseTextRisk: ChineseTextRisk;
    evidenceRequirements: EvidenceRequirement;
  }>;
  rejectedAssets: Array<{
    assetId: string;
    sourceEnvironment: SourceEnvironment;
    packageStatus: PackageStatus;
    failedTechnicalItems: string[];
    reason: string;
  }>;
  hasRuntimeValidatedCoverage: boolean;
  hasCandidateCoverage: boolean;
  status: "runtime_validated" | "candidate_only" | "gap";
};