export type PreviewRepairRoute = "re_read_input" | "repair_script" | "repair_visible_copy" | "replan_visual" | "rerender_output" | "manual_review";

export type PreviewRepairPlan = {
  status: "not_needed" | "planned" | "blocked_manual_review";
  repairs: Array<{
    repairId: string;
    issueIds: string[];
    repairRoute: PreviewRepairRoute;
    targetStage: "INPUT_READING" | "SCRIPT_QA" | "VISIBLE_COPY_AND_VISUAL_PLAN" | "PREVIEW_RENDER" | "PREVIEW_QA";
    targetSceneIds: number[];
    selectedAssetIds: string[];
    preserveEvidenceIds: string[];
    preserveVisibleCopyAttemptId?: string;
    preserveScriptAttemptId?: string;
    forbiddenChanges: string[];
    requiredOutcome: string;
    maxAttempts: number;
  }>;
};
