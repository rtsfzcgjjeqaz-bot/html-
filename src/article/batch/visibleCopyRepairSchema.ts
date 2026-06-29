export type VisibleCopyRepairHistoryEntry = {
  attemptNumber: number;
  targetSceneIds: number[];
  issueIds: string[];
  fieldsChanged: string[];
  preservedEvidenceIds: string[];
  preservedDataDisplayPlan: boolean;
  outcome: "repaired" | "blocked";
  strategy: "safe_omit_optional_supporting_text" | "no_safe_repair";
};
