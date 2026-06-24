export type RiskLevel = "low" | "medium" | "high";

export type FactoryMode = "auto" | "restricted" | "test";

export type StyleProfileId =
  | "ai-tool-promo"
  | "saas-product-promo"
  | "ecommerce-product-promo"
  | "default-promo";

export type AnimationTrackRole =
  | "depth-establish"
  | "camera-glue"
  | "primary-evidence-entry"
  | "message-hierarchy"
  | "semantic-emphasis"
  | "supporting-value-proof"
  | "readability-hold";

export type ChoreographyRegistryEntry = {
  choreographyId: string;
  sceneType: string;
  approved: boolean;
  allowedInFactory: boolean;
  compatibleProfiles: StyleProfileId[];
  compatibleNarratives: string[];
  compatibleLayouts: string[];
  visualStyle: string[];
  riskLevel: RiskLevel;
  atomicMotions: string[];
  durationFrames: {
    min: number;
    preferred: number;
    max: number;
  };
};

export type ChoreographyAnimationTrack = {
  trackId: string;
  motionId: string;
  target: string;
  layer:
    | "background"
    | "camera"
    | "website"
    | "title"
    | "semantic"
    | "search"
    | "results"
    | "comparison"
    | "dashboard"
    | "context"
    | "device"
    | "price"
    | "flow"
    | "icon"
    | "progress"
    | "cta";
  startPercent: number;
  endPercent: number;
  startFrame: number;
  endFrame: number;
  role: AnimationTrackRole | string;
  purpose: string;
  semanticTarget?: string;
};

export type SceneChoreographySelection = {
  choreographyId: string;
  animationTracks: ChoreographyAnimationTrack[];
  motionIds: string[];
  cameraPathId: string;
  layoutId: string;
  transitionId: string;
  durationFrames: number;
};

export type ChoreographyBlockedReason = {
  blocked: true;
  reason:
    | "no-approved-factory-choreographies"
    | "sceneType-not-compatible"
    | "profile-not-compatible"
    | "narrative-not-compatible"
    | "restricted-include-not-matched"
    | "excluded-by-cli"
    | "duplicate-choreography"
    | "duplicate-motion-camera-or-layout";
  details: string;
};

export type ChoreographySelectionResult =
  | ({ blocked: false; entry: ChoreographyRegistryEntry; selection: SceneChoreographySelection })
  | ChoreographyBlockedReason;

export type ChoreographySelectorInput = {
  sceneType: string;
  narrativeId: string;
  profile: StyleProfileId;
  usedChoreographyIds: string[];
  usedMotionIds: string[];
  usedCameraPathIds: string[];
  usedLayoutIds: string[];
  allowedChoreographyIds?: string[];
  excludedChoreographyIds?: string[];
  durationFrames?: number;
};
