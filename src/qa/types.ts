export type CheckStatus = "passed" | "failed" | "warning";

export type ValidatorResult = {
  status: CheckStatus;
  errors: string[];
  warnings: string[];
};

export type QualityGateReport = {
  passed: boolean;
  errors: string[];
  warnings: string[];
  checks: {
    structure: CheckStatus;
    typography: CheckStatus;
    layout: CheckStatus;
    screenshotUsage: CheckStatus;
    motionUsage: CheckStatus;
    semantic: CheckStatus;
    restrictions?: CheckStatus;
    assets?: CheckStatus;
    composition?: CheckStatus;
    visualRichness?: CheckStatus;
    visualDensity?: CheckStatus;
    cameraIntent?: CheckStatus;
    semanticMotion?: CheckStatus;
  };
};

export type SceneRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type QualityScene = {
  id?: number;
  duration?: number;
  textOverlay?: string[];
  textRoles?: string[];
  textRegions?: SceneRegion[];
  cardRegions?: SceneRegion[];
  screenshotRegions?: SceneRegion[];
  chartRegions?: SceneRegion[];
  shapeRegions?: SceneRegion[];
  primaryVisualRegion?: SceneRegion;
  camera?: { shot?: string; motion?: string };
  motionId?: string;
  cameraPathId?: string;
  layoutId?: string;
  visualTemplate?: string;
  transitionId?: string;
  animationEvents?: string[];
  animationPlan?: Record<string, string>;
  content?: { id?: number; purpose?: string; message?: string; dataRefs?: string[] };
  expression?: { visualTemplate?: string; layoutId?: string; motionId?: string; cameraPathId?: string; transitionId?: string; depthPresetId?: string; animationPlan?: Record<string, string> };
  dataFocus?: string[];
  screenshotPolicy?: string;
  depthPresetId?: string;
  semanticShapes?: Array<{ semanticRole?: string; targetRegion?: SceneRegion }>;
  assets?: { image?: string[]; backgroundImage?: string[]; appIcons?: Array<{ appName: string; src: string; alt?: string }> };
  visualIntent?: string;
  semanticMotion?: Record<string, unknown>;
  cameraIntent?: Record<string, unknown>;
  postRenderQa?: Record<string, unknown>;
};

export type QualityStructure = {
  scenes?: QualityScene[];
  analysis?: Record<string, unknown>;
  contentHash?: string;
  lockedContent?: Record<string, unknown>;
  expressionSystemId?: string;
  assets?: Record<string, unknown>;
};

export function resultFrom(errors: string[], warnings: string[] = []): ValidatorResult {
  return { status: errors.length ? "failed" : warnings.length ? "warning" : "passed", errors, warnings };
}
