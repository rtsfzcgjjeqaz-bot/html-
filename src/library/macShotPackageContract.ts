import type { RuntimeVisualIntent } from "../factory/runtimeShotCatalog";

export const macShotCanonicalContractVersion = "mac-shot-selection-contract-v1";

export type MacShotTextCapacity = {
  headline: "low" | "medium" | "high";
  supportingText: "low" | "medium" | "high";
  structuredItems: "low" | "medium" | "high";
};

export type CanonicalMacShotSelectionContract = {
  schemaVersion: string;
  shotId: string;
  displayName: string;
  sourceEnvironment: "mac_source";
  intents: RuntimeVisualIntent[];
  semanticTags: string[];
  sceneRoles: string[];
  supportedEvidenceTypes: string[];
  excludedIntents: RuntimeVisualIntent[];
  durationRangeFrames: { minFrames: number; preferredFrames: number; maxFrames: number };
  aspectRatio: "16:9" | "9:16" | "1:1";
  textCapacityContract: MacShotTextCapacity;
  selectionPriority: number;
  duplicateUsePolicy: "avoid_repeat" | "allow_repeat";
  runtimeEntry: string;
  runtimeExport: string;
  choreographyEntry: string;
  choreographyExport: string;
  requiredAssets: string[];
  visualEnergy: "low" | "medium" | "high";
  selectionAllowed: boolean;
  sourceLibraryEntryHash: string;
};

export type MacShotContractGap = {
  contractFieldExpected: string;
  actualFieldPath: string;
  fieldTypeDifference: string;
  safeAliasPossible: boolean;
  normalizationAllowed: boolean;
  trueDataMissing: boolean;
  affectedShotIds: string[];
};
